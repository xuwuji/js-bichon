--Sales per Thousand Impression: quantity(app_buyer_l2_v.prd_health_mon_gmv_impr_srp -> app_buyer_t.prd_health_mon_gmv)/impr_cnt (app_buyer_l2_v.prd_health_mon_gmv_impr_srp -> app_buyer_t.prd_health_mon_imp)(SUM(imp_cnt) AS impr_cnt)
 
/* *********************************************************************
# Title       : Product Health Monitor GMV Load
# Filename    : app_buyer.prd_health_mon_gmv.ins.sql
# Description : Load GMV data for PHM
# 
# Parameters  : 
# Explanation : 
# Location    : $DW_SQL/
# Called by   : UC4 ()
#
# Date        Ver#   Modified By(Name)     Change and Reason for Change
# --------   -----  ---------------------- -----------------------------
# 03/23/2014  0.1    Alfred             Initial Version
# 04/23/2014  1.0    Alfred             Productionize
# 05/04/2014  2.0    Alfred             Change to Mobile split
# 12/02/2014  3.0    Harper, Gu         Add Full Site Data
#********************************************************************* */

.MAXERROR 1;

delete from app_buyer_t.prd_health_mon_gmv
where cal_dt >=  '2014-12-12'
and cal_dt < '2014-12-13';


insert into app_buyer_t.prd_health_mon_gmv
(
cal_dt                        
,action_site                   
,cobrand
,app_id                      
,sales
,quantity
,gmv                           
)
select created_dt,
			trans_site_id,
			Platform,
			app_id,
			count(transaction_id) as sales,
			sum(quantity) as quantity,
			sum(item_price*quantity*LSTG_CURNCY_EXCHNG_RATE) as gmv
from 
(sel co.item_id,
       co.transaction_id,
       co.BUYER_ID,
       co.seller_id,
       co.SESS_SESSION_START_DT,
       co.created_Dt,
       co.trans_site_id,
       co.item_site_id,   
       co.BUYER_COUNTRY_ID,
       case when apps.prdct_name is null then 'Core Site' else 'Mobile' end as closing_API,            
       case when apps.prdct_name is null then 'Core Site'else apps.prdct_name end as closing_API_detail, 
       sess_cobrand Platform, 
       CASE WHEN apps.app_id IS NULL then null 
                            WHEN TRIM(apps.prdct_name) IN ('IPhoneApp' ) THEN 1462
                            WHEN TRIM(apps.prdct_name) IN ('Android','Android Motors') THEN 2571
                            WHEN TRIM(apps.prdct_name) IN ('IPad') THEN 2878
                            WHEN TRIM(apps.prdct_name) IN ('MobWeb','MobWebGXO') THEN 3564
                            ELSE  10959
       END  as app_id,
       CAST(co.item_price AS DECIMAL(18,2)) AS ITEM_PRICE,
       CAST(co.quantity AS DECIMAL(18,0)) AS QUANTITY,
       CAST(co.LSTG_CURNCY_EXCHNG_RATE AS DECIMAL(18,2)) AS LSTG_CURNCY_EXCHNG_RATE                                                                                                                                               
            from                                                       
            p_soj_cl_v.checkout_metric_item co                                        
            left join  access_views.DW_API_MBL_APP apps  ON co.app_id=apps.app_id                                                                                                                                                                                                                                                                
           Where co.auct_end_dt >= '2014-12-12'                                                                                                                           
            AND co.created_dt >= '2014-12-12'
            and co.created_dt < '2014-12-13'                                                         
            AND co.ck_wacko_yn = 'N'        
--            AND  co.trans_site_id  in (0,77,3,15,2)                                                                                                                                                                           
            AND co.AUCT_TYPE_CODE in (1,7,9)    
            and sess_cobrand in (0,6,7)
) a
group by 1,2,3,4;
/* *********************************************************************
# Title       : Product Health Monitor impression
# Filename    : phm_imp_dly_tbl_new.ins.sql
# Description : Load impression data for PHM
# 
# Parameters  : 
# Explanation : 
# Location    : APOLLO /home/linhshen/sql/phm/
# Called by   : UC4 ()
#
# Date        Ver#   Modified By(Name)     Change and Reason for Change
# --------   -----  ---------------------- -----------------------------
# 12/03/2014  1.0    Harper, Gu            Initial Version
#********************************************************************* */


set mapred.job.queue.name=hdmi-mm;
set hive.enforce.bucketing = true;
set hive.enforce.sorting = true;
set hive.exec.dynamic.partition=true;
set hive.exec.dynamic.partition.mode=nonstrict;
set yarn.app.mapreduce.am.resource.mb=5120;
set yarn.app.mapreduce.am.command-opts=-Xmx2048m;

insert overwrite table  phm_imp_dly_tbl_new partition(dt)
SELECT action_site,cobrand, app_id, SUM(count), cal_dt
FROM(
SELECT
concat(substr(`date`,1,4),substr(`date`,6,2),substr(`date`,9,2)) as cal_dt,
action_site,
cobrand,
app_id,
cast(split(srchimp, ':')[3] as double) AS count
FROM bis_impression_data LATERAL VIEW explode(`srch_imp`) srchimpTable AS srchimp
WHERE dt >=  20141211
and dt < 20141212
and `date` >= concat(substr('20141211',1,4),'/',substr('20141211',5,2),'/',substr('20141211',7,2))
and `date` < concat(substr('20141212',1,4),'/',substr('20141212',5,2),'/',substr('20141212',7,2))
--and action_site in (0,2,3,77,15)
) a
GROUP BY action_site,cobrand,app_id, cal_dt;
