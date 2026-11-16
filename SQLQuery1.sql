USE GochitamaDB;
GO

-- 各テーブルの登録件数
SELECT 'area' AS table_name, COUNT(*) AS total FROM area
UNION ALL
SELECT 'course', COUNT(*) FROM course
UNION ALL
SELECT 'course_stop', COUNT(*) FROM course_stop
UNION ALL
SELECT 'food', COUNT(*) FROM food
UNION ALL
SELECT 'phrase', COUNT(*) FROM phrase
UNION ALL
SELECT 'shop', COUNT(*) FROM shop
UNION ALL
SELECT 'shop_food', COUNT(*) FROM shop_food
UNION ALL
SELECT 'thanks', COUNT(*) FROM thanks;