--Auction Conversion Rate: AUCT_SOLD_LSTG_CNT/AUCT_LSTG_CNT (app_buyer_l2_v.PHD_SLR_MTRC_l -> app_buyer_t.PHD_SLR_AUCT_CONV)
 
/* *********************************************************************
# Title       : Action Conversion Rate
# Filename    : app_buyer.phd_slr_auct_conv.del_ins.sql
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

 DELETE FROM app_buyer_t.PHD_SLR_AUCT_CONV
	WHERE 
		cal_dt>= DATE '2014-12-12' 
    	AND cal_dt<   DATE '2014-12-13';
INSERT INTO app_buyer_t.PHD_SLR_AUCT_CONV 
SELECT 
lstg.auct_end_dt AS cal_dt,
CASE WHEN lstg.item_site_id IN (0,1) THEN 0 ELSE  lstg.item_site_id  END AS site_id,
COUNT(DISTINCT lstg.item_id) AS LSTG_CNT,
COUNT(DISTINCT ck.item_id) AS SOLD_LSTG_CNT
--(SOLD_LSTG_CNT*1.00000)/(LSTG_CNT*1.00000) AS AUCT_CONV_RATE
FROM ACCESS_VIEWS.DW_LSTG_ITEM lstg
	INNER JOIN ACCESS_VIEWS.DW_CATEGORY_GROUPINGS cat
		ON (lstg.LEAF_CATEG_ID=cat.LEAF_CATEG_ID 	AND lstg.ITEM_SITE_ID =cat.SITE_ID)
	LEFT OUTER JOIN ACCESS_VIEWS.DW_CHECKOUT_TRANS ck 
			ON (ck.item_id = lstg.ITEM_ID AND CK.AUCT_END_DT = LSTG.AUCT_END_DT
					  AND ck.SALE_TYPE NOT IN (10,12,14,15)
					  AND ck.RPRTD_WACKO_YN = 'N'
					  AND ck.ck_wacko_yn='n'
					  AND ck.auct_end_dt >= '2014-12-12'  -- get changed 
					  AND  ck.auct_end_dt <  DATE '2014-12-13')
WHERE 1=1
AND lstg.auct_end_dt  >= DATE '2014-12-12' --- all listings ended on that day, change dates here 
AND lstg.auct_end_dt  < DATE '2014-12-13'  -- change dates here 
AND lstg.auct_type_code NOT IN (10,12,14,15)  --exclude half.com, shopping.com
AND cat.SAP_CATEGORY_ID NOT IN (5,7,23,41) --CORE GMV only
--AND lstg.item_site_id IN (0,1,2,3,15,77)  -- big five only 
AND lstg.WACKO_YN = 'N' --exclude WACKO
AND lstg.auct_type_code NOT IN (7,9) --exclude fixed price items
GROUP BY 1,2;
