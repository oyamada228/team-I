
DECLARE @AreaId INT;

-- 郡山市のIDを取得
SELECT @AreaId = id
FROM dbo.area
WHERE code = '07203';

IF @AreaId IS NULL
BEGIN
    THROW 50001, '郡山市の地域データが見つかりません。', 1;
END;

-- 店舗データ
DECLARE @Shops TABLE (
    name NVARCHAR(100),
    address NVARCHAR(200),
    kind VARCHAR(10),
    lat DECIMAL(9,6),
    lng DECIMAL(9,6)
);

INSERT INTO @Shops (name, address, kind, lat, lng)
VALUES
(N'安兵衛（大町店）', N'福島県郡山市大町1-3-12', 'izakaya', 37.398487, 140.385712),
(N'正月荘', N'福島県郡山市大槻町字水門東1-20', 'shokuji', 37.382122, 140.340149),
(N'おうせ茶屋', N'福島県郡山市逢瀬町河内字東長倉1-1', 'shokuji', 37.413570, 140.294662),
(N'もりっしゅ', N'福島県郡山市燧田195', 'shokuji', 37.397964, 140.388947),
(N'鶴我', N'福島県郡山市大町1-2-18', 'shokuji', 37.398602, 140.384857),
(N'枡はん', N'福島県郡山市本町1-14-3', 'shokuji', 37.394135, 140.383759),
(N'めん処 成', N'福島県郡山市朝日1-7-12', 'shokuji', 37.403419, 140.362106),
(N'郡山中華そば しょうや', N'福島県郡山市大槻町字御十日1-1', 'shokuji', 37.385948, 140.353760),
(N'しのや', N'福島県郡山市駅前2-6-3', 'izakaya', 37.399075, 140.386581),
(N'くしぜん', N'福島県郡山市大町1-4-16', 'izakaya', 37.398880, 140.385574),
(N'珍満', N'福島県郡山市駅前2-7-19', 'shokuji', 37.398804, 140.386154),
(N'村さ来（桑野店）', N'福島県郡山市桑野3-11-13', 'izakaya', 37.406174, 140.357010),
(N'美日庵', N'福島県郡山市富田東5-101', 'shokuji', 37.422405, 140.370880),
(N'クッチーナ', N'福島県郡山市並木3-6-8', 'shokuji', 37.409241, 140.357681);

-- 既に登録されている店舗は重複登録しない
INSERT INTO dbo.shop (
    area_id,
    name,
    address,
    kind,
    lat,
    lng,
    comment,
    qr_token,
    updated_at
)
SELECT
    @AreaId,
    s.name,
    s.address,
    s.kind,
    s.lat,
    s.lng,
    NULL,
    NULL,
    SYSDATETIME()
FROM @Shops s
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.shop existing
    WHERE existing.area_id = @AreaId
      AND existing.name = s.name
);

-- 登録結果を確認
SELECT
    id,
    name,
    address,
    kind,
    lat,
    lng
FROM dbo.shop
WHERE area_id = @AreaId
ORDER BY id;
