--Listing Share: lstg_cnt/ttl_lstg_cnt (app_buyer_l2_v.PHD_SLR_MTRC_v -> app_buyer_t.PHD_SLR_lstg_share)
 
/* *********************************************************************
# Title       : Listing Share by Listing Tool
# Filename    : app_buyer.phd_slr_lstg_share.del_ins.sql
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


 DELETE FROM app_buyer_t.PHD_SLR_lstg_share
	WHERE 
		cal_dt>= DATE '2014-12-12' 
    	AND cal_dt<   DATE '2014-12-13';
insert into app_buyer_t.PHD_SLR_lstg_share
SELECT 
lstg.auct_start_dt AS cal_dt,
CASE WHEN lkp.app_id IS NOT NULL THEN 'MobileApp' 
			 WHEN lstg.application_id  IN (56507)  THEN 'BEAR'
			 WHEN lstg.application_id  IN (67161)  THEN 'WebNext'
			 WHEN lstg.application_id= 0 AND lc.LSTG_MTHD_ID<>21 THEN 'SYI'
ELSE 'Others' END AS lstg_tool, 
CASE WHEN lstg.item_site_id IN (0,1) THEN 0 ELSE  lstg.item_site_id  END AS site_id,
COUNT(DISTINCT lstg.item_id) AS LSTG_CNT
FROM ACCESS_VIEWS.DW_LSTG_ITEM lstg
JOIN ACCESS_VIEWS.DW_LSTG_ITEM_COLD lc  ON lstg.auct_end_dt=lc.auct_end_dt AND  lstg.item_id=lc.item_id 
	INNER JOIN ACCESS_VIEWS.DW_CATEGORY_GROUPINGS cat
		ON (lstg.LEAF_CATEG_ID=cat.LEAF_CATEG_ID 	AND lstg.ITEM_SITE_ID =cat.SITE_ID)
	LEFT OUTER JOIN ACCESS_VIEWS.DW_API_MBL_APP lkp ON lkp.app_id=lstg.application_id 
		WHERE 1=1
		AND lstg.auct_start_dt >= DATE '2014-12-12'--change date here 
		AND lstg.auct_start_dt <  DATE '2014-12-13'--change date here 
		AND lstg.auct_end_dt >= DATE '2014-12-12'--- change date here 
		AND lstg.auct_type_code NOT IN (10,12,14,15)  
		AND cat.SAP_CATEGORY_ID NOT IN (5,7,23,41) --CORE GMV only
--		AND lstg.item_site_id IN (0,1,2,3,15,77)  -- big five only 
GROUP BY 1,2,3
;
