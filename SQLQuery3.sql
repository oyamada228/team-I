USE GochitamaDB;
GO

SELECT
    fk.name AS 外部キー名,
    tp.name AS テーブル名,
    cp.name AS 列名,
    tr.name AS 参照先テーブル,
    cr.name AS 参照先列
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc
    ON fk.object_id = fkc.constraint_object_id
INNER JOIN sys.tables tp
    ON fkc.parent_object_id = tp.object_id
INNER JOIN sys.columns cp
    ON fkc.parent_object_id = cp.object_id
    AND fkc.parent_column_id = cp.column_id
INNER JOIN sys.tables tr
    ON fkc.referenced_object_id = tr.object_id
INNER JOIN sys.columns cr
    ON fkc.referenced_object_id = cr.object_id
    AND fkc.referenced_column_id = cr.column_id
ORDER BY tp.name;