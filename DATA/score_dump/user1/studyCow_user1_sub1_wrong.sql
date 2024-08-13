-- 1~16

-- score_id 1001, test_score = 85
-- 총 wrong_cnt = (100 - 85) / 3 = 5
INSERT INTO t_wrong_detail (score_id, cat_code, wrong_cnt) VALUES
(1001, 1, 1),
(1001, 14, 2),
(1001, 15, 2);

-- score_id 1002, test_score = 90
-- 총 wrong_cnt = (100 - 90) / 3 = 3
INSERT INTO t_wrong_detail (score_id, cat_code, wrong_cnt) VALUES
(1002, 3, 1),
(1002, 14, 2);

-- score_id 1003, test_score = 87
-- 총 wrong_cnt = (100 - 87) / 3 = 4
INSERT INTO t_wrong_detail (score_id, cat_code, wrong_cnt) VALUES
(1003, 3, 1),
(1003, 5, 1),
(1003, 15, 2);

-- score_id 1004, test_score = 92
-- 총 wrong_cnt = (100 - 92) / 3 = 2
INSERT INTO t_wrong_detail (score_id, cat_code, wrong_cnt) VALUES
(1004, 14, 1),
(1004, 15, 1);

-- score_id 1005, test_score = 94
-- 총 wrong_cnt = (100 - 94) / 3 = 2
INSERT INTO t_wrong_detail (score_id, cat_code, wrong_cnt) VALUES
(1005, 1, 1),
(1005, 14, 1);
