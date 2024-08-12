DELIMITER //
-- 방 입장 log 입력 시 방 참여유저 insert, 방 인원 수 최신화
CREATE TRIGGER TRG_BEFORE_INSERT_IN_LOG
BEFORE INSERT ON t_in_log
FOR EACH ROW
BEGIN
	DECLARE V_USER_ID INT;
    DECLARE V_ROOM_ID bigint;
    DECLARE V_ROOM_CNT INT;
    DECLARE V_ATTEND_ROOM bigint;
    DECLARE V_ATTEND_CNT INT;
    
    SET V_USER_ID = NEW.user_id;
    SET V_ROOM_ID = NEW.room_id;
    
    -- 정산일자를 06:00 기준으로 업데이트 하기위한 STUDY_DATE
    IF NEW.in_date - INTERVAL 6 HOUR < current_date() THEN
		SET NEW.study_date = current_date() - interval 1 day;
	ELSE 
		SET NEW.study_date = current_date();
    END IF;
    
    -- 현재 유저가 참석중인 방 확인
    SELECT room_id INTO V_ATTEND_ROOM
	FROM t_attend 
    WHERE user_id = V_USER_ID;
    
    -- 참석자 정보 조회 후 없을 경우 INSERT 처리
	IF V_ATTEND_ROOM IS NULL THEN
        INSERT INTO t_attend (user_id, room_id) 
        VALUES (V_USER_ID, V_ROOM_ID);
	-- 참석자가 다른 방에 참여중일 경우
	ELSEIF V_ATTEND_ROOM <> V_ROOM_ID THEN
	BEGIN
		-- 참석자가 참여 정보 UPDATE
		UPDATE t_attend SET room_id = V_ROOM_ID
		WHERE user_id = V_USER_ID;
        
        -- 기존에 참여했던 방의 정보 최신화
        SELECT COUNT(*) 
		INTO V_ATTEND_CNT 
		FROM t_attend 
		WHERE room_id = V_ATTEND_ROOM; 
        
        UPDATE t_room
        SET room_now_person = V_ATTEND_CNT,
        room_update_date = NOW()
        WHERE room_id = V_ATTEND_ROOM;
	END;
    END IF;
    
    SELECT COUNT(*) 
    INTO V_ROOM_CNT 
    FROM t_attend 
    WHERE room_id = V_ROOM_ID;
    
    -- 현재 참석중인 인원 수 업데이트
    UPDATE t_room 
    SET room_now_person = V_ROOM_CNT,
    room_update_date = NOW()
    WHERE room_id = NEW.room_id;
END //

DELIMITER //
-- 방 입장 log 퇴장 시 방 참여유저 delete, 방 인원 수 최신화
CREATE TRIGGER TRG_AFTER_UPDATE_IN_LOG
AFTER UPDATE ON t_in_log
FOR EACH ROW
BEGIN
	DECLARE V_OUT_DATE DATETIME(6);
    DECLARE V_USER_ID INT;
	DECLARE V_ROOM_ID BIGINT;
	DECLARE V_ROOM_CNT INT;
        
    SET V_OUT_DATE = NEW.out_date;
    
    -- out_date가 업데이트되고 기존 out_date와 현 out_date가 다를 경우 trigger 실행
    IF V_OUT_DATE IS NOT NULL AND (OLD.out_date IS NULL OR V_OUT_DATE <> OLD.out_date) THEN
		SET V_USER_ID = OLD.user_id;
		SET V_ROOM_ID = OLD.room_id;
        
        DELETE FROM t_attend
        WHERE user_id = V_USER_ID AND room_id = V_ROOM_ID;
        
		SELECT COUNT(*) 
		INTO V_ROOM_CNT 
		FROM t_attend 
		WHERE room_id = V_ROOM_ID;
		
		UPDATE t_room 
		SET room_now_person = V_ROOM_CNT,
        room_update_date = NOW()
		WHERE room_id = NEW.room_id;
    
    END IF;
END //

DELIMITER //
-- exp 부여 시 user정보 동기화
CREATE TRIGGER TRG_AFTER_INSERT_EXP_LOG
AFTER INSERT ON t_exp_log
FOR EACH ROW
BEGIN
    DECLARE V_USER_ID INT;
    DECLARE V_NOW_GRADE INT;
    DECLARE V_USER_EXP INT;
    DECLARE V_GRADE_CODE INT;
	
    SET V_USER_ID = NEW.user_id;
    
    -- 부여된 exp만큼 user_exp 증가
    UPDATE t_user SET user_exp = user_exp + NEW.get_amount
    WHERE user_id = V_USER_ID;
    
    -- 증가 후 현재 exp와 등급 조회
    SELECT grade_code, user_exp INTO V_NOW_GRADE, V_USER_EXP
    FROM t_user
    WHERE user_id = V_USER_ID;
    
    -- 현 exp에 맞는 등급 조회
    SELECT grade_code INTO V_GRADE_CODE FROM t_grade_code
    WHERE V_USER_EXP BETWEEN min_exp AND max_exp;
    
    -- 등급변동이 있을 경우 유저정보 동기화
    IF V_GRADE_CODE <> V_NOW_GRADE THEN
		UPDATE t_user SET grade_code = V_GRADE_CODE
        WHERE user_id = V_USER_ID;
    END IF;
    
END //