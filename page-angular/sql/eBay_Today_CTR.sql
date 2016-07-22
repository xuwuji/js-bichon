--eBay Today CTR: ng_ebt_click_cnt/ng_ebt_page_cnt (app_buyer_t.prd_health_mon_ng_feed_ebt)
 
/* *********************************************************************
# Title       : Product Health Monitor NG Feed ebt Load
# Filename    : app_buyer.prd_health_mon_ng_feed_ebt.ins.sql
# Description : Load NG Feed ebt data for PHM
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

--Feed PVs:
CREATE MULTISET VOLATILE TABLE NG_FEED_TRAFFIC AS 
(SELECT	
e.session_start_dt
  ,e.site_id
  ,s.cobrand as Traffic_Source
,100*COUNT(*) as Feed_PVs -- # Page Views
FROM	 ubi_v.ubi_event_1pct e 
inner join P_SOJ_CL_V.CLAV_SESSION_1pct s
	ON	(E.session_skey = S.session_skey 
	AND	E.guid = S.guid 
	AND	E.session_start_dt = S.session_start_dt)
	WHERE	E.page_id = (2050601) 	
	AND s.cobrand IN (0,7) 
    AND s.bot_session = 0 
    and s.exclude=0
--    and S.site_id IN  (0, 2, 3, 15, 77, 100) 
--    and E.site_id IN  (0, 2, 3, 15, 77, 100) 
    AND E.session_start_dt >=  date '2014-12-12'    ---- UPDATE DATES HERE
    and E.session_start_dt <  date '2014-12-13'
	AND S.session_start_dt >= date '2014-12-12'           ---- UPDATE DATES HERE
	and S.session_start_dt < date '2014-12-13'
	 AND sojlib.soj_nvl(e.soj, 'collnlist') IS NULL ---- exclude eBay Today Pgvs
	AND 
	(    -- First time visits
	    ( sojlib.soj_str_between(sojlib.soj_nvl(E.soj, 'sid') (VARCHAR(50)) ,	'p','.') IS NULL)
	    -- Visits FROM other eBay pages (Feed HP->Feed HP events are excluded due to irrelevant events generated with Ajax calls on the Feed homepage).
	     OR (  sojlib.soj_nvl(E.soj , 'sid' ) NOT like ('%p2050601%') 
	     )
	     -- Feed HP->Feed HP ebay logo clicks on the homepage
	     OR (  sojlib.soj_nvl(E.soj , 'sid' ) like ('%p2050601%') 
	        AND sojlib.soj_nvl(E.soj , 'sid' ) like ('%l2586%') -- ebay logo module    if you get strange results then change this back to module
	     )
	)
GROUP	BY 1,2,3)   WITH DATA PRIMARY INDEX ( session_start_dt, site_id,Traffic_Source )
	ON	COMMIT PRESERVE ROWS
;

--Feed clicks: 
create multiset volatile table ng_feed_clicks as 
(sel e.session_start_dt
,e.site_id
,s.cobrand as Traffic_Source
,100*COUNT(*) (NAMED totalclick ) 
FROM  ubi_v.ubi_event_1pct e  
INNER JOIN P_SOJ_CL_V.CLAV_SESSION_1pct s
	ON	(E.session_skey = S.session_skey 
	AND	E.guid = S.guid 
	AND	E.session_start_dt = S.session_start_dt
	and 	e.site_id = s.site_id
	)
WHERE sojlib.soj_nvl(E.soj , 'sid' ) like ('%p2050601%')  -- Get only control users' clicks on Feed HP
--	and S.site_id IN  (0, 2, 3, 15, 77, 100) 
--    and E.site_id IN  (0, 2, 3, 15, 77, 100) 
    AND s.cobrand IN (0,7) 
    and exclude = 0
    AND s.bot_session = 0 
    AND E.session_start_dt >=  date '2014-12-12'    ---- UPDATE DATES HERE
    and E.session_start_dt <  date '2014-12-13'
	AND S.session_start_dt >= date '2014-12-12'           ---- UPDATE DATES HERE
	and S.session_start_dt < date '2014-12-13'
	and ( sojlib.soj_nvl(E.soj , 'sid' ) like any ('%m2136%','%m2137%','%m2138','%m2174%','%m2627%','%m2628%','%m2629%','%m2630%','%m2631%','%m2632%','%m2633%','%m2634%','%m2635%','%m2636%','%m2637%','%m2638%','%m2639%','%m2640%','%m2641%','%m2642%','%m2644%','%m2645%','%m2737%','%m2775%','%m2887%')
		             or page_id = 2056016)
GROUP	BY 1,2,3)
WITH DATA PRIMARY INDEX ( session_start_dt, site_id, Traffic_Source )
	ON	COMMIT PRESERVE ROWS
;

--eBt PVs:
create multiset volatile table ng_ebt_pvs as 
(
select
e.session_start_dt
,e.site_id
,s.cobrand as Traffic_Source
,	100* COUNT(*) as  ttl_pgvs  -- # Page Views
FROM	 ubi_v.ubi_event_1pct e 
INNER JOIN P_SOJ_CL_V.CLAV_SESSION_1pct s 
	ON	(E.session_skey = S.session_skey 
	AND	E.guid = S.guid 
	AND	E.session_start_dt = S.session_start_dt)
WHERE	(E.page_id = (2057337) 	
					or ( e.page_id in (2050601) and sojlib.soj_nvl(e.soj, 'collnlist') IS NOT NULL))
--	and S.site_id IN  (0, 2, 3, 15, 77, 100) 
--    and E.site_id IN  (0, 2, 3, 15, 77, 100) 
    AND s.cobrand IN (0,7) 
    AND s.bot_session = 0 
    and s.exclude = 0
    AND E.session_start_dt >=  date '2014-12-12'    ---- UPDATE DATES HERE
    and E.session_start_dt <  date '2014-12-13'
	AND S.session_start_dt >= date '2014-12-12'           ---- UPDATE DATES HERE
	and S.session_start_dt < date '2014-12-13'
	AND 
	(    -- First time visits
	    ( sojlib.soj_str_between(sojlib.soj_nvl(E.soj, 'sid') (VARCHAR(50)) ,	'p','.') IS NULL)
	    -- Visits FROM other eBay pages (Feed HP->Feed HP events are excluded due to irrelevant events generated with Ajax calls on the Feed homepage).
	     OR (    sojlib.soj_nvl(E.soj , 'sid' ) NOT like ('%p2057337%') 
	     )
	     -- Feed HP->Feed HP ebay logo clicks on the homepage
	     OR (    sojlib.soj_nvl(E.soj , 'sid' ) like ('%p2057337%') 
	        AND sojlib.soj_nvl(E.soj , 'sid' ) like ('%l2586%') -- ebay logo module    if you get strange results then change this back to module
	     )
	)
GROUP	BY 1,2,3)
WITH DATA PRIMARY INDEX ( session_start_dt, site_id, Traffic_Source )
	ON	COMMIT PRESERVE ROWS
;


--eBT Clicks:
create multiset volatile table ng_ebt_clicks as 
(select
e.session_start_dt
,	e.site_id
,s.cobrand as Traffic_Source
,	100 * COUNT(*) (NAMED totalclick ) 
FROM	  ubi_v.ubi_event_1pct e
INNER JOIN P_SOJ_CL_V.CLAV_SESSION_1pct s 
	ON	(E.session_skey = S.session_skey 
	AND	E.guid = S.guid 
	AND	E.session_start_dt = S.session_start_dt
	)
WHERE	sojlib.soj_nvl(E.soj , 'sid' ) like ('%p2057337%')  -- Get only control users' clicks on EBT
--	and S.site_id IN  (0, 2, 3, 15, 77, 100) 
--    and E.site_id IN  (0, 2, 3, 15, 77, 100) 
    AND s.cobrand IN (0,7) 
    AND s.bot_session = 0 
    and s.exclude = 0
	and sojlib.soj_nvl(E.soj , 'sid' ) like any ('%m2572%','%m2573%','%m2574%','%m2575%','%m2576%','%m2577%','%m2578%','%m2579%','%m2580%','%m2581%','%m2582%','%m2583%','%m2584%','%m2585%','%m2586%','%m2587%','%m2588%','%m2589%','%m2590%','%m2711%','%m2712%','%m2713%','%m2714%','%m2715%','%m2716%','%m2717%','%m2718%')
    AND E.session_start_dt >=  date '2014-12-12'    ---- UPDATE DATES HERE
    and E.session_start_dt <  date '2014-12-13'
	AND S.session_start_dt >= date '2014-12-12'           ---- UPDATE DATES HERE
	and S.session_start_dt < date '2014-12-13'
GROUP	BY 1,2,3)
WITH DATA PRIMARY INDEX ( session_start_dt, site_id, Traffic_Source )
	ON	COMMIT PRESERVE ROWS
;

delete from app_buyer_t.prd_health_mon_ng_feed_ebt
where session_start_Dt >= date '2014-12-12' 
and session_start_Dt  < date '2014-12-13';

insert into app_buyer_t.prd_health_mon_ng_feed_ebt
(
session_start_dt              
,site_id                       
,cobrand                      
,ng_feed_page_cnt              
,ng_feed_click_cnt             
,ng_ebt_page_cnt               
,ng_ebt_click_cnt              
)
select
session_start_dt              
,site_id                       
,platform                      
,sum(ng_feed_page_cnt)
,sum(ng_feed_click_cnt)
,sum(ng_ebt_page_cnt)            
,sum(ng_ebt_click_cnt)       
from 
(
select 
SESSION_START_DT              
,SITE_ID                       
,Traffic_Source as platform
,cast(Feed_PVs as dec(18,0)) as ng_feed_page_cnt
,cast(0 as dec(18,0)) as ng_feed_click_cnt             
,cast(0 as dec(18,0)) as ng_ebt_page_cnt               
,cast(0 as dec(18,0)) as ng_ebt_click_cnt       
from NG_FEED_TRAFFIC
union all
select 
SESSION_START_DT              
,SITE_ID                       
,Traffic_Source as platform
,cast(0 as dec(18,0)) as ng_feed_page_cnt
,cast(totalclick as dec(18,0)) as ng_feed_click_cnt             
,cast(0 as dec(18,0)) as ng_ebt_page_cnt               
,cast(0 as dec(18,0)) as ng_ebt_click_cnt       
from ng_feed_clicks
union all
select 
SESSION_START_DT              
,SITE_ID                       
,Traffic_Source as platform
,cast(0 as dec(18,0)) as ng_feed_page_cnt
,cast(0 as dec(18,0)) as ng_feed_click_cnt             
,cast(ttl_pgvs as dec(18,0)) as ng_ebt_page_cnt               
,cast(0 as dec(18,0)) as ng_ebt_click_cnt       
from ng_ebt_pvs
union all 
select 
SESSION_START_DT              
,SITE_ID                       
,Traffic_Source as platform
,cast(0 as dec(18,0)) as ng_feed_page_cnt
,cast(0 as dec(18,0)) as ng_feed_click_cnt             
,cast(0 as dec(18,0)) as ng_ebt_page_cnt               
,cast(totalclick as dec(18,0))as ng_ebt_click_cnt       
from ng_ebt_clicks) t
group by 1,2,3;
