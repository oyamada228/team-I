USE GochitamaDB;

SELECT
    name AS §–ñ–¼,
    definition AS ‹–‰Â‚³‚ê‚Ä‚¢‚éğŒ
FROM sys.check_constraints
WHERE name = 'CK_shop_kind';