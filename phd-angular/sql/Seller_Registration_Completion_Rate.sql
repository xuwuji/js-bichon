--Seller Registration Completion Rate: SLR_REG_CMP_CNT/SLR_REG_START_CNT (app_buyer_l2_v.PHD_SLR_MTRC_l -> app_buyer_t.PHD_SLR_VRFY_CMP)
 
/* *********************************************************************
# Title       : C2C_SELLER Verification Completion Rate
# Filename    : app_buyer.phd_slr_vrfy_cmp.del_ins.sql
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

 DELETE FROM app_buyer_t.PHD_SLR_VRFY_CMP
	WHERE 
		cal_dt>= DATE '2014-12-12' 
    	AND cal_dt<   DATE '2014-12-13';
insert into app_buyer_t.PHD_SLR_VRFY_CMP
SEL b.creation_Date AS cal_dt,
CASE WHEN  b.site_id = 0 AND b.prcs_type_cd = 52 THEN 0 
WHEN b.site_id = 3 AND b.prcs_type_cd = 52 THEN 3
WHEN b.site_id = 77 AND b.prcs_type_cd = 52 THEN 77
WHEN b.site_id  = 15 AND b.prcs_type_cd = 67  THEN 15 
WHEN b.site_id  = 2 AND b.prcs_type_cd = 67  THEN 2
when b.site_id not in (0,2,3,15,77) then b.site_id
END AS Site,
CASE  WHEN b.clnt_src_cd = 2 THEN 'WebNext' 
WHEN b.clnt_src_cd = 3 THEN 'SYI' 
WHEN b.clnt_src_cd IN (10,16)  THEN 'iPhoneApp' 
WHEN b.clnt_src_cd IN (11,17) THEN 'iPadApp' 
WHEN b.clnt_src_cd IN (12,15)  THEN 'AndroidApp'  
ELSE 'Others' END AS Client_Source,
b.Start_Count,
c.Same_Day_Completed
-- (c.Same_Day_Completed*100/b.Start_Count) AS Same_Day_Completion_Rate
FROM
(
SELECT
site_id,
prcs_type_cd,
CAST(src_cre_dt AS DATE) AS creation_date,
clnt_src_cd ,
COUNT(*) AS Start_Count
 FROM access_views.dw_tuv_user_vrfctn 
WHERE  1=1
--AND site_id IN (0,2,3,77,15)
 AND prcs_type_cd IN (52,67) 
 AND CAST(src_cre_dt AS DATE) >= DATE '2014-12-12'	
  AND CAST(src_cre_dt AS DATE) < DATE '2014-12-13'	
GROUP BY 1,2,3,4
) b
LEFT JOIN
(
SELECT
site_id,
 prcs_type_cd,
 CAST(src_cre_dt AS DATE) AS creation_date,
 clnt_src_cd ,
 COUNT(*) AS Same_Day_Completed
 FROM access_views.dw_tuv_user_vrfctn 
WHERE  1=1
--AND site_id IN (0,2,3,77,15)
 AND prcs_type_cd IN (52,67) 
 AND CAST(src_cre_dt AS DATE) >= DATE '2014-12-12'	
  AND CAST(src_cre_dt AS DATE) < DATE '2014-12-13'	
 AND CAST(src_cre_dt AS DATE) = CAST(src_last_mdfd_dt AS DATE)
 AND user_vrfctn_sts_cd= 1
GROUP BY 1,2,3,4
)c
 ON b.site_id = c.site_id
 AND b.Creation_Date= c.creation_date
 AND b.clnt_src_cd = c.clnt_src_cd
 AND b.prcs_type_cd = c.prcs_type_cd
 WHERE site IS NOT NULL
-- AND Client_Source <> 'Others'
group by 1,2,3,4,5;
