USE GochitamaDB;

INSERT INTO dbo.shop
    (area_id, name, kind, lat, lng, comment, updated_at)
SELECT
    id,
    N'テスト店舗',
    'test',
    37.398000,
    140.388100,
    N'マーカー表示確認用',
    SYSDATETIME()
FROM dbo.area
WHERE code = '07203'
AND NOT EXISTS (
    SELECT 1
    FROM dbo.shop
    WHERE name = N'テスト店舗'
);

-- 登録結果を確認
SELECT * FROM dbo.shop;