# wordpress 常用 sql

## 查询id对应文章
```sql
SELECT * FROM `wp_posts` WHERE ID = 11
```

## 查询菜单id
```sql
SELECT * FROM wp_terms WHERE name = '音乐';
```

## 查询分类ID下的所有分类

```sql
-- 获取分类 ID 36 及其子分类的 term_taxonomy_id
WITH RECURSIVE category_tree AS (
  SELECT term_id, term_taxonomy_id
  FROM wp_term_taxonomy
  WHERE term_id = 36 AND taxonomy = 'category'
  UNION ALL
  SELECT tt.term_id, tt.term_taxonomy_id
  FROM wp_term_taxonomy tt
  INNER JOIN category_tree ct ON tt.parent = ct.term_id
)
SELECT term_taxonomy_id FROM category_tree;
```


## 查询分类及其子分类下的文章

```sql
-- term_id = 36 表示查询分类id为36下的所有
SELECT DISTINCT p.ID, p.post_title, p.post_date
FROM wp_posts p
INNER JOIN wp_term_relationships tr ON p.ID = tr.object_id
WHERE tr.term_taxonomy_id IN (
  -- 嵌套查询，获取分类及其子分类的 term_taxonomy_id
  WITH RECURSIVE category_tree AS (
    SELECT term_id, term_taxonomy_id
    FROM wp_term_taxonomy
    WHERE term_id = 36 AND taxonomy = 'category'
    UNION ALL
    SELECT tt.term_id, tt.term_taxonomy_id
    FROM wp_term_taxonomy tt
    INNER JOIN category_tree ct ON tt.parent = ct.term_id
  )
  SELECT term_taxonomy_id FROM category_tree
)
AND p.post_status = 'publish' -- 仅查询已发布的文章
AND p.post_type = 'post';     -- 限制为普通文章
```

## 批量对文章新增分类
```sql
-- term_id 
SET @term_id = 5;

-- 获取 term_taxonomy_id
SET @term_taxonomy_id = (
  SELECT term_taxonomy_id 
  FROM wp_term_taxonomy 
  WHERE term_id = @term_id AND taxonomy = 'category'
);

-- 为多个文章批量添加分类关系
INSERT IGNORE INTO wp_term_relationships (object_id, term_taxonomy_id, term_order)
VALUES 
    (154, @term_taxonomy_id, 0);
```

## 查询分类及其子分类下的文章并排除某些文章ID

```sql
-- term_id = 36 表示查询分类id为36下的所有
-- 查询分类及其子分类下的文章，并排除特定文章 ID
SELECT DISTINCT p.ID, p.post_title, p.post_date
FROM wp_posts p
INNER JOIN wp_term_relationships tr ON p.ID = tr.object_id
WHERE tr.term_taxonomy_id IN (
  -- 嵌套查询，获取分类及其子分类的 term_taxonomy_id
  WITH RECURSIVE category_tree AS (
    SELECT term_id, term_taxonomy_id
    FROM wp_term_taxonomy
    WHERE term_id = 36 AND taxonomy = 'category'
    UNION ALL
    SELECT tt.term_id, tt.term_taxonomy_id
    FROM wp_term_taxonomy tt
    INNER JOIN category_tree ct ON tt.parent = ct.term_id
  )
  SELECT term_taxonomy_id FROM category_tree
)
AND p.post_status = 'publish' -- 仅查询已发布的文章
AND p.post_type = 'post'      -- 限制为普通文章
AND p.ID NOT IN (1505, 1504, 1436); -- 排除的文章 ID 列表
```

## 查询分类及子分类下的文章并排除某些文章ID，并新增文章的分类

```sql
-- 要对查询结果新增的菜单 ID
SET @term_id = 999;

-- 获取 term_taxonomy_id
SET @term_taxonomy_id = (
  SELECT term_taxonomy_id 
  FROM wp_term_taxonomy 
  WHERE term_id = @term_id AND taxonomy = 'category'
);

-- 批量添加分类关系
INSERT IGNORE INTO wp_term_relationships (object_id, term_taxonomy_id, term_order)
SELECT DISTINCT p.ID, @term_taxonomy_id, 0
FROM wp_posts p
INNER JOIN wp_term_relationships tr ON p.ID = tr.object_id
WHERE tr.term_taxonomy_id IN (
    -- 嵌套查询获取分类及其子分类的 term_taxonomy_id
    WITH RECURSIVE category_tree AS (
        SELECT term_id, term_taxonomy_id
        FROM wp_term_taxonomy
        -- term_id = 36 表示查询分类id为36下的所有
        WHERE term_id = 36 AND taxonomy = 'category'
        UNION ALL
        SELECT tt.term_id, tt.term_taxonomy_id
        FROM wp_term_taxonomy tt
        INNER JOIN category_tree ct ON tt.parent = ct.term_id
    )
    SELECT term_taxonomy_id FROM category_tree
)
AND p.post_status = 'publish'
AND p.post_type = 'post'
AND p.ID NOT IN (
    1557, 1504, 1468
);
```