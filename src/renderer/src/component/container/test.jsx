UPDATE `test`.`test_date_1` SET `id` = 1, `birth` = '2023-04-26', `date_time` = '2023-04-11 22:34:46', `timestamp112` = '2023-04-13 15:05:20', `string1` = '123123', `test1` = '22:05:17' WHERE `id` = 1 AND `birth` = Cast('2023-04-11'AS Binary(10)) AND `date_time` = Cast('2023-04-11 22:34:46'AS Binary(19)) AND `timestamp112` = Cast('2023-04-12 15:05:20'AS Binary(19)) AND `string1` = '123123' AND `test1` = Cast('23:05:17'AS Binary(8)) LIMIT 1;


INSERT INTO `test`.`test_date_1`(`id`, `birth`, `date_time`, `timestamp112`, `string1`, `test1`) VALUES (1, '2023-04-11', '2023-04-11 22:34:46', '2023-04-12 15:05:20', '123123', '23:05:17');
UPDATE `test`.`people` SET `id` = 123, `name` = NULL WHERE `id` IS NULL AND `name` IS NULL LIMIT 1;
