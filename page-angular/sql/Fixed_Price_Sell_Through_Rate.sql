--Fixed Price Sell Through Rate: FP_QTY_SOLD/FP_QTY_AVAL (app_buyer_l2_v.PHD_SLR_MTRC_l -> app_buyer_t.PHD_SLR_FP_CONV)
 
/* *********************************************************************
# Title       : Fixed Price Sell Through Rate
# Filename    : app_buyer.phd_slr_fp_conv.del_ins.sql
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



 DELETE FROM app_buyer_t.PHD_SLR_FP_CONV
	WHERE 
		cal_dt = DATE '2014-12-12';
INSERT INTO app_buyer_t.PHD_SLR_FP_CONV
SELECT DATE '2014-12-12' AS cal_dt , -- change date here
CASE WHEN lstg.item_site_id IN ( 0 , 1 ) THEN 0 ELSE lstg.item_site_id END AS site_id ,
COUNT ( DISTINCT lstg.item_id ) AS LSTG_CNT ,
COUNT ( DISTINCT ck.item_id ) AS SOLD_LSTG_CNT   
FROM  ACCESS_VIEWS.DW_LSTG_ITEM lstg
INNER JOIN ACCESS_VIEWS.DW_CATEGORY_GROUPINGS cat
ON (lstg.LEAF_CATEG_ID=cat.LEAF_CATEG_ID 	AND lstg.ITEM_SITE_ID =cat.SITE_ID)
LEFT OUTER JOIN ACCESS_VIEWS.DW_CHECKOUT_TRANS ck 
ON ( ck.item_id = lstg.ITEM_ID AND CK.AUCT_END_DT = LSTG.AUCT_END_DT 
AND ck.SALE_TYPE NOT IN ( 10 , 12 , 14 , 15 ) AND ck.RPRTD_WACKO_YN = 'N' AND ck.ck_wacko_yn = 'n' 
AND ck.CREATED_DT = date '2014-12-12'-- change date here
AND ck.auct_end_dt >= date '2014-12-12' ) -- change date here
wHERE 1=1
AND lstg.auct_end_dt >= DATE '2014-12-12' AND lstg.auct_start_dt <= DATE '2014-12-12' --- all live listings on that day
AND cat.SAP_CATEGORY_ID NOT IN (5,7,23,41) --CORE GMV only
--AND lstg.item_site_id IN (0,1,2,3,15,77)  -- big five only 
AND lstg.WACKO_YN = 'N' --exclude WACKO
AND lstg.auct_type_code in (7,9) --fixed price items ONLY
GROUP BY 1 , 2;
