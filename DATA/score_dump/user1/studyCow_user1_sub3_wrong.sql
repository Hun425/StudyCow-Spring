-- 50~67 / 66, 67, 60, 61, 62, 57

INSERT INTO t_wrong_detail (score_id, cat_code, wrong_cnt) VALUES
-- For score_id 3001 (test_score = 92, total wrong_cnt = 4)
(3001, 66, 1),
(3001, 67, 1),
(3001, 60, 1),
(3001, 61, 1),

-- For score_id 3002 (test_score = 79, total wrong_cnt = 7)
(3002, 66, 2),
(3002, 67, 3),
(3002, 62, 2),

-- For score_id 3003 (test_score = 84, total wrong_cnt = 6)
(3003, 60, 2),
(3003, 61, 1),
(3003, 62, 1),
(3003, 57, 2),

-- For score_id 3004 (test_score = 75, total wrong_cnt = 8)
(3004, 66, 2),
(3004, 67, 3),
(3004, 61, 1),
(3004, 62, 1),
(3004, 57, 1),

-- For score_id 3005 (test_score = 96, total wrong_cnt = 1)
(3005, 66, 1);
