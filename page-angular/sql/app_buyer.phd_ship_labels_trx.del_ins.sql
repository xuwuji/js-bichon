/* *********************************************************************
# Title       : printed Labels/Trx
# Filename    : app_buyer.phd_ship_labels_trx.del_ins.sql
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

--LABELS_PRINTED/TRANSACTIONS

DELETE FROM app_buyer_t.PHD_SHP_LABELS WHERE CAL_DT between date '$START_DT' -14 and date '$START_DT';

INSERT INTO app_buyer_t.PHD_SHP_LABELS
(
CAL_DT,
SITE_ID,
LABELS_PRINTED,
TRANSACTIONS
)
SEL  CK_DT AS CAL_DT,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
CASE   WHEN LSTG_SITE_ID IN (0,1,100) THEN 0 ELSE LSTG_SITE_ID END AS  SITE_ID,                                                                
SUM( CASE WHEN TRKING_NR_TYPE_CD=2  OR SHIPMENT_ID > 0 THEN 1 ELSE 0 END) AS LABELS_PRINTED,
COUNT(*) AS TRANSACTIONS
FROM   access_views.SSA_SHPMT_TRANS_FACT  FACT                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
WHERE  1=1
AND CK_DT between date '$START_DT'- 14 and  date '$START_DT'  -- change the date here
AND WACKO_YN_IND = 'N'                                                                                                                                                                                                                                                                   
AND LSTG_END_DT>= date '$START_DT' - 44  -- PPI column for performance consideration  
AND SAP_CATEG_ID NOT IN (5,7,23,41,57) --core categories only 
AND LSTG_TYPE_CD in (1,7,8,9) 
AND CK_STATUS_CD=2 --completed transactions, refresh 14 days data incrementally  
AND SELLER_CNTRY_ID in (-999,-1,0,1,225,679,1000,3,77)-- only seller from US,UK,DE     
AND  LSTG_SITE_ID IN (0,100, 1, 3,77) -- US, UK, DE                                                                                                                                                                                                                        
GROUP BY 1,2;

