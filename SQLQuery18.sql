USE GochitamaDB;
GO

DECLARE @area INT =
(
    SELECT TOP 1 id
    FROM dbo.area
    WHERE name = N'郡山市'
);

IF @area IS NULL
BEGIN
    PRINT N'郡山市が登録されていません。';
END
ELSE
BEGIN
    -- テスト店舗
    IF NOT EXISTS (
        SELECT 1 FROM dbo.shop
        WHERE name = N'テスト店舗'
    )
    BEGIN
        INSERT INTO dbo.shop
            (area_id, name, kind, lat, lng, comment, updated_at)
        VALUES
            (@area, N'テスト店舗', 'shokuji',
             37.398500, 140.389000,
             N'マーカー表示確認用', SYSDATETIME());
    END;

    -- テスト居酒屋
    IF NOT EXISTS (
        SELECT 1 FROM dbo.shop
        WHERE name = N'テスト居酒屋'
    )
    BEGIN
        INSERT INTO dbo.shop
            (area_id, name, kind, lat, lng, comment, updated_at)
        VALUES
            (@area, N'テスト居酒屋', 'izakaya',
             37.397500, 140.387500,
             N'マーカー表示確認用', SYSDATETIME());
    END;
END;
GO

-- 登録結果
SELECT
    s.id,
    s.name,
    s.kind,
    s.lat,
    s.lng,
    a.name AS area_name
FROM dbo.shop s
JOIN dbo.area a ON a.id = s.area_id
ORDER BY s.id;
GO