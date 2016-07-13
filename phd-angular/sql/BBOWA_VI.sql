--BBOWA/VI: bbowa_cnt(app_buyer_l2_v. prd_health_mon_session -> app_buyer_t.prd_health_mon_bbowa)/VI_cnt(app_buyer_l2_v. prd_health_mon_session -> app_buyer_t.prd_health_mon_session)
 
/* *********************************************************************
# Title       : Product Health Monitor BBOWA Load
# Filename    : app_buyer.prd_health_mon_bbowa.ins.sql
# Description : Load bbowa data for PHM
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

delete from app_buyer_t.prd_health_mon_bbowa
where bbowa_dt >= date '2014-12-12'
and bbowa_dt < date  '2014-12-13';

insert into app_buyer_t.prd_health_mon_bbowa
(
bbowa_dt              
,site                          
,bbowa_event                   
,cobrand
,app_id                      
,bbowa_cnt                     
)
SELECT					
		CAST(offer_date AS DATE) bbowa_dt,			
		--li.auct_type_code,			
		COALESCE(creator_site_id, response_site_id) site_id,			
		'OFFER' AS bbowa_event,			
		COALESCE(creator_cobrand, response_cobrand) Platform,
		COALESCE(sojlib.soj_nvl(creator_event_details,'app'),sojlib.soj_nvl(response_event_details,'app')) app_id,			
		COUNT(DISTINCT o.item_id||o.item_best_offer_id) bbowa_cnt			
FROM 					
		p_soj_cl_v.offer_metric_item o			
		INNER JOIN access_views.dw_lstg_item li ON (li.item_id = o.item_id AND li.auct_end_dt = o.auct_end_dt)			
WHERE					
		CAST(offer_date AS DATE)  >= date  '2014-12-12'
       and  CAST(offer_date AS DATE) < date '2014-12-13' 
		AND o.auct_end_dt>= date '2014-12-12'			
 		AND li.auct_end_dt >= date '2014-12-12'      
 --		AND (o.creator_site_id in (0,2,3,15,77) or o.response_site_id in (0,2,3,15,77))
 		AND (o.creator_cobrand in (0,6,7) or response_cobrand in (0,6,7))
GROUP BY 					
		1,2,3,4,5
;			

insert into app_buyer_t.prd_health_mon_bbowa
(
bbowa_dt              
,site                          
,bbowa_event                   
,cobrand
,app_id
,bbowa_cnt                     
)					
SELECT					
		CAST(src_cre_dt AS DATE) bbowa_dt,			
		--a.AUCT_TYPE_CODE,			
		site_id,			
		'ASQ' AS bbowa_event,			
		cobrand,
		sojlib.soj_nvl(event_details, 'app') app_id,
		COUNT(DISTINCT a.email_tracking_id) AS bbowa_cnt			
FROM 					
		p_soj_cl_v.asq_metric a			
		INNER JOIN access_views.dw_lstg_item li ON (li.item_id = a.item_id AND li.auct_end_dt = a.auct_end_dt)			
--		LEFT JOIN p_soj_cl_v.user_agents ua ON a.agent_id=ua.agent_id			
--		LEFT JOIN DW_SG_SE_EMAIL_TYPE_LKP lkp ON lkp.email_type_id = a.email_type_id			
WHERE					
		src_cre_dt >= date '2014-12-12' 
		AND src_cre_dt < date '2014-12-13'			
		AND cobrand IN (0,6,7)			
--		AND site_id IN (0,2,3,15,77) 
		AND a.auct_end_dt >= date '2014-12-12'			
		AND li.auct_end_dt >= date '2014-12-12'			
GROUP BY 					
		1,2,3,4,5
;			

insert into app_buyer_t.prd_health_mon_bbowa
(
bbowa_dt              
,site                          
,bbowa_event                   
,cobrand
,app_id                      
,bbowa_cnt                     
)							
SELECT					
		bid_dt bbowa_dt,			
		--b.auct_type_code,			
		bidding_site_id site_id,			
		CASE	WHEN bid_type_code IN 1 THEN 'BID'		
					ELSE 'BIN'
		END bbowa_event,			
		soj_cobrand,	
       CASE WHEN apps.app_id IS NULL  then null 
                            WHEN TRIM(apps.prdct_name) IN ('IPhoneApp' ) THEN 1462
                            WHEN TRIM(apps.prdct_name) IN ('Android','Android Motors') THEN 2571
                            WHEN TRIM(apps.prdct_name) IN ('IPad') THEN 2878
                            WHEN TRIM(apps.prdct_name) IN ('MobWeb','MobWebGXO') THEN 3564
                            ELSE  10959
                   END  as app_id,
		COUNT(DISTINCT item_id||bid_transaction_id) bbowa_cnt			
FROM 					
		p_soj_cl_v.bid_metric_item b			
		LEFT JOIN access_views.dw_api_mbl_app apps ON b.app_id=apps.app_id			
					
WHERE					
		b.bid_dt >= date  '2014-12-12' 
		AND b.bid_dt < date '2014-12-13'			
		AND b.AUCT_END_DT >= date '2014-12-12'
    AND b.bid_type_code IN (1,9)                     				
--    AND b.bidding_site_id in (0,2,3,15,77) 
    AND soj_cobrand in (0,6,7)
GROUP BY 					
		1,2,3,4,5
;			

insert into app_buyer_t.prd_health_mon_bbowa
(
bbowa_dt              
,site                          
,bbowa_event                   
,cobrand
,app_id
,bbowa_cnt                     
)									
SELECT					
		add_to_cart_dt bbowa_dt,			
		--auct_type_code,			
		item_site_id ,			
		'CART' AS bbowa_event,			
		cobrand,			
		CASE WHEN apps.app_id IS NULL then null 
                            WHEN TRIM(apps.prdct_name) IN ('IPhoneApp' ) THEN 1462
                            WHEN TRIM(apps.prdct_name) IN ('Android','Android Motors') THEN 2571
                            WHEN TRIM(apps.prdct_name) IN ('IPad') THEN 2878
                            WHEN TRIM(apps.prdct_name) IN ('MobWeb','MobWebGXO') THEN 3564
                            ELSE  10959
                   END  as app_id,
		COUNT(DISTINCT item_id||buyer_id||COALESCE(variation_id,99999)) bbowa_cnt			
FROM 					
		p_csi_tbs_t.shop_cart_metric c			
		LEFT JOIN access_views.dw_api_mbl_app apps ON c.app_id=apps.app_id			
WHERE					
		add_to_cart_dt >= date '2014-12-12' 
		AND add_to_cart_dt  < date '2014-12-13'			
--		AND item_site_id in (0,2,3,15,77) 
		AND cobrand in (0,6,7)
GROUP BY 					
		1,2,3,4,5
;			

insert into app_buyer_t.prd_health_mon_bbowa
(
bbowa_dt              
,site                          
,bbowa_event                   
,cobrand
,app_id                      
,bbowa_cnt                     
)											
SELECT					
		src_cre_dt  bbowa_dt,			
		--w.AUCT_TYPE_CODE,			
		watch_site_id,			
		'WATCH' AS bbowa_event,			
		cobrand Platform,			
		sojlib.soj_nvl(event_details,'app') app_id,
		COUNT(DISTINCT w.item_id||user_id||COALESCE(variation_id,99999)) bbowa_cnt			
FROM					
		p_soj_cl_v.watch_metric_item w			
WHERE					
		w.src_cre_dt  >= date  '2014-12-12' 
		AND w.src_cre_dt  < date '2014-12-13'		
		AND w.	auct_end_dt>= date '2014-12-12'		
		AND Cobrand IN (0,6,7)			
--	  AND watch_site_id in (0,2,3,15,77) 
GROUP BY 					
		1,2,3,4,5
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
