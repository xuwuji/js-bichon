--VI per GUID: VI_cnt/GUID_cnt (app_buyer_l2_v. prd_health_mon_session -> app_buyer_t.prd_health_mon_session)
 
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
