USE GochitamaDB;

-- 郡山市のIDを取得
DECLARE @AreaId INT;

SELECT @AreaId = id
FROM dbo.area
WHERE code = '07203';

-- 郡山市が登録されているか確認
IF @AreaId IS NULL
BEGIN
    PRINT N'郡山市の地域データが見つかりません';
END
ELSE
BEGIN
    -- テスト店舗を登録
    INSERT INTO dbo.shop
        (area_id, name, kind, lat, lng, comment, updated_at)
    VALUES
        (@AreaId,
         N'テスト店舗',
         'test',
         37.3980,
         140.3881,
         N'マーカー表示確認用',
         SYSDATETIME());

    PRINT N'店舗データを登録しました';
END;

-- 登録結果を確認
SELECT * FROM dbo.shop;