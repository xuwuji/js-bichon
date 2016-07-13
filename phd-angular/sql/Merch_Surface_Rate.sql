--Merch Surface Rate (7DMA): vi_surface_imp_cnt/vi_total_imp_cnt (app_buyer_l2_v.phm_merch_dly_tbl -> app_buyer_t.phm_merch_dly_tbl)
 
/* *********************************************************************
# Title       : Product Health Monitor Merch
# Filename    : phm_merch_dly_tbl_new.ins.sql
# Description : Load Merch data for PHM
# 
# Parameters  : 
# Explanation : 
# Location    : ARES /home/linhshen/sql/phm/
# Called by   : UC4 ()
#
# Date        Ver#   Modified By(Name)     Change and Reason for Change
# --------   -----  ---------------------- -----------------------------
# 12/03/2014  1.0    Harper, Gu            Initial Version
#********************************************************************* */


set mapred.job.queue.name=hdmi-mm;
set hive.enforce.bucketing = true;
set hive.enforce.sorting = true;
set hive.exec.dynamic.partition=true;
set hive.exec.dynamic.partition.mode=nonstrict;

insert overwrite table  phm_merch_dly_tbl_new partition(dt)
select a.site_id, a.placement_id, b.cobrand,b.primary_app_id,
COUNT(DISTINCT a.meid) total_imp_cnt,
count(distinct (case when a.oi>0 then a.meid else null end)) as surface_imp_cnt,
sum(size(a.vi)) as clicks,
a.dt
from (select dt, site_id, merch_date, guid, placement_id, meid,oi,vi
from merch_data
where dt >= 20141211
and dt <= 20141211
--and site_id in (0,3,77,15,2)
and placement_id IN (100005,100034)) a
inner join   (select
dt,
guid,
cast(cast(site_id as double) as int) as site_id,
cobrand,
null as primary_app_id
from
ubi_bi_session_hdp
where
dt >= 20141211
and dt <= 20141211
--and cast(cast(site_id as double) as int) in (0,3,77,15,2)
and cast(cast(cobrand as double) as int) in (0,7)
group by dt, guid, site_id, cobrand, prmry_app_id
) b
on a.guid = b.guid and a.site_id = b.site_id
and a.dt = b.dt
group by a.site_id, a.placement_id, b.cobrand, b.primary_app_id, a.dt;
