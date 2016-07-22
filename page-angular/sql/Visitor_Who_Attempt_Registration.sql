--% Visitor Who Attempt Registration: REI(app_buyer_t.prd_health_mon_Reg_summary)/GUID_cnt(app_buyer_l2_v. prd_health_mon_session -> app_buyer_t.prd_health_mon_session)
 
/* *********************************************************************
# Title       : Product Health Monitor Registor Summary Load  
# Filename    : app_buyer.prd_health_mon_Reg_summary.ins.sql
# Description : Load Registor Summary data for PHM
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

Create multiset volatile table  Registration_StageWise_Visits as
( 
SELECT
	a.src_cre_dt,
    a.site_id,
	a.flow,
	CASE WHEN NumREIPageViews > 0 THEN 1 ELSE 0 END AS NumREIPageViews_YN,
	--CASE WHEN NumREIPageEdits > 0 THEN 1 ELSE 0 END AS NumREIPageEdits_YN,
	--CASE WHEN NumREIPageSubmits > 0 THEN 1 ELSE 0 END AS NumREIPageSubmits_YN,
	--CASE WHEN NumConfirmationPageViews > 0 THEN 1 ELSE 0 END AS NumConfirmationPageViews_YN,
	CASE WHEN flow IN ('PPA', 'PPA Upgrade') AND NumConfirmationPageViews > 0 THEN 1
	WHEN NumCRUPageViews > 0 THEN 1 ELSE 0 END AS NumCRUPageViews_YN,
	COUNT(a.guid) AS Users
FROM
	(
	SELECT
		
		r.guid,
		r.site_id,
		CASE
  			WHEN upgrd_ind = 1 AND user_prfl_sts_cd IN (2,5) THEN 'PPA Upgrade'
            WHEN user_prfl_sts_cd IN (1,3) AND (upgrd_ind <> 1 OR upgrd_ind IS NULL) THEN 'PPA'
            WHEN user_prfl_sts_cd IN (6) AND (upgrd_ind <> 1 OR upgrd_ind IS NULL) THEN 'FSoM PPA'
            WHEN upgrd_ind IS NULL AND user_prfl_sts_cd IN (2) THEN 'FPA Site'
            WHEN upgrd_ind IS NULL AND user_prfl_sts_cd IN (5) THEN 'FSoM FPA'
            WHEN upgrd_ind IS NULL AND user_prfl_sts_cd IN (4) THEN 'GXO'
		ELSE 'NA' END AS flow,
		r.src_cre_dt AS src_cre_dt,
		SUM(CASE WHEN (r.event_id IN (1,21,39)) THEN 1 ELSE 0 END) NumREIPageViews,
		SUM(CASE WHEN r.src_cre_dt >= date '2011-08-30' AND (r.event_id IN (22)) THEN 1
			WHEN r.src_cre_dt < date '2011-08-30' AND r.event_id = 2 THEN 1 ELSE 0 END) NumREIPageSubmits,
		SUM(CASE WHEN r.src_cre_dt >= date '2011-08-30' AND (r.event_id IN (20,31,37)) THEN 1
			WHEN r.src_cre_dt < date '2011-08-30' AND r.event_id = 5 THEN 1 ELSE 0 END) NumConfirmationPageViews,
		SUM(CASE WHEN r.src_cre_dt >= date '2011-08-30' AND (r.event_id IN (32,33,38)) THEN 1 ELSE 0 END) NumCRUPageViews,                                        
		SUM(CASE WHEN (r.event_id IN (3,4,6,7,8,9,10,11,23,24,25,26,27,28,29,34,35,36)) THEN 1 ELSE 0 END) NumREIPageEdits
	FROM
		access_views.dw_reg_byr_log r
	WHERE
		r.src_cre_dt >= date '2014-12-12' 
AND r.src_cre_dt  < date '2014-12-13'
	GROUP BY
		1,2,3,4
	) a
WHERE 1=1
--AND a.site_id in (0,2,3,15,77)

GROUP BY	1,2,3,4,5--,6,7,8
)
with data 
primary index(src_cre_dt, site_id, flow)
on commit preserve rows
;

delete from app_buyer_t.prd_health_mon_Reg_summary
where src_cre_dt >= date '2014-12-12'
and src_cre_dt < date '2014-12-13'; 

insert into  app_buyer_t.prd_health_mon_Reg_summary
(
SITE_ID                       
,src_cre_dt                    
,cobrand                      
,REI                           
,CRU                           
)
SELECT 
site_id,
src_cre_dt, 
case when flow like 'FSoM%' then 7
else 0 end as platform,
SUM (NumREIPageViews_YN * users)  AS REI,
SUM (NumCRUPageViews_YN * users)  AS CRU
FROM  Registration_StageWise_Visits
GROUP BY 1,2,3
;

insert into  app_buyer_t.prd_health_mon_Reg_summary
(
SITE_ID                       
,src_cre_dt                    
,cobrand
,app_id
,REI                           
,CRU                           
)
SELECT						
	site_id,
	session_start_dt,					
	cobrand,
	app_id,							
	SUM(CASE	WHEN reg_start=1 THEN ttl_users ELSE 0 END) as REI,							
	SUM(CASE	WHEN reg_complete=1 THEN ttl_users ELSE 0 END) as CRU
from 	
(SELECT					
		session_start_dt,				
		cobrand,
		app_id,				
		site_id,				
		CASE	WHEN reg_start_pvs >0 THEN 1 ELSE 0 END reg_start,				
		CASE	WHEN reg_complete_pvs >0 THEN 1 ELSE 0 END reg_complete,			
		COUNT(DISTINCT guid) ttl_users			
from						
(						
SELECT 						
		a.guid,				
		a.session_start_dt,				
		a.site_id,				
		cobrand,
		sojlib.soj_nvl(soj, 'app') as app_id,
		SUM(CASE	WHEN page_id IN 2048640 THEN 1 ELSE 0 END) Reg_start_pvs,	
		SUM(CASE	WHEN (page_id IN 2045709 AND sojlib.soj_nvl(soj,'mRegSuc') IS NOT NULL) THEN 1 ELSE 0 END) Reg_complete_pvs		
FROM						
		p_soj_cl_v.clav_session a				
		INNER JOIN ubi_v.ubi_event e				
			ON(a.guid=e.guid AND a.session_skey=e.session_skey AND a.session_start_dt=e.session_start_dt AND a.site_id=e.site_id)			
WHERE						
		a.exclude=0				
		AND a.session_start_dt>= date '2014-12-12'
		and a.session_start_dt< date '2014-12-13'				
		AND e.session_start_dt>= date '2014-12-12'
		and e.session_start_dt< date '2014-12-13'				
		--AND e.page_id IN (2048640, 2049128, 2049130,2045709)
		AND e.page_id IN (2048640,2045709)								
		AND cobrand IN (6)	
--		and a.site_id in (0,2,3,15,77)			
--		and e.site_id in (0,2,3,15,77)
		group by 1,2,3,4,5
		) t
group by 1,2,3,4,5,6) t
group by 1,2,3,4
;					
/* *********************************************************************
# Title       : Product Health Monitor Session Load
# Filename    : app_buyer.prd_health_mon_session.ins.sql
# Description : Load Session Data for PHM
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
# 04/30/2014  2.0    Alfred             Change to Mobile split
# 11/11/2014  2.1    Harper, Gu         Change page id from 2059216 to 2055359
# 12/02/2014  3.0    Harper, Gu         Add Full Site Data
#********************************************************************* */

.MAXERROR 1;

delete from app_buyer_t.prd_health_mon_session
where session_start_Dt >= date '2014-12-12' 
and session_start_Dt  < date '2014-12-13';

insert into app_buyer_t.prd_health_mon_session
(
session_start_dt              
,site                          
,cobrand                       
,app_id                        
,GUID_cnt                      
,RU_cnt                        
,SRP_cnt                       
,VI_cnt                        
,Myebay_cnt                    
,myebay_guids                  
,myebay_registered_visitors    
,search_guids                  
,search_registered_visitors    
,VI_sessions                   
,VI_ending_sessions            
,SRP_sessions                  
,SRP_ending_sessions           
,Myebay_sessions               
,Myebay_ending_sessions        
)
select session_start_dt,
site_id  site,
cobrand,
primary_app_id,
count(distinct guid) GUID_cnt,
count(distinct coalesce(signedin_user_id,mapped_user_id)) RU_cnt,
sum(GR_cnt) SRP_cnt,
sum(VI_cnt) VI_cnt,
sum(myebay_cnt  )  Myebay_cnt,
count(distinct case when myebay_cnt >0 then guid else null end ) myebay_guids,
count(distinct case when myebay_cnt >0 then coalesce(signedin_user_id,mapped_user_id) else null end ) myebay_registered_visitors,
count(distinct case when GR_cnt >0 then guid else null end ) search_guids,
count(distinct case when GR_cnt >0 then coalesce(signedin_user_id,mapped_user_id) else null end ) search_registered_visitors,
count(distinct case when VI_cnt >0 then guid||session_skey else null end ) VI_sessions,
--count(distinct case when b.page_name = 'ViewItem' then guid||session_skey else null end) VI_ending_sessions,
count(distinct case when exit_page_id in (2047935,1673582,1468719,2047935,1468719,2056116,5408,2047675,4340)  then guid||session_skey else null end) VI_ending_sessions, 
count(distinct case when GR_cnt >0 then guid||session_skey else null end ) SRP_sessions,
--count(distinct case when b.page_name = 'Search' then guid||session_skey else null end) SRP_ending_sessions, 
count(distinct case when exit_page_id in (2047936,2051457,1677950, 2046791,2047936,1468757,2047936,1468757,2053742,2054032,5387,2045573,3286) then guid||session_skey else null end) SRP_ending_sessions, 
count(distinct case when myebay_cnt  >0 then guid||session_skey else null end ) Myebay_sessions,
--count(distinct case when b.page_name = 'My eBay' then guid||session_skey else null end) Myebay_ending_sessions
--count(distinct case when exit_page_id in (2047939,1625112,	1677902,1677906,2047939,1468737, 1468738,2047939,1468737, 1468738,2056088,5366, 5197,2057337, 2050601)   then guid||session_skey else null end) Myebay_ending_sessions
COUNT(DISTINCT CASE WHEN exit_page_id IN (2051286,2051303,2051273,1677907,1677908,1677909,2051286,2051303,2051273,1468745, 1468744, 1468743,2051286,2051303,2051273,1468745, 1468744, 1468743,2055413,5369, 3984,2053788,2055119,2059210,2055359,2060778)   THEN guid||session_skey ELSE NULL END) Myebay_ending_sessions
from p_soj_cl_v.clav_Session a
---- inner join p_csi_tbs_T.clav_soj_lkp_page b
---- on exit_page_id   = b.page_id               
where session_start_Dt >= date '2014-12-12' 
and session_start_Dt  < date '2014-12-13'
and cobrand in (0,6,7)
and exclude = 0
--and site_id in (0,3,77,15,2)
group by 1,2,3,4;
