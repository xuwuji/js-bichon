--Completion Rate: succ_sess_cnt/temp_sess_cnt (app_buyer_l2_v.PHD_SLR_MTRC_v -> app_buyer_t.PHD_SLR_lstg_cmp)
 
/* *********************************************************************
# Title       : Listing Completion Rate
# Filename    : app_buyer.phd_slr_lstg_cmp.del_ins.sql
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

 DELETE FROM app_buyer_t.PHD_SLR_lstg_cmp
	WHERE 
		cal_dt>= DATE '2014-12-12' 
    	AND cal_dt<   DATE '2014-12-13';
--2.1.1 WN/SYI 
INSERT INTO app_buyer_t.PHD_SLR_lstg_cmp 
SEL           
        s.session_start_dt,   
        s.lstg_tool AS  lstg_tool,
        s.site_id,      
         COUNT(1) AS session_cnt,      
        SUM(CASE WHEN s.SUCCESS_SESSION_YN=1 THEN 1 ELSE 0 END) SUCCESS_SESSION_CNT 
FROM        
(  
SELECT                                                  
        guid,                                               
        session_skey,                                       
        site_id,
        session_start_dt,  
        cobrand,
        mweb_yn,
       CASE WHEN FLOW IN ('WebNext','Gandalf') THEN 'WebNext' ELSE 'SYI' END lstg_tool, 
       SLR_SEGMENT,
        MAX (IS_SUCCESS ) AS SUCCESS_SESSION_YN             
    FROM                                                    
    	P_SA_PPW_V.WN_EVENT a
    WHERE 
--    	a.site_id IN (0,2,3,15,77) 
--    	AND 
		a.SESSION_START_DT>= DATE '2014-12-12' --- change date here 
    	AND a.SESSION_START_DT<   DATE '2014-12-13'   --- change date here 
    	AND a.wn_mode NOT LIKE  '%Revise%'  
    GROUP BY 1,2,3,4,5,6,7,8
) s
GROUP BY 1,2,3;

--2.1.2 Mobile 
INSERT INTO app_buyer_t.PHD_SLR_lstg_cmp 
SELECT                                                      
    S.session_start_dt,     
    'MobileApp' AS lstg_tool,   
   S.site_id,   
  COUNT(1) AS SESSION_CNT ,                              
    SUM(SUCCESS_SESSION_YN) AS SUCC_SESSION_CNT             
FROM                                                        
    (                                                       
    SELECT                                                  
        guid,
        user_id,
        session_skey,                                       
        session_start_dt,     
        seller_segment_detail,
        SITE_ID,
        PLATFORM,
        MAX(CASE WHEN page_id IN( 2053243,2052182) THEN 1 ELSE 0 END) AS SUCCESS_SESSION_YN             
    FROM                                                    
        P_SA_PPW_V.MOBILE_EVENT a
    WHERE    a.SESSION_START_DT>= DATE '2014-12-12' --- change date here 
    	AND a.SESSION_START_DT<   DATE '2014-12-13'   --- change date here 
--    AND a.site_id IN (0,2,3,15,77)                
    GROUP BY 1,2,3,4,5,6,7                                     
    ) S                                             
 GROUP BY 1,2,3;
 
  --2.1.3  BEAR
INSERT INTO app_buyer_t.PHD_SLR_lstg_cmp  
 SELECT 
 	 w.src_cre_dt,
    'BEAR' AS lstg_tool,    
       w.site_id, 
       SUM(CASE WHEN e.ENTITY_STS_CD <> 3 THEN 1 ELSE 0 END) AS draft_cnt,
      SUM(CASE WHEN e.ENTITY_STS_CD = 1 THEN 1 ELSE 0 END)  AS lstg_cnt
FROM  access_views.BEAR_WRKSPC w
JOIN  access_views.BEAR_ENTITY e
ON    w.BEAR_WRKSPC_ID = e.BEAR_WRKSPC_ID
WHERE  w.src_cre_dt>= DATE '2014-12-12' --- change date here 
 AND w.src_cre_dt<   DATE '2014-12-13'   --- change date here 
AND   e.src_cre_dt >= DATE '2014-12-12'   --- change date here  
--AND  w. site_id IN (0,1,2,3,15,77)
AND   w.WRKSPC_PRPS_CD IN
(3, -- relist
4, -- Sell Similar
5, -- Send to Auction
6, -- Sell Again
7, -- Relist as Fixed Price
19) -- Drafts
GROUP BY 1,2,3
;
