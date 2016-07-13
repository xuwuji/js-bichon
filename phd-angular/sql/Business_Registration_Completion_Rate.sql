--Business Registration Completion Rate: SLR_REG_CMP_B2C_CNT/SLR_REG_START_B2C_CNT (app_buyer_l2_v.PHD_SLR_MTRC_l -> app_buyer_t.PHD_SLR_B2C_REG)
 
/* *********************************************************************
# Title       : Product Health Monitor SELLER B2C REG Metric 
# Filename    : app_buyer.phd_slr_b2c_reg.del_ins.sql
# Description : Load B2C REG Data for PHM
# Parameters  : app_buyer.phd_slr_b2c_reg
# Explanation : 
# Location    : $DW_SQL/
# Called by   : UC4 ()
#
# Date        Ver#   Modified By(Name)     Change and Reason for Change
# --------   -----  ---------------------- -----------------------------
# 11/14/2014  1.0    Harper, Gu            Initial Version
# 11/28/2014  2.0    Harper, Gu            Add Full Site
# 12/09/2014  2.1    Harper, Gu            fix where bug
#********************************************************************* */

DELETE FROM app_buyer_t.PHD_SLR_B2C_REG
WHERE Bus_creation_date = DATE  '2014-12-12';

INSERT INTO app_buyer_t.PHD_SLR_B2C_REG
SEL a.site_id,
CAST(a.creation_date AS DATE) AS Bus_creation_date,
CAST(b.creation_date AS DATE) AS Slr_creation_date,
COUNT(DISTINCT a.principal_id) Bus_attempts,
SUM(CASE WHEN a.current_ruv_state  =1 THEN 1 ELSE 0 END) Bus_Completed,
SUM(CASE WHEN a.current_ruv_state =1 AND b.principal_id IS NOT NULL THEN 1 ELSE 0 END) Slr_Attempts,
SUM(CASE WHEN a.current_ruv_state = 1 AND b.current_ruv_state =1 THEN 1 ELSE 0 END) Slr_Completed
FROM Ebay_TS_V.VRFN_REQD_USER_VRFCN a
LEFT JOIN Ebay_TS_V.VRFN_REQD_USER_VRFCN b
ON a.principal_id = b.principal_id

--AND b.site_id IN (0,3,77,15)
AND b.intent = 1
AND CAST(b.creation_date AS DATE)=
(SEL MAX(CAST(creation_date AS DATE)) FROM Ebay_TS_V.VRFN_REQD_USER_VRFCN c WHERE c.principal_id = b.principal_id AND c.intent =1 AND c.site_id = b.site_id)
AND CAST(b.creation_date AS DATE) >= DATE '2014-12-12'
WHERE 1=1
--and a.site_id IN (0,3,77,15)           
AND CAST(a.creation_date AS DATE) >= DATE '2014-12-12'
AND a.intent = 5
GROUP BY 1,2,3
--) WITH DATA PRIMARY INDEX (Bus_creation_date,site_id);
