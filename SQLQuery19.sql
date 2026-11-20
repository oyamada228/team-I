USE GochitamaDB;

SELECT
    f.id,
    f.name AS —¿—–¼,
    a.name AS ’nˆæ–¼,
    f.origin AS —R—ˆ
FROM dbo.food f
LEFT JOIN dbo.area a
    ON f.area_id = a.id
ORDER BY f.id;