DELIMITER //
-- 1. 일일 유저 공부시간 정산
CREATE PROCEDURE P_DAILY_USER_STUDY(IN V_PROC_DATE DATE)
BEGIN
	CREATE TEMPORARY TABLE temp_user_study AS
    SELECT
		user_id,
        study_date AS proc_date,
        SUM(study_time) AS sum_study_time
	FROM t_in_log
    WHERE study_date = V_PROC_DATE
    GROUP BY user_id, study_date;

	INSERT INTO t_proc_user_study(user_id, proc_date, sum_study_time)
    SELECT user_id, proc_date, sum_study_time FROM temp_user_study
    ON DUPLICATE KEY UPDATE sum_study_time = VALUES(sum_study_time);
    
    DROP TEMPORARY TABLE temp_user_study;
END //


DELIMITER //
-- 2. 일일 방 공부시간 정산
CREATE PROCEDURE P_DAILY_ROOM_STUDY(IN V_PROC_DATE DATE)
BEGIN
	CREATE TEMPORARY TABLE temp_room_study AS
    SELECT
		room_id,
        study_date AS proc_date,
        SUM(study_time) AS sum_room_time
	FROM t_in_log
    WHERE study_date = V_PROC_DATE
    GROUP BY room_id, study_date;

	INSERT INTO t_proc_room_study(room_id, proc_date, sum_room_time)
    SELECT room_id, proc_date, sum_room_time FROM temp_room_study
    ON DUPLICATE KEY UPDATE sum_room_time = VALUES(sum_room_time);
    
    DROP TEMPORARY TABLE temp_room_study;
END //

DELIMITER //
-- 3. 일일 정산데이터에 따른 exp 부여
CREATE PROCEDURE P_DAILY_USER_EXP(IN V_PROC_DATE DATE)
BEGIN
	-- TEMP TABLE 생성 및 유저 공부시간 합산값에 따라 EXP 부여
	CREATE TEMPORARY TABLE temp_user_exp AS
    SELECT
		user_id,
        NOW() AS get_date,
        sum_study_time AS get_amount
	FROM t_proc_user_study
    WHERE proc_date = V_PROC_DATE;
    
    -- TEMP TABLE에 유저 RANK에 따라 EXP 부여
    INSERT INTO temp_user_exp(user_id, get_date, get_amount)
	SELECT user_id, NOW(),
	1050 - (rank() OVER (ORDER BY sum_study_time DESC)) * 50
	FROM t_proc_user_study
	WHERE proc_date = V_PROC_DATE
	LIMIT 10;

	-- TEMP TABLE에서 T_EXP_LOG 테이블로 INSERT
	INSERT INTO t_exp_log(user_id, get_date, get_amount)
    SELECT user_id, get_date, get_amount FROM temp_user_exp;
    
    DROP TEMPORARY TABLE temp_user_exp;
END //

DELIMITER //
-- 0. 일일 정산프로시저 호출
CREATE PROCEDURE P_DAILY_CALL_PROCEDURE(IN V_PROC_DATE DATE)
BEGIN
	START TRANSACTION;
	-- 1. 유저 일일 공부시간 정산
    CALL P_DAILY_USER_STUDY(V_PROC_DATE);
    
    -- 2. 방 일일 공부시간 정산
    CALL P_DAILY_ROOM_STUDY(V_PROC_DATE);
    
    -- 3. 정산 후 EXP 부여
    CALL P_DAILY_USER_EXP(V_PROC_DATE);
    
    COMMIT;
END //

DELIMITER //
-- 0-1. 공부시간 정산 프로시저 호출
CREATE PROCEDURE P_PROC_STUDY_TIME(IN V_PROC_DATE DATE)
BEGIN
	START TRANSACTION;
	-- 1. 유저 일일 공부시간 정산
    CALL P_DAILY_USER_STUDY(V_PROC_DATE);
    
    -- 2. 방 일일 공부시간 정산
    CALL P_DAILY_ROOM_STUDY(V_PROC_DATE);
    
    COMMIT;
END //

