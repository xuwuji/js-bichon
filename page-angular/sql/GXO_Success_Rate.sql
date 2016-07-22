--GXO Success Rate: succ_cnt/RYP (app_buyer_t.prd_health_mon_GXO_succ_rate) address_view AS RYP
 
/* *********************************************************************
# Title       : Product Health Monitor Pages Load
# Filename    : app_buyer.prd_health_mon_GXO_succ_rate.ins.sql
# Description : Load page data for PHM
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

--------------------------------------------------------------------------------------------Entering PC vs FSOT data 
create multiset volatile table  Conv_GXO_SBC as (
SELECT 
a.src_cre_dt
,a.ck_app_sesn_id
,a.cart_srvc_id
,site_id -- add site_id 
,CASE WHEN ( ( (
CASE WHEN a.CK_APP_PRGRS_BMAP = -999 THEN 0 
WHEN a.CK_APP_PRGRS_BMAP < 0 THEN a.CK_APP_PRGRS_BMAP + 2147483648 
ELSE a.CK_APP_PRGRS_BMAP 
END ) (INT) ) /64) MOD 2 =1 THEN 1 
ELSE 0 
END AS SUCC,
CASE WHEN ( ( (
CASE WHEN ck_app_prgrs_bmap= -999 THEN 0 
WHEN ck_app_prgrs_bmap< 0 
THEN ck_app_prgrs_bmap+ 2147483648 
ELSE ck_app_prgrs_bmap 
END ) (INT) ) /256) MOD 2 =1 THEN 1 
ELSE 0 
END AS redirect,
CASE WHEN ( ( (
CASE WHEN ck_app_prgrs_bmap = -999 THEN 0 
WHEN ck_app_prgrs_bmap < 0 THEN ck_app_prgrs_bmap + 2147483648 
ELSE ck_app_prgrs_bmap 
END ) (INT) ) /8192) MOD 2 =1 THEN 1 
ELSE 0 
END AS Address_view
FROM access_views.DW_CK_GUSET_APP_SESN a
WHERE 1=1
--and site_id IN(0,2,3,77,15) 
AND redirect = 0
AND a.src_cre_dt >= date '2014-12-12'
and a.src_cre_dt < date '2014-12-13'
GROUP BY 1,2,3,4,5,6,7
) with data 
primary index (src_cre_dt, ck_app_sesn_id, site_id )
ON	COMMIT PRESERVE ROWS
;

create multiset volatile table  GXO_SOJ_PAGE_V1 as (
select e.session_start_dt,
s.session_skey,
e.guid,
page_id,
cobrand,
e.site_id,
sojlib.soj_nvl (e.soj, 'si') sesn_id,
/*  remove unnecessary flags
sojlib.soj_nvl (e.soj, 'uc') buyer_cntry,
sojlib.soj_nvl (e.soj, 'cart_id') cart_srvc_id,
sojlib.soj_nvl (e.soj, 'ckfl') ck_flow,
sojlib.soj_nvl (e.soj, 'err') error_cd, */
min(seqnum) first_pg
from ubi_v.ubi_event  e
INNER JOIN P_SOJ_CL_V.clav_session   s ON (e.guid = s.guid AND e.session_skey = s.session_skey AND e.session_start_dt  = s.session_start_dt
AND e.site_id = s.site_id  -- add join condition 
)
where 1=1           
and e.session_start_dt >= date '2014-12-12'
and e.session_start_dt < date '2014-12-13'
and s.session_start_dt >= date '2014-12-12'
and e.session_start_dt < date '2014-12-13'
and e.rdt = 0 
and e.page_id  in (6024)
AND s.exclude=0 -- add to exclude single page session
--AND e.site_id IN   (0,2,3,77,15) -- change filter
--AND  s.site_id IN  (0,2,3,77,15) -- add filter 
group by 1,2,3,4,5,6,7
) with data 
primary index (session_start_dt, sesn_id, site_id )
ON	COMMIT PRESERVE ROWS
;

delete from app_buyer_t.prd_health_mon_GXO_succ_rate
where  session_start_Dt >= date '2014-12-12' 
and session_start_Dt  < date '2014-12-13';


insert into app_buyer_t.prd_health_mon_GXO_succ_rate
(
session_start_dt              
,site_id                       
,cobrand                       
,succ_cnt                      
,address_view                  
)
select src_cre_dt,
a.site_id,
Cobrand,
sum(SUCC) as succ,
sum(Address_view) as Address_view 
from   Conv_GXO_SBC b 
LEFT join GXO_SOJ_PAGE_V1 a on  
cast ( a.sesn_id as decimal (18,0)) = b.ck_app_sesn_id
and a.session_start_dt = b.src_cre_dt
and a.site_id = b.site_id
and Cobrand in (0,7)
group by 1,2,3;

/*
insert into app_buyer_t.prd_health_mon_GXO_succ_rate
(
session_start_dt              
,site_id                       
,cobrand
,app_id
,succ_cnt                      
,address_view               
)
SELECT 
cart.SRC_CRE_DT AS SRC_CRE_DT 
,CRE_SITE_ID as site_id
--,Case when apps.prdct_name  = 'MobWeb' then 'MobWeb non-GXO' else apps.prdct_name end as platform,
,6  as cobrand -- only MobWeb for now, will be explicitly marked on frontend report      
,CASE WHEN TRIM(apps.prdct_name) IN ('IPhoneApp' ) THEN 1462
                            WHEN TRIM(apps.prdct_name) IN ('Android','Android Motors') THEN 2571
                            WHEN TRIM(apps.prdct_name) IN ('IPad') THEN 2878
                            WHEN TRIM(apps.prdct_name) IN ('MobWeb','MobWebGXO') THEN 3564
                            ELSE  10959
    END  as app_id
,SUM(CASE WHEN ( ( (CASE WHEN cart.FLAGS01 = -999 THEN 0 WHEN cart.FLAGS01 < 0 THEN cart.FLAGS01 + 2147483648 ELSE cart.FLAGS01 END) (INT) ) /64) MOD 2 =1 THEN 1 ELSE 0 END) AS CartCompleted
,COUNT(*) AS RYP           
FROM  access_views.CART_SRVC  cart 
inner JOIN access_views.dw_API_MBL_APP apps ON cart.app_id = apps.app_id
--inner JOIN dw_sites sites ON cart.CRE_SITE_ID   =  sites.site_id
WHERE 1=1
AND cart.SRC_CRE_DT  >= date '2014-12-12' 
AND cart.SRC_CRE_DT  < date '2014-12-13' 
and cart.app_id IN (110859, 50497) -- mWeb GXO only app id
AND CRE_SITE_ID IN  (0,2,3,77,15)
GROUP BY 1,2,3,4;
*/

insert into app_buyer_t.prd_health_mon_GXO_succ_rate
(
session_start_dt              
,site_id                       
,cobrand
,app_id
,succ_cnt                      
,address_view               
)
SELECT 
mbl_gxo.SRC_CRE_DT 
,mbl_gxo.site_id
,mbl_gxo.cobrand  
,mbl_gxo.app_id
,SUM(mbl_gxo.CartCompleted) AS CartCompleted
,COUNT(*) AS RYP           
FROM 
(SELECT 
cart.SRC_CRE_DT AS SRC_CRE_DT 
,CRE_SITE_ID AS site_id
,6  as cobrand -- only MobWeb for now, will be explicitly marked on frontend report      
,CASE WHEN TRIM(apps.prdct_name) IN ('IPhoneApp' ) THEN 1462
                            WHEN TRIM(apps.prdct_name) IN ('Android','Android Motors') THEN 2571
                            WHEN TRIM(apps.prdct_name) IN ('IPad') THEN 2878
                            WHEN TRIM(apps.prdct_name) IN ('MobWeb','MobWebGXO') THEN 3564
                            ELSE  10959
    END  as app_id       
,CASE WHEN ( ( (CASE WHEN cart.FLAGS01= -999 THEN 0 WHEN cart.FLAGS01< 0 THEN cart.FLAGS01+ 2147483648 ELSE cart.FLAGS01 END) (INT) ) /1) MOD 2=1 THEN 1 ELSE 0 END AS CPM  
,CASE WHEN ( ( (CASE WHEN cart.FLAGS01= -999 THEN 0 WHEN cart.FLAGS01< 0 THEN cart.FLAGS01+ 2147483648 ELSE cart.FLAGS01 END) (INT) ) /2) MOD 2 =1 THEN 1 ELSE 0 END AS CYP   
,CASE WHEN ( ( (CASE WHEN cart.FLAGS01 = -999 THEN 0 WHEN cart.FLAGS01 < 0 THEN cart.FLAGS01 + 2147483648 ELSE cart.FLAGS01 END) (INT) ) /16) MOD 2 =1 THEN 1 ELSE 0 END AS CartReadOnly_FCRT
,CASE WHEN ( ( (CASE WHEN cart.FLAGS01 = -999 THEN 0 WHEN cart.FLAGS01 < 0 THEN cart.FLAGS01 + 2147483648 ELSE cart.FLAGS01 END) (INT) ) /64) MOD 2 =1 THEN 1 ELSE 0 END AS CartCompleted
,CASE WHEN ( ( (CASE WHEN cart.FLAGS01= -999 THEN '-999' WHEN cart.FLAGS01< 0 THEN cart.FLAGS01+ 2147483648 ELSE cart.FLAGS01 END) (INT) ) /536870912) MOD 2 =1 THEN 'GXO' ELSE 'Regular'END AS GXO_YN 
FROM  access_views.CART_SRVC  cart 
inner JOIN access_views.dw_API_MBL_APP apps ON cart.app_id = apps.app_id
WHERE 1=1
AND cart.SRC_CRE_DT  >= DATE '2014-12-12' 
AND cart.SRC_CRE_DT  < DATE '2014-12-13' 
AND cart.app_id IN (110859, 50497) --mweb app and mweb GXO app 
--AND CRE_SITE_ID IN  (0,2,3,77,15)
) mbl_gxo
WHERE mbl_gxo.GXO_YN = 'GXO' 
GROUP BY 1,2,3,4;

