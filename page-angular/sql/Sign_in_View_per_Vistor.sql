--Sign in View per Vistor: signin_pv(app_buyer_t.prd_health_mon_signin_pages page_cnt)/GUID_cnt(app_buyer_l2_v. prd_health_mon_session -> app_buyer_t.prd_health_mon_session)
 
/* *********************************************************************
# Title       : Product Health Monitor Signin Pages Load
# Filename    : app_buyer.prd_health_mon_signin_pages.ins.sql
# Description : Load Signin Pages Data for PHM
# 				Sign In Page: 4853(PC/FSoM), (2050533, 2050445, 2054029) (mobie app experience) 4853 Sign in Success Page for (PC/FSOM) 2051246  Sign in Success Page for Android APP (only android) available right now  
#  				Signin-success rate - It's because that's the way data is structured and tracked. If #flow throws an error, the success page still loads, and over-counts. So, we have to remove errors explicitly.
# Parameters  : 
# Explanation : 
# Location    : $DW_SQL/
# Called by   : UC4 ()
#
# Date        Ver#   Modified By(Name)     Change and Reason for Change
# --------   -----  ---------------------- -----------------------------
# 03/23/2014  0.1    Alfred             Initial Version
# 04/24/2014  1.0    Alfred             Productionize
# 07/17/2014  1.1    Harper, Gu         roverimp and sid logic change 
# 12/02/2014  2.0    Harper, Gu         Add Full Site Data
# 12/05/2014  2.1    Harper, Gu         Wipe Reg and Add SGN_TAB_CLICK filter
#********************************************************************* */

.MAXERROR 1;

---PC/FSoM Sign in Page view, page_id in (4853) and  cobrand in (0,7)
Create      multiset volatile table Sign_In_Page_Views as
(
SELECT     ee.session_start_dt,  
                   ee.session_skey,
                   ee.guid,
                   ee.site_id,
                   cobrand,
                   ee.page_id,
                   ee.current_impr_id,
                   ee.source_impr_id,
				   SOJLIB.SOJ_NVL(ee.SOJ,'sgnTabClick') AS SGN_TAB_CLICK, -- added to distinguish between sign in page and registration page
                   primary_app_id                                                 
FROM      ubi_v.ubi_event_1pct ee       
INNER JOIN P_SOJ_CL_V.CLAV_SESSION_1pct  bb          
         ON   (ee.guid = bb.guid             
       AND ee.session_skey = bb.session_skey     
       AND ee.session_start_dt = bb.session_start_dt
       AND ee.site_id = bb.site_id)           
WHERE    ee.rdt = 0  
--         and  ee.site_id IN (0, 3, 2,15, 77)   
         AND bb.bot_session = 0 
         and  bb.VALID_PAGE_COUNT >1 
         and  bb.exclude = 0 
         and  bb.cobrand in (0,7)      
            AND ee.page_id IN ( 4853)   
            AND ee.page_name<>'roverimp'       
            AND ee.session_start_dt >= date '2014-12-12' 
            AND ee.session_start_dt < date '2014-12-13'
            AND bb.session_start_dt >= date '2014-12-12' 
            AND bb.session_start_dt < date '2014-12-13' 
--            AND ee.site_id IN (0, 3, 2,15, 77)   
--            AND bb.site_id IN (0, 3, 2,15, 77)   
GROUP   BY 1,2,3,4,5,6,7,8,9,10
)
with data 
primary index (session_start_dt, session_skey, guid, site_id)
         on     commit preserve rows
;


-- Sign in Page: Mobile Optimized experience, 
--both sign-in and sign-in succ page for mobile apps. Since there is no tracking for mobile. 
Create      multiset volatile table Sign_In_Page_Views_app as
(
SELECT     ee.session_start_dt,  
                   ee.session_skey,
                   ee.guid,
                   ee.site_id,
                   cobrand,
                   ee.page_id,
                   ee.current_impr_id,
                   ee.source_impr_id,
                   primary_app_id                                                 
FROM      ubi_v.ubi_event_1pct ee       
INNER JOIN P_SOJ_CL_V.CLAV_SESSION_1pct  bb          
         ON   (ee.guid = bb.guid             
       AND ee.session_skey = bb.session_skey     
       AND ee.session_start_dt = bb.session_start_dt
       AND ee.site_id = bb.site_id)           
WHERE    ee.rdt = 0  
--         and  ee.site_id IN (0, 3, 2,15, 77)   
         AND bb.bot_session = 0 
         and  bb.VALID_PAGE_COUNT >1 
         and  bb.exclude = 0 
         and  bb.cobrand in (6)         
            AND ee.page_id IN ( 2050533, 2050445, 2054029,2051246)       
            AND ee.session_start_dt >= date '2014-12-12' 
            AND ee.session_start_dt < date '2014-12-13'
            AND bb.session_start_dt >= date '2014-12-12' 
            AND bb.session_start_dt < date '2014-12-13' 
--            AND ee.site_id IN (0, 3, 2,15, 77)   
--            AND bb.site_id IN (0, 3, 2,15, 77)   
GROUP   BY 1,2,3,4,5,6,7,8,9
)
with data 
primary index (session_start_dt, session_skey, guid, site_id)
         on     commit preserve rows
;
/*
---PC/FSoM  Dest page - Sign in Page view, page_id in (4853) and  cobrand in (0,7) 
-- This has excluded the case 'If flow throws an error, the success page still loads, and over-counts.' by using the filter rdt=0
Create      multiset volatile table Dest_Page_Views as
(
SELECT   --aa.*,
                            --ee.page_id AS dest_page_id,
                            --ee.rdt
                            ee.session_start_dt,  
             ee.session_skey,
             ee.guid,
             ee.site_id,
             cobrand,
             ee.current_impr_id,
             ee.source_impr_id,
             primary_app_id,                          
                            ee.page_id AS dest_page_id,
                            sojlib.soj_nvl (ee.soj, 'sid') AS SID,
                            ee.rdt
FROM      ubi_v.ubi_event_1pct ee                                                                                       
INNER JOIN P_SOJ_CL_V.CLAV_SESSION_1pct  aa                                                                                          
         ON   (ee.guid = aa.guid                                                                                             
       AND ee.session_skey = aa.session_skey                                                                                     
       AND ee.session_start_dt = aa.session_start_dt
       AND ee.site_id  = aa.site_id)                                                                                           
WHERE    1=1
--                            AND ee.site_id IN (0, 3, 2,15, 77)                                                                                   
            AND ee.page_id IN (4852)  
            AND ee.page_name  <> 'roverimp'
            AND sojlib.soj_nvl (ee.soj, 'sid') LIKE ('%p4853%')
            AND aa.bot_session = 0 
            AND aa.VALID_PAGE_COUNT >1 
            AND aa.exclude = 0 
            AND aa.cobrand IN (0,7)
            AND ee.session_start_dt >= '2014-12-12' 
            AND ee.session_start_dt < '2014-12-13' 
            --AND ee.source_impr_id = aa.current_impr_id         
          --  AND aa.page_id in  ( 4853, 2050533, 2050445, 2054029)
GROUP   BY 1,2,3,4,5,6,7,8,9,10,11
)
with data 
primary index (session_start_dt, session_skey, guid, site_id)
         on     commit preserve rows
;*/
/*
CREATE MULTISET VOLATILE TABLE Final_Sign_In_Attempts AS
(
SELECT ee.*
FROM (
(SEL a.* FROM Dest_Page_Views a) ee
inner JOIN 
(SEL session_start_dt, site_id, session_skey, cobrand, guid FROM Sign_In_Page_Views GROUP BY 1,2,3,4,5) bb
ON (ee.guid = bb.guid 
AND ee.session_skey = bb.session_skey 
AND ee.session_start_dt = bb.session_start_dt 
AND ee.site_id = bb.site_id 
AND ee.cobrand = bb.cobrand))
)
WITH DATA PRIMARY INDEX (guid, session_start_dt, session_skey)
ON COMMIT PRESERVE ROWS;*/
-------------------------


delete from app_buyer_t.prd_health_mon_signin_pages
where session_start_dt >= date '2014-12-12' 
	AND	session_start_dt < date '2014-12-13';
-- PC/FSoM  Sign in Page
insert into app_buyer_t.prd_health_mon_signin_pages
(
session_start_dt              
,site_id                       
,cobrand
,primary_app_id
,page_cnt                   
)
select
session_start_dt,
site_id,
cobrand,
primary_app_id,
count(page_id)
from Sign_In_Page_Views
--where page_id in  ( 4853, 2050533, 2050445, 2054029)
where (SGN_TAB_CLICK = 'SignIn' OR SGN_TAB_CLICK IS NULL) --  accounts for users that view Sign In tab and eliminate the users that view the Registration tab
group        by 1,2,3,4;
--APP Sign in Page
insert       into app_buyer_t.prd_health_mon_signin_pages
(
session_start_dt              
,site_id                       
,cobrand
,primary_app_id
,page_cnt                   
)
select
         
session_start_dt,
site_id,
cobrand,
primary_app_id,
count(page_id)

from Sign_In_Page_Views_app
WHERE page_id IN  ( 2050533, 2050445, 2054029)
group        by 1,2,3,4;

/*NOT USED ANY MORE
delete	from app_buyer_t.prd_health_mon_si_suss_pages
where	session_start_dt >= date '2014-12-12' 
	AND	session_start_dt < date '2014-12-13';
--PC/FSoM Sign in Success Page	
INSERT   INTO  app_buyer_t.prd_health_mon_si_suss_pages
(
session_start_dt              
,site_id                       
,cobrand
,primary_app_id
,page_cnt                   
)
select
session_start_dt,
site_id,
cobrand,
primary_app_id,
COUNT(dest_page_id)
FROM Final_Sign_In_Attempts 
--WHERE  rdt = 0
GROUP BY 1,2,3,4
;
--Sign In Success for Andriod only, view only get android sign in page in the denominator
--DEL FROM  dev_scratch.prd_health_mon_signin_pv WHERE cobrand=6
INSERT INTO app_buyer_t.prd_health_mon_si_suss_pages 
( 
session_start_dt 
,site_id 
,cobrand 
,primary_app_id 
,page_cnt 
) 
select 

session_start_dt, 
site_id, 
cobrand, 
primary_app_id, 
COUNT(page_id) 

FROM Sign_In_Page_Views_app 
WHERE page_id IN (2051246) and primary_app_id IN (2571)
group by 1,2,3,4 
;



delete	from app_buyer_t.prd_health_mon_si_err_pages
where	session_start_dt >= date '2014-12-12' 
	AND	session_start_dt < date '2014-12-13';

---Sign in error page, rdt=1
INSERT   INTO  app_buyer_t.prd_health_mon_si_err_pages
(
session_start_dt              
,site_id                       
,cobrand
,primary_app_id
,page_cnt                      
)
SELECT   session_start_dt, 
site_id,
cobrand,
primary_app_id,
count(dest_page_id)
FROM      Final_Sign_In_Attempts
where       rdt = 1
GROUP   BY 1,2,3,4
;
*//* *********************************************************************
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
