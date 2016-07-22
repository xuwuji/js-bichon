/* *********************************************************************
# Title       : valid tracking
# Filename    : app_buyer.phd_ship_valid_trk.del_ins.sql
# Description : 
# Parameters  : 
# Explanation : 
# Location    : $DW_SQL/   Mozart
# Called by   : UC4 ()
#
# Date        Ver#   Modified By(Name)     Change and Reason for Change
# --------   -----  ---------------------- -----------------------------
# 01/26/2015  1.0    Harper, Gu            Initial Version
#********************************************************************* */

-- % Valid tracking = VALID_TRKING_CNT / TRKING_CNT
--RESTATE 30 DAYS data daily 


DELETE FROM app_buyer_t.PHD_SHP_VALID_TRK WHERE CAL_DT between date '$START_DT' -30 and date '$END_DT';

INSERT INTO app_buyer_t.PHD_SHP_VALID_TRK
(
CAL_DT,
SITE_ID,
VALID_TRKING_CNT,
TRKING_CNT
)
SEL dtl.SRC_CRE_DT AS CAL_DT
,xo.SITE_ID
,SUM(CASE WHEN COALESCE( dtl.DLVRD_DT, dtl.ACPTNC_SCAN_DT) IS NOT NULL THEN 1 ELSE 0 END) AS VALID_TRKING_CNT   -- Tracking numbers with valid scan
,COUNT(*) AS TRKING_CNT
FROM   ACCESS_VIEWS.DW_SHPMT_TRKING_DTL dtl
JOIN      ACCESS_VIEWS.DW_SHPMT_TRKING_MAP mapp
ON    dtl.SHPMT_TRKING_DTL_ID=mapp.SHPMT_TRKING_DTL_ID
JOIN      ACCESS_VIEWS.DW_CHECKOUT_TRANS xo
ON    mapp.ITEM_ID=xo.ITEM_ID AND mapp.TRANS_ID=xo.TRANSACTION_ID

WHERE     1=1
AND xo.AUCT_END_DT>=date '$START_DT' -60
AND xo.CREATED_DT BETWEEN date '$START_DT' -30 AND DATE '$END_DT'
AND dtl.SRC_CRE_DT BETWEEN date '$START_DT' -30 AND DATE '$END_DT'
AND xo.SITE_ID IN (0,100,3,77) -- US, UK & DE Site only
AND dtl.VALID_YN_IND='Y'        -- Soft delete flag; only Tracking numbers that were not deleted from Site Oracle table
GROUP BY 1,2;

