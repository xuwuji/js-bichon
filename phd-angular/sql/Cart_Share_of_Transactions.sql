--Cart Share of Transactions: CART_trans_cnt/trans_cnt (app_buyer_l2_v.prd_health_mon_com_trans -> app_buyer_t.prd_health_mon_com_trans)
 
/* *********************************************************************
# Title       : Product Health Monitor Complete Transaction Load
# Filename    : app_buyer.prd_health_mon_com_trans.ins.sql
# Description : Load complete trans data for PHM
# 
# Parameters  : 
# Explanation : 
# Location    : $DW_SQL/
# Called by   : UC4 ()
#
# Date        Ver#   Modified By(Name)     Change and Reason for Change
# --------   -----  ---------------------- -----------------------------
# 03/23/2014  0.1    Alfred             Initial Version
# 04/23/2014  1.0    Alfred             Productionize
# 05/04/2014  2.0    Alfred             Change to Mobile split
# 12/02/2014  3.0    Harper, Gu         Add Full Site Data
#********************************************************************* */

.MAXERROR 1;

CREATE multiset volatile TABLE prd_health_mon_com_trans_w AS (
SELECT 
xot.created_dt,
xot.item_id AS item_id,
xot.transaction_id AS transaction_id,
xot.trans_site_id,
xot.sale_type,
xot.checkout_status,
co.app_id AS co_app_id,
co.sess_cobrand  platform,
CASE WHEN ( ( (CASE WHEN cart.ck_app_sts_bmap = -999 THEN 0 WHEN cart.ck_app_sts_bmap < 0 THEN cart.ck_app_sts_bmap + 2147483648 ELSE cart.ck_app_sts_bmap  END) (INT) ) /8192) MOD 2 =1 THEN 1 ELSE 0 END AS RetailStandardPay          
/*  Retailstandard flag gets dropped only for site txns. For mobile, RSP txns get counted into SellerIP txns. There is no way to seperate mobile Seller IP and mobile RSP txns currently */
,CASE WHEN ( ( (CASE WHEN CK_APP_STS_BMAP = -999 THEN 0 WHEN CK_APP_STS_BMAP < 0 THEN CK_APP_STS_BMAP + 2147483648 ELSE CK_APP_STS_BMAP  END) (INT) ) /1) MOD 2 =1 THEN 1 ELSE 0 END AS TurboCheckout      
,CASE WHEN ( ( (CASE WHEN CK_FLAGS2 < 0 THEN CK_FLAGS2 + 2147483648 ELSE CK_FLAGS2 END) (INT) ) /536870912 ) MOD 2 =1 THEN 'Y' ELSE 'N' END AS SellerIP
,CASE WHEN (((CASE WHEN CHECKOUT_FLAGS5 = -999 THEN 0 WHEN CHECKOUT_FLAGS5 < 0 THEN CHECKOUT_FLAGS5 + 2147483648 ELSE CHECKOUT_FLAGS5 END) (INT)) /268435456) MOD 2 =1 THEN 'Y' ELSE 'N' END AS xo_shopcart
,CASE WHEN (((CASE WHEN CHECKOUT_FLAGS4 = -999 THEN 0 WHEN CHECKOUT_FLAGS4 < 0 THEN CHECKOUT_FLAGS4 + 2147483648 ELSE CHECKOUT_FLAGS4 END) (INT)) /2) MOD 2 =1 THEN 'Y' ELSE 'N' END AS EBAY_GUEST_TRANS
,SUM(co.quantity) AS bought_items                                                      
,SUM(CAST(co.item_price * co.quantity * co.lstg_curncy_exchng_rate AS DECIMAL(18,2))) AS gmb_usd                                        
FROM access_views.dw_checkout_trans_v2 xot
JOIN P_SOJ_CL_V.CHECKOUT_METRIC_ITEM co ON xot.item_id=co.item_id AND xot.transaction_id = co.transaction_id 
AND xot.auct_end_dt=co.auct_end_dt 
AND xot.created_dt=co.created_dt
JOIN access_views.cart_entity enty ON COALESCE(xot.cart_srvc_id,xot.ck_cart_id) = enty.cart_srvc_id 
AND xot.item_id=enty.item_id
AND xot.transaction_id=enty.transaction_id
AND dltd_ind = 0 AND entity_id_txt LIKE '%itemid%' 
AND enty.src_cre_dt >= date '2014-12-12'
LEFT JOIN access_views.dw_ck_app_sesn cart ON enty.cart_srvc_id=cart.cart_srvc_id 
AND cart.src_cre_dt >= date '2014-12-12'
WHERE  xot.auct_end_dt>= date '2014-12-12' -30 
AND xot.created_dt >= date '2014-12-12'
AND xot.created_dt < date '2014-12-13'
AND xot.sale_type NOT IN (-999, -888, 12, 13, 14, 15)
and  co.sess_cobrand in (0,6,7)
GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12,13
) WITH DATA 
PRIMARY INDEX ( item_id, transaction_id)
on commit preserve rows
;

delete from app_buyer_t.prd_health_mon_com_trans
where created_dt >= date '2014-12-12'
and created_dt < date '2014-12-13';

insert into app_buyer_t.prd_health_mon_com_trans
(
created_dt                    
,site                          
,cobrand
,app_id                      
,sale_type                           
,completed_xo                  
,Turbo_YN                      
,ip_flag                       
,IMDT_PAY_IND
,EBAY_GUEST_TRANS               
,trans_cnt                     
,bought_items                  
,gmb_usd                       
)
SELECT
   xot.created_dt,
   xot.trans_site_id,	
      xot.platform,	
      --xot.co_app_id,								
             CASE WHEN apps.app_id IS NULL then null 
                            WHEN TRIM(apps.prdct_name) IN ('IPhoneApp' ) THEN 1462
                            WHEN TRIM(apps.prdct_name) IN ('Android','Android Motors') THEN 2571
                            WHEN TRIM(apps.prdct_name) IN ('IPad') THEN 2878
                            WHEN TRIM(apps.prdct_name) IN ('MobWeb','MobWebGXO') THEN 3564
                            ELSE  10959
                   END  as app_id,
      xot.sale_type,
      CASE WHEN xot.checkout_status = 2 THEN 1 ELSE 0 END AS completed_xo,
-- Turbo XO can apply for both IP and non-IP txns. So, graph IP (ebay IP, seller IP) vs. non-IP seperately and then turbo vs. non-turbo seperately
    CASE WHEN TurboCheckout = 1 THEN 'Turbo' ELSE 'SBC' END AS Turbo_YN,
--below statement removes overlap in IP below  (FOR example, IF a RSP eligible txn IS checked OUT USING Cart, THEN that txn cannot be DOUBLE counted IN IP)
    CASE WHEN xo_shopcart= 'Y'  THEN 'CART'
        WHEN  SellerIP='Y' AND xo_shopcart='N' THEN 'SELLER IP' 
         WHEN RetailStandardPay= 1 AND xo_shopcart='N'  AND SellerIP='N' THEN 'RSP' 
          WHEN EBAY_GUEST_TRANS='Y' AND  SellerIP='N' AND RetailStandardPay= 0 AND xo_shopcart= 'N'  THEN 'GXO'   
          ELSE 'Non-IP'
          END AS ip_flag,
    CASE WHEN ip_flag='SELLER IP' THEN 'SELLER IP'
    WHEN ip_flag IN ('GXO','RSP','CART') THEN 'eBay IP'  
    ELSE 'Non-IP'
    END AS IMDT_PAY_IND,
    EBAY_GUEST_TRANS,
    COUNT( xot.transaction_id) AS trans_cnt,
    sum(bought_items) as bought_items,
    sum(gmb_usd)
FROM
prd_health_mon_com_trans_w xot
LEFT JOIN access_views.dw_api_mbl_app apps ON xot.co_app_id = apps.app_id			
GROUP BY 1,2, 3,4,5,6,7,8,9,10;
