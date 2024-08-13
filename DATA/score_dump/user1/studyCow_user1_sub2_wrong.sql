-- 17~49 / 46, 47 / 32, 34

-- score_id = 2001, test_score = 75
-- wrong_cnt 총 개수 = (100 - 75) / 3 = 8
INSERT INTO t_wrong_detail (score_id, cat_code, wrong_cnt) VALUES
(2001, 46, 4),
(2001, 32, 3),
(2001, 47, 1);

-- score_id = 2002, test_score = 78
-- wrong_cnt 총 개수 = (100 - 78) / 3 = 7
INSERT INTO t_wrong_detail (score_id, cat_code, wrong_cnt) VALUES
(2002, 34, 3),
(2002, 47, 2),
(2002, 32, 2);

-- score_id = 2003, test_score = 80
-- wrong_cnt 총 개수 = (100 - 80) / 3 = 6
INSERT INTO t_wrong_detail (score_id, cat_code, wrong_cnt) VALUES
(2003, 34, 2),
(2003, 46, 1),
(2003, 47, 3);

-- score_id = 2004, test_score = 82
-- wrong_cnt 총 개수 = (100 - 82) / 3 = 6
INSERT INTO t_wrong_detail (score_id, cat_code, wrong_cnt) VALUES
(2004, 36, 2),
(2004, 47, 2),
(2004, 46, 2);

-- score_id = 2005, test_score = 84
-- wrong_cnt 총 개수 = (100 - 84) / 3 = 5
INSERT INTO t_wrong_detail (score_id, cat_code, wrong_cnt) VALUES
(2005, 46, 2),
(2005, 47, 3);
