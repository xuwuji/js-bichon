/* *********************************************************************
# Title       : tracking percentage/TXN
# Filename    : app_buyer.phd_ship_percent_trk.del_ins.sql
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

--PCT_TRKING_CNT/PCT_TRX_CNT

DELETE FROM app_buyer_t.PHD_SHP_PCT_TRK WHERE CAL_DT between date '$START_DT' -30 and date '$END_DT' ;

INSERT INTO app_buyer_t.PHD_SHP_PCT_TRK
(
CAL_DT,
SITE_ID,
PCT_TRKING_CNT,
PCT_TRX_CNT
)
SEL 
CK_DT AS CAL_DT
,case when LSTG_SITE_ID in (0,100) and BUYER_CNTRY_ID IN (-999,-1,0,1,225,679,1000) then 0 
when LSTG_SITE_ID=3 and BUYER_CNTRY_ID=3 then 3 
when LSTG_SITE_ID=77 and buyer_cntry_id=77 then 77 
end as SITE_ID 
,SUM(CASE WHEN TRKING_NR_TXT IS NOT NULL THEN 1 ELSE 0 END) AS PCT_TRKING_CNT 
,COUNT(*) AS PCT_TRX_CNT 

FROM ACCESS_VIEWS.SSA_SHPMT_TRANS_FACT fact 


WHERE 1=1 
AND fact.CK_DT BETWEEN DATE '$START_DT' -30 AND DATE '$END_DT' 
AND fact.LSTG_END_DT >= DATE '$START_DT' -60 
AND fact.FIRST_PYMT_DT >= DATE '$START_DT' -30 
AND fact.FIRST_PYMT_DT IS NOT NULL 
AND fact.LSTG_TYPE_CD NOT IN (12,15) 
AND fact.LSTG_SITE_ID IN (0,100,3,77) 
AND fact.WACKO_YN_IND = 'N' 
AND fact.SAP_CATEG_ID NOT IN (5,7,23,41) 
AND fact.BUYER_CNTRY_ID IN (-999,-1,0,1,225,679,1000,3,77) 
AND site_id IS NOT NULL
GROUP BY 1,2 ;

