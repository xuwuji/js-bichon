--Block Pass Rate: BlockPassed_draft/blocked_draft (app_buyer_t.PHD_SLR_LSTG_BLOCK)
 
/*
 * 
 * --------------------------------------------------------------------------------
 * Title:        C2C_BlockRate
 * Filename:     app_buyer.phd_slr_lstg_block.del_ins.sql
 * Description:  This sql is for running phd seller Block Pass Rate on Vivaldi
 *
 * Developer:    Gu, Xingzhu
 *
 * Called By     :app_buyer.phd_slr_minus_tables_load_sts.ksh
 * Calls         :
 * Input         :
 * Output/Return Code: n/a
 *
 *
 * Date          Ver#    Modified By(Name)             Change and Reason for Change
 * ---------     -----   -------------------------     ---------------------------------
 * 2014-11-10    1.0     Harper, Gu                    Initial Version
 * 2014-11-28    2.0     Harper, Gu                    Add Full Site
 *----------------------------------------------------------------------------------
 */
 DELETE FROM app_buyer_t.PHD_SLR_LSTG_BLOCK
	WHERE 
		cal_dt>= DATE '2014-12-12' 
    	AND cal_dt<   DATE '2014-12-13';
insert into app_buyer_t.PHD_SLR_LSTG_BLOCK 
SELECT 
Rule_FIRE_DT AS cal_dt
,SITE_ID
,SUM(blocked_draft) AS blocked_draft
,SUM(BlockPassed_draft) AS BlockPassed_draft
FROM  p_sa_ppw_v.elvis_block
WHERE Rule_FIRE_DT>=DATE '2014-12-12' 
AND Rule_FIRE_DT < DATE '2014-12-13'
--AND site_id IN (0,2,3,15,77) --Missing CA(2) data in source table
GROUP BY 1,2;
