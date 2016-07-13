--SM/SMP Visits: SM_VISIT_CNT (app_buyer_t.PHD_SLR_SM_VISITS)
 
/* *********************************************************************
# Title       : B2C_SM_SMP_Visits
# Filename    : app_buyer.phd_slr_sm_visits.del_ins.sql
# Description : 
# Parameters  : 
# Explanation : 
# Location    : $DW_SQL/
# Called by   : UC4 ()
#
# Date        Ver#   Modified By(Name)     Change and Reason for Change
# --------   -----  ---------------------- -----------------------------
# 11/14/2014  1.0    Harper, Gu            Initial Version
# 11/28/2014  2.0    Harper, Gu            Add Full Site
#********************************************************************* */

 DELETE FROM app_buyer_t.PHD_SLR_SM_VISITS
	WHERE 
		cal_dt>= DATE '2014-12-12' 
    	AND cal_dt<   DATE '2014-12-13';
INSERT INTO app_buyer_t.PHD_SLR_SM_VISITS
SELECT
SESSION_START_DT AS CAL_DT,
SITE_ID,
COUNT(DISTINCT USER_ID) AS SM_VISIT_CNT
FROM UBI_V.UBI_EVENT  V
WHERE SESSION_START_DT  >= DATE '2014-12-12' -- change date here 
AND SESSION_START_DT  < DATE '2014-12-13'  -- change date here 
AND USER_ID IS NOT NULL 
AND PAGE_ID IN (4840,4891,4894,1696,3804,3749,2921,2962,1625,4893,1626,1669,5468,1661,5508,2081,2083,2082,2060658,2063127) --selling manager pages
--AND SITE_ID IN (0,1,2,3,15,77)  
GROUP BY 1,2;
