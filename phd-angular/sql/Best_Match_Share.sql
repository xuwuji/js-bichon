--Best Match Share: BM_SRP_PV_1pct/SRP_PV_1pct_ST (app_buyer_l2_v.prd_health_mon_gmv_impr_srp -> app_buyer_t.prd_health_mon_srp)
 
/* *********************************************************************
# Title       : Product Health Monitor SRP Pages Load
# Filename    : 
# Description : Load SRP pages data for PHM
# 
# Parameters  : 
# Explanation : 
# Location    : $DW_SQL/
# Called by   : UC4 ()
#
# Date        Ver#   Modified By(Name)     Change and Reason for Change
# --------   -----  ---------------------- -----------------------------
# 03/23/2014  0.1    Alfred             Initial Version
# 04/24/2014  1.0    Alfred             Productionize
# 05/04/2014  2.0    Alfred             Change to Mobile split
# 12/02/2014  3.0    Harper, Gu         Add Full Site Data
#********************************************************************* */

.MAXERROR 1;

create multiset volatile table cobrand_pv
as(
SELECT e.session_start_dt, 
             e.seqnum,
             clav_sess.guid,
             CASE WHEN clav_sess.signedin_user_id > 0 THEN clav_sess.signedin_user_id WHEN clav_sess.mapped_user_id > 0  THEN clav_sess.mapped_user_id ELSE -999 END AS user_id ,
             e.site_id,
             e.page_id,
             e.page_name,
             e.session_skey,
             clav_sess.cobrand,
            sojlib.soj_extract_flag(e.flags,267) as CM_YN1,
            sojlib.soj_nvl(e.soj, 'gf') as GF,
            clav_sess.primary_app_id as app_id,
             --CASE WHEN sojlib.is_integer(sojlib.soj_nvl(e.soj, 'app')) = 1 THEN CAST(sojlib.soj_nvl(e.soj, 'app') AS INTEGER) ELSE NULL END AS app_id,
	         CASE WHEN sojlib.is_integer(sojlib.soj_nvl(e.soj, 'sort')) = 1 THEN CAST(sojlib.soj_nvl(e.soj, 'sort') AS INTEGER) ELSE NULL END AS sort_tag,
             CASE WHEN sojlib.soj_extract_flag(e.flags,113) = 1 THEN 40
                       WHEN sojlib.soj_extract_flag(e.flags,128) = 1 THEN 41
                       WHEN sojlib.soj_extract_flag(e.flags,183) = 1 OR sojlib.soj_extract_flag(e.flags,071) = 1 OR sojlib.soj_extract_flag(e.flags,072) = 1 OR sojlib.soj_extract_flag(e.flags,074) =1  OR sojlib.soj_extract_flag(e.flags,073) = 1 OR sojlib.soj_extract_flag(e.flags,219)=1 THEN 42
                       WHEN sojlib.soj_extract_flag(e.flags,094) = 1 OR sojlib.soj_extract_flag(e.flags,075) = 1 OR sojlib.soj_extract_flag(e.flags,117) = 1 OR sojlib.soj_extract_flag(e.flags,118) = 1 OR sojlib.soj_extract_flag(e.flags,136) = 1  THEN 43
                       WHEN sojlib.soj_extract_flag(e.flags,070) = 1 OR sojlib.soj_extract_flag(e.flags,122) = 1 OR sojlib.soj_extract_flag(e.flags,236) = 1 OR sojlib.soj_extract_flag(e.flags,237) = 1 THEN 44 ELSE 45
                       END AS sort_flag,
                       coalesce(sort_tag,sort_flag) as sort_used,
            e.sqr
FROM ubi_v.ubi_event_1pct e
INNER JOIN                            
P_SOJ_CL_V.clav_session_1pct clav_sess
ON (e.session_skey  = clav_sess.session_skey AND e.guid=clav_sess.guid AND e.session_start_dt = clav_sess.session_start_dt AND e.site_id=clav_sess.site_id)
WHERE e.session_start_dt >= date '2014-12-12'
and e.session_start_dt < date  '2014-12-13'
--AND e.site_id IN (0,100,3,77,2,15)
AND e.rdt = 0
AND clav_sess.session_start_dt >= date '2014-12-12'
and clav_sess.session_start_dt < date '2014-12-13'
AND clav_sess.exclude=0
AND clav_sess.cobrand in (0,7,6)
AND PAGE_ID IN (2047936,1468757,2051457,1677950, 2046791,2053742, 2054032, 5387,2045573,3286)
AND (sojlib.soj_extract_flag(e.flags, 267) <> 1 OR sojlib.soj_nvl(e.soj, 'gf') NOT LIKE '%LH_Complete%')
AND sojlib.soj_nvl(SOJ,'sHit')>0
--AND clav_sess.site_id IN (0,100,3,77,2,15)
)with data 
primary index(guid)
on commit preserve rows;

delete from app_buyer_t.prd_health_mon_srp
where cal_dt >= date '2014-12-12'
and cal_dt < date '2014-12-13';

insert into app_buyer_t.prd_health_mon_srp 
(
cal_dt                        
,site_id                       
,cobrand                       
,page_id                       
,app_id                        
,sort_used                     
,Page_View                     
)
SELECT pv2.session_start_dt as dt,         
                 pv2.site_id, 
                 pv2.cobrand,             
                pv2.PAGE_ID,
                pv2.app_id,
                case when pv2.sort_used in (1,40,14) then 'TES'   
                             when   pv2.sort_used in (2,41,13) then 'TNL' 
                             when  pv2.sort_used in (3,4,6,7,11,16,15,42) then 'TOTCST' 
                             when  pv2.sort_used in (43,4,8) then 'Other' 
                             when  pv2.sort_used in (5,44,12) then 'BM' 
                             else 'Error' end as sort_used,
                COUNT( pv2.seqnum)*100 AS Page_View                
FROM cobrand_pv pv2 
GROUP BY 1,2,3,4,5,6;
