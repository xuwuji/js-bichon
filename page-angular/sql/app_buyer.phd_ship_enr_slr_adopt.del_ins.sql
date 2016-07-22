/* *********************************************************************
# Title       : enrolled seller adoption
# Filename    : app_buyer.phd_ship_enr_slr_adopt.del_ins.sql
# Description : 
# Parameters  : 
# Explanation : 
# Location    : $DW_SQL/
# Called by   : UC4 ()
#
# Date        Ver#   Modified By(Name)     Change and Reason for Change
# --------   -----  ---------------------- -----------------------------
# 01/26/2015  1.0    Harper, Gu            Initial Version
#********************************************************************* */

--seller_intent_lstg/ttl_lstg

DELETE FROM app_buyer_t.PHD_SHP_SLR_ADOPT WHERE CAL_DT = 'START_DT';

-- change to temp table, get GSP Seller on the day when 
--DROP TABLE GSP_SLR;
CREATE VOLATILE TABLE gsp_slr AS (
--LOCKING ROW FOR ACCESS AS 
         SELECT
         user_log.USER_ID AS USER_ID
        /* , CASE WHEN site_id IN (0,100) THEN 'US'
                                    WHEN site_id IN (3) THEN 'UK'  END AS user_reg_gsp_program */
         ,case when site_id in (0,100) then 0 when site_id=3 then 3 end as gsp_prgm_site_id         
         FROM 
         access_views.DW_USER_AGRMNT_LOG user_log  
          
         WHERE 
         1=1
         AND user_log.SITE_ID IN (0,100,3) 
         AND user_log.AGRMNT_ID = 8   -- GSP_USER_AGREEMENT 
         AND user_log.AGRMNT_ACPT_IND = 1 -- 0 declined, 1 accepted  
         AND user_log.AGRMNT_STS_CD IN (1,3) --  1 Accepted, 3 is CS OVERIDE? 

) WITH DATA PRIMARY INDEX (USER_ID)
ON COMMIT PRESERVE ROWS;

--get GSP Enrolled Seller Adoption Rate         
INSERT INTO app_buyer_t.PHD_SHP_SLR_ADOPT 
(
 CAL_DT
, SITE_ID 
, seller_intent_lstg
, ttl_lstg
)
 SELECT 
 CAL_DT
, SITE_ID 
, seller_intent_lstg
, ttl_lstg
from (
         SELECT
		 CAL.CAL_DT
         --gsp_prgm_site_id
         ,LSTG.ITEM_SITE_ID AS SITE_ID
         ,CASE WHEN item_site_id IN (0,100) AND gsp_prgm_site_id = 0 THEN 1 
                                     WHEN item_site_id IN (3) AND gsp_prgm_site_id = 3 THEN 1
                                     ELSE 0 END AS Enrolled_slr
         , SUM(CASE WHEN  (((CASE WHEN COLD.FLAGS12 < 0 THEN COLD.FLAGS12 + 2147483648 ELSE COLD.FLAGS12 END ) (INT) ) /268435456 ) MOD 2 =1 THEN 1 ELSE 0 END) AS Seller_Intent_Lstg
         , COUNT(*) AS ttl_lstg            
         
         FROM access_views.DW_LSTG_ITEM LSTG
         INNER JOIN ACCESS_VIEWS.DW_CATEGORY_GROUPINGS CAT ON CAT.SITE_ID= LSTG.ITEM_SITE_ID AND CAT.LEAF_CATEG_ID = LSTG.LEAF_CATEG_ID        
         INNER JOIN ACCESS_VIEWS.DW_LSTG_ITEM_COLD COLD ON LSTG.ITEM_ID = COLD.ITEM_ID AND LSTG.AUCT_END_DT = COLD.AUCT_END_DT    
         INNER JOIN ACCESS_VIEWS.DW_CAL_DT CAL ON  ( LSTG.AUCT_END_DT>=CAL.CAL_DT AND LSTG.AUCT_START_DT<=CAL.CAL_DT)
         INNER JOIN gsp_slr gsp_slr ON lstg.slr_id = gsp_slr.user_id
         
         WHERE                 
         1=1          
         --AND CAL.CAL_DT  between date 'START_DT' and date 'END_DT' -- change date
         AND CAL.CAL_DT = date 'START_DT'
         AND LSTG.AUCT_END_DT >='START_DT'  --change date
         AND  COLD.AUCT_END_DT >= 'START_DT'  -- change dagte 
         AND CAT.SAP_CATEGORY_ID NOT IN (5,7,41,23) --EXCLUDES VEHICLE AND REAL ESTATE SAPS     
         AND LSTG.AUCT_TYPE_CODE NOT IN (12,15)              
         AND LSTG.ITEM_SITE_ID IN (0,100,3) --(3) --(0,100)                 
         GROUP BY 1,2,3
)a 
WHERE Enrolled_slr = 1;
