
-- ŒSRs‚ª–¢“o˜^‚Ìê‡‚¾‚¯’Ç‰Á‚·‚é
IF NOT EXISTS (
    SELECT 1
    FROM dbo.area
    WHERE code = '07203'
)
BEGIN
    INSERT INTO dbo.area
    (
        code,
        prefecture,
        name,
        lat,
        lng,
        updated_at
    )
    VALUES
    (
        '07203',
        N'•Ÿ“‡Œ§',
        N'ŒSRs',
        37.398000,
        140.388100,
        SYSDATETIME()
    );
END;

-- “o˜^Œ‹‰Ê‚ğŠm”F
SELECT * FROM dbo.area;
