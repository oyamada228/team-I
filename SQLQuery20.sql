
USE GochitamaDB;
GO

DECLARE @AreaId INT;

SELECT TOP 1 @AreaId = id
FROM dbo.area
WHERE code = '07203';

IF @AreaId IS NULL
BEGIN
    PRINT N'郡山市の地域データがありません。';
END
ELSE
BEGIN
    INSERT INTO dbo.food (area_id, name, origin, source)
    SELECT @AreaId, v.name, v.origin, v.source
    FROM (VALUES
        (
            N'クリームボックス',
            N'厚切りパンにミルク風味のクリームを塗った郡山市発祥のご当地グルメ。',
            N'https://www.kanko-koriyama.gr.jp/tourism/detail3-1-487.html'
        ),
        (
            N'郡山ブラック',
            N'郡山市のご当地ラーメン。',
            N'https://www.kanko-koriyama.gr.jp/tourism/list3-1.html'
        ),
        (
            N'こおりやまグリーンカレー',
            N'郡山産食材を活用した郡山オリジナルのカレー。',
            N'https://www.city.koriyama.lg.jp/soshiki/226/176795.html'
        ),
        (
            N'郡山の鯉料理',
            N'郡山市で親しまれている鯉を使った料理。',
            N'https://www.city.koriyama.lg.jp/soshiki/226/176795.html'
        ),
        (
            N'キャベツ餅',
            N'郡山市逢瀬町周辺で食べられてきた郷土料理。',
            N'https://www.kanko-koriyama.gr.jp/tourism/list3-1.html'
        )
    ) AS v(name, origin, source)
    WHERE NOT EXISTS (
        SELECT 1
        FROM dbo.food f
        WHERE f.area_id = @AreaId
          AND f.name = v.name
    );
END;
GO

-- 登録結果を確認
SELECT
    f.id,
    f.name AS 料理名,
    f.origin AS 説明,
    a.name AS 地域名
FROM dbo.food f
INNER JOIN dbo.area a
    ON f.area_id = a.id
ORDER BY f.id;
GO
