USE GochitamaDB;

DECLARE @definition NVARCHAR(MAX);

SELECT @definition = definition
FROM sys.check_constraints
WHERE name = 'CK_shop_kind';

PRINT @definition;