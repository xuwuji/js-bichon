--SRP Null Rate: null_SRP_1pct/SRP_cnt_1pct (app_buyer_t.prd_health_mon_page)
 
/* *********************************************************************
# Title       : Product Health Monitor Page Load
# Filename    : app_buyer.prd_health_mon_page.ins.sql
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
# 04/24/2014  1.0    Alfred             Productionize
# 04/30/2014  2.0    Alfred             Change to Mobile split
# 12/02/2014  3.0    Harper, Gu         Add Full Site Data
#********************************************************************* */

.MAXERROR 1;

delete from app_buyer_t.prd_health_mon_page
where session_start_dt >= date '2014-12-12' 
and session_start_dt < date '2014-12-13';

insert into app_buyer_t.prd_health_mon_page
(
session_start_dt              
,site                          
,cobrand
,app_id                      
,SRP_cnt                       
,SRP_cnt_exc_mweb              
,VI_SRP_cnt                    
,null_SRP_1pct                 
,click_top3                    
)
select a.session_start_dt,
a.site_id site,
 cobrand ,
 primary_app_id,
sum(case when page_id in  (2047936,2051457,1677950, 2046791,2047936,1468757,2047936,1468757,2053742,2054032,5387,2045573,3286) then 1 else 0 end) SRP_cnt,
sum(case when page_id in  (2047936,2051457,1677950, 2046791,2047936,1468757,2047936,1468757, 2045573,3286) then 1 else 0 end) SRP_cnt_exc_mweb, -----------SRP excluding mweb since srrank is not available
sum(case when (page_id in (2047935,1673582,1468719,2047935,1468719,2047675,4340) and sojlib.soj_nvl(soj,'srrank') is not null AND (case when sojlib.is_decimal(sojlib.soj_nvl(soj,'srrank'),18,0)  = 1 then  sojlib.soj_nvl(soj,'srrank') end) <> 0 )  ----------site and app VI from SRP
or 
------------Mweb case
(page_id in (2056116,5408,2047675,4340) and sojlib.soj_nvl(soj,'sid') like any  ('%2053742%','%2054032%','%5387%','%2045573%','%3286%')) then  1 else 0 end ) VI_SRP_cnt, 
--sum( case when page_id in (2047936,2051457,1677950, 2046791,2047936,1468757,2047936,1468757,2053742,2054032,5387,2045573,3286) and  sojlib.soj_nvl(soj, 'sHit') = 0  then 1 else 0 end) null_SRP_1pct,
SUM( CASE WHEN page_id IN (2047936,2051457,1677950, 2046791,2047936,1468757,2047936,1468757,2053742,2054032,5387,2045573,3286) AND 
(case when sojlib.is_decimal(COALESCE(sojlib.soj_nvl(soj,'sHit'), sojlib.soj_nvl(sojlib.soj_url_decode_escapes(sojlib.soj_url_decode_escapes(sojlib.soj_nvl(soj,'trknvpsvc'),'%'),'%'),'sHit'), sojlib.soj_nvl(url_query_string,'sHit')), 18, 0) = 1
then COALESCE(sojlib.soj_nvl(soj,'sHit'), sojlib.soj_nvl(sojlib.soj_url_decode_escapes(sojlib.soj_url_decode_escapes(sojlib.soj_nvl(soj,'trknvpsvc'),'%'),'%'),'sHit'), sojlib.soj_nvl(url_query_string,'sHit')) 
else null end) = 0
THEN 1 ELSE 0 END) null_SRP_1pct,
------ sum( case when page_id in (2047935,1673582,1468719,2047935,1468719,2056116,5408,2047675,4340) and sojlib.soj_nvl(soj,'srrank') in (1,2,3)   then 1 else 0 end ) top_three_result_click_1pct
sum( case when page_id in (2047675,4340,2047935,1673582,1468719,2047935,1468719,2047675,4340) and (case when sojlib.is_decimal(sojlib.soj_nvl(soj,'srrank'),18,0)=1 then cast(sojlib.soj_nvl(soj,'srrank') as decimal(18,0)) else 0 end) in (1,2,3)   then 1 else 0 end ) click_top3
from p_soj_cl_v.clav_session_1pct a
inner join ubi_v.ubi_event_1pct b
on a.guid = b.guid
and a.session_starT_dt = b.session_start_Dt
and a.session_skey = b.session_skey
where a.session_start_dt >=  date '2014-12-12' 
and a.session_start_dt < date '2014-12-13'
and b.session_start_dt >= date '2014-12-12' 
and b.session_start_dt < date '2014-12-13'
--and a.site_id in (0,3,77,2,15)
--and b.site_id  in (0,3,77,2,15)
and a.site_id = b.site_id
and a.cobrand in (0,6,7)
and rdt = 0
and 
( page_id in (2047936,2051457,1677950, 2046791,2047936,1468757,2047936,1468757,2053742,2054032,5387,2045573,3286)         --------------------------SRP
or 
page_id in (2047935,1673582,1468719,2047935,1468719,2056116,5408,2047675,4340)                       ----------------------------VI
or
page_id in (2051286,2051303,2051273,1677907,1677908,1677909,2051286,2051303,2051273,1468745, 1468744, 1468743,2051286,2051303,2051273,1468745, 1468744, 1468743,2055413,5369, 3984) -----------------------My ebay
or
page_id in (2047939,1625112,	1677902,1677906,2047939,1468737, 1468738,2047939,1468737, 1468738,2056088,5366, 5197,2057337, 2050601)   ------------------HP
)
and exclude = 0
group by 1,2,3,4;


