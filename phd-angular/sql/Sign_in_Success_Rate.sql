--Sign in Success Rate: SI_SUCC/SI_ATTEMPT (app_buyer_l2_v.prd_health_signin_mtrc -> app_buyer_t.prd_health_signin_rate_mtrc) | cobrand in (0,7) SI_SUCC/SI_ATTEMPT; cobrand in (6)SI_SUCC/SI_VISITORS
 
/* *********************************************************************
# Title       : Product Health Monitor Sign in Metric 
# Filename    : app_buyer.prd_health_mon_signin_succ.ins.sql
# Description : Load sign in Data for PHM
# Two new metrics:  
#		1. Sign In Attempt Rate for PC and FSoM: 
#		2. Sign In Success Rate for PC and FSoM:
#Eixisting two metrics and its tables/view 
#		1.sign in view per visitor --app_buyer_t.prd_health_mon_signin_pages (not in this sql)
#		2.app_buyer_t.prd_health_signin_rate_mtrc -- sign in success rate 
#		(CREATE VIEW TO support app_buyer_l2_v.prd_health_signin_mtrc) 
# Parameters  : 
# Explanation : 
# Location    : $DW_SQL/
# Called by   : UC4 ()
#
# Date        Ver#   Modified By(Name)     Change and Reason for Change
# --------   -----  ---------------------- -----------------------------
# 11/11/2014  1.0    Harper, Gu            Initial Version
# 12/05/2014  1.1    Harper, Gu            Add FYP and Sign In Page Redesign
#********************************************************************* */


DELETE FROM app_buyer_t.prd_health_signin_rate_mtrc 
WHERE SESSION_START_DT BETWEEN date '2014-12-12' AND date '2014-12-13' -1 ;

/****************BASE TABLE*************************/
CREATE VOLATILE TABLE   phd_byr_signin_mtrc_w AS 
(
SELECT 
EE.SESSION_START_DT,
EE.SESSION_SKEY,
EE.GUID,
EE.SEQNUM,
EE.USER_ID,
EE.SITE_ID,
EE.RDT,
SOJLIB.SOJ_NVL(EE.SOJ,'uid') AS UID_TAG,
SOJLIB.SOJ_NVL(EE.SOJ,'KMSI') AS KMSI_TAG,
SOJLIB.SOJ_NVL(EE.SOJ,'sid') AS SID_TAG,
SOJLIB.SOJ_NVL(EE.SOJ,'sgnFastFYPReset') AS REG_TAG, --added to filter reg page 
SOJLIB.SOJ_NVL(EE.SOJ,'sgnTabClick') AS SGN_TAB_CLICK, -- added to distinguish between sign in page and registration page
EE.PAGE_ID,
EE.PAGE_NAME,
AA.COBRAND,
AA.Primary_APP_ID as app_id,
COALESCE(AA.SIGNEDIN_USER_ID, AA.MAPPED_USER_ID) AS CLAV_USER_ID

FROM UBI_V.UBI_EVENT EE
INNER JOIN P_SOJ_CL_V.CLAV_SESSION AA

ON (AA.SESSION_START_DT = EE.SESSION_START_DT
		AND AA.SESSION_SKEY = EE.SESSION_SKEY
		AND AA.GUID= EE.GUID
		AND AA.SITE_ID = EE.SITE_ID)

WHERE 1=1
AND AA.SESSION_START_DT BETWEEN date '2014-12-12' AND date '2014-12-13' -1 -- change date here 
AND EE.SESSION_START_DT BETWEEN date '2014-12-12' AND date '2014-12-13' -1 -- change date here 
AND EE.PAGE_ID IN (4853, 4852)
AND AA.COBRAND IN (0,7) ---only apply to PC and FSoM 
AND AA.EXCLUDE = 0 AND AA.bot_session = 0 AND AA.VALID_PAGE_COUNT >1
) WITH DATA 
PRIMARY INDEX (SESSION_START_DT,SESSION_SKEY,GUID)
ON COMMIT PRESERVE ROWS;
;

/*****************ROLL UP**********************************/
INSERT INTO app_buyer_t.prd_health_signin_rate_mtrc 
SELECT SESSION_START_DT,
SITE_ID,
COBRAND,
NULL AS app_id, 
COUNT (DISTINCT (CASE WHEN PAGE_ID = 4852 THEN GUID ELSE NULL END)) SI_ATTEMPT, -----ATTEMPT RATE = SI _ATTEMPT/ SI _VISITORS
COUNT (DISTINCT (CASE WHEN PAGE_ID = 4852 AND UID_TAG IS NOT NULL and REG_TAG is null THEN GUID ELSE NULL END)) SI_SUCC, ----- SUCCESS RATE = SI _SUCC/ SI_ATTEMPT, add REG tag filter after 11/16
COUNT (DISTINCT (CASE WHEN PAGE_ID = 4853 AND PAGE_NAME = 'SignIn2' and (SGN_TAB_CLICK = 'SignIn' OR SGN_TAB_CLICK IS NULL) THEN GUID ELSE NULL END)) SI_VISITORS --add SGN_TAB_CLICK after 11/16
/*,
COUNT ((CASE WHEN PAGE_ID = 4852 THEN GUID ELSE NULL END)) SI_ATTEMPT_PV,
COUNT ((CASE WHEN PAGE_ID = 4852 AND UID_TAG IS NOT NULL THEN GUID ELSE NULL END)) SI_SUCC_PV,
COUNT ((CASE WHEN PAGE_ID = 4853 AND PAGE_NAME = 'SignIn2' and (SGN_TAB_CLICK = 'SignIn' OR SGN_TAB_CLICK IS NULL) )THEN GUID ELSE NULL END)) SI_VISITORS_PV
*/
FROM 
phd_byr_signin_mtrc_w
--WHERE SESSION_START_DT=1141027 -- change date here 
GROUP BY 1,2,3
--) WITH DATA PRIMARY INDEX( SESSION_START_DT,SITE_ID,COBRAND,app_id)
;

/*
#For mobile experience cobrand=6 only, use a different definiton 
#Sign In Page Visitors = Distinct count of visitors to all the Sign In Page IDs
#Sign In Success = When a user ends up signed in a session where he¯s visited Sign In Page
#Sign In Success Rate  = Sign In Success/ Sign In Page Visitors
*/

/*******************************SIGN IN COMPARISON  - ALL PLATFORMS**************************/
--SEL COUNT(1) FROM signin_mbl
CREATE VOLATILE TABLE signin_mbl AS (
SELECT S.SESSION_START_DT,
                  S.SITE_ID,
                  s.cobrand, 
                  CASE WHEN S.COBRAND = 6 AND S.PRIMARY_APP_ID = 1462 AND E.PAGE_ID = 2050445 THEN 1462
                              WHEN s.cobrand = 6 AND s.primary_app_id IN (2573,10509,2410,2805) AND E.PAGE_ID = 2050445 THEN primary_app_id
                              WHEN s.cobrand = 6 AND s.primary_app_id = 2878 AND E.PAGE_ID = 2050445 THEN 2878
                              WHEN s.cobrand = 6 AND s.primary_app_id = 2571 AND E.PAGE_ID = 2050533 THEN 2571
                              WHEN s.cobrand = 6 AND s.primary_app_id = 3882 THEN 3882
                              WHEN s.cobrand = 6 AND s.primary_app_id = 3564 AND E.PAGE_ID = 2054029 THEN 3564
                      /*        WHEN s.cobrand = 7 AND E.PAGE_ID = 4853 AND E.PAGE_NAME = 'SignIn2' THEN 'Mobile: Core sites'
                              WHEN s.cobrand = 0 AND e.page_id = 4853 AND e.page_name = 'SignIn2' THEN 'PC'*/
                   END AS app_id,
                   S.SESSION_SKEY,
                   S.GUID,
                   CASE WHEN S.SIGNEDIN_USER_ID IS NOT NULL THEN S.SIGNEDIN_USER_ID ELSE NULL END AS SIGNED_IN_VISITOR
FROM p_soj_cl_v.clav_session s 
 INNER JOIN ubi_v.ubi_event e 
 ON (S.SESSION_START_DT =  E.SESSION_START_DT
         AND S.SESSION_SKEY = E.SESSION_SKEY
         AND S.GUID = E.GUID)                              
 WHERE 1=1
AND s.exclude = 0 AND s.bot_session = 0 AND s.VALID_PAGE_COUNT >1
--AND s.cobrand IN (0, 6, 7) 
AND s.cobrand=6 
 AND s.session_start_dt BETWEEN date '2014-12-12' AND date '2014-12-13' -1 -- change date here 
AND e.session_start_dt  BETWEEN date '2014-12-12' AND date '2014-12-13' -1  -- change date here 
AND e.page_id IN (4853, 2050533, 2050445, 2054029) -- sign in pages 
AND e.rdt = 0 
)WITH DATA PRIMARY INDEX (SESSION_START_DT,SESSION_SKEY,GUID)
ON COMMIT PRESERVE ROWS;

INSERT INTO  app_buyer_t.prd_health_signin_rate_mtrc
SELECT S.SESSION_START_DT,
S.SITE_ID,
S.cobrand,
S.app_id,
--COUNT(*) AS TOTAL_VISITS,
NULL AS SI_ATTEMPT, --doesn't populate for cobrand=6 
COUNT(DISTINCT SIGNED_IN_VISITOR) AS SI_SUCC , -------Signed In Visitors
COUNT(DISTINCT GUID) AS SI_VISITORS -- Total Visitors for Signed In page 
FROM signin_mbl S
--WHERE 1=1
--AND  s.session_start_dt  BETWEEN '2014-10-12' AND '2014-10-13'
GROUP BY 1,2,3,4
;

