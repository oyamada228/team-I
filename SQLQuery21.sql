
USE GochitamaDB;
GO

-- テスト店舗と料理を関連付ける
INSERT INTO dbo.shop_food (shop_id, food_id)
SELECT s.id, f.id
FROM (VALUES
    (N'テスト店舗', N'クリームボックス'),
    (N'テスト店舗', N'郡山ブラック'),
    (N'テスト居酒屋', N'郡山の鯉料理')
) AS v(shop_name, food_name)
INNER JOIN dbo.shop s
    ON s.name = v.shop_name
INNER JOIN dbo.food f
    ON f.name = v.food_name
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.shop_food sf
    WHERE sf.shop_id = s.id
      AND sf.food_id = f.id
);
GO

-- 関連付けの確認
SELECT
    s.name AS 店舗名,
    f.name AS 料理名
FROM dbo.shop_food sf
INNER JOIN dbo.shop s ON s.id = sf.shop_id
INNER JOIN dbo.food f ON f.id = sf.food_id
ORDER BY s.id, f.id;
GO
