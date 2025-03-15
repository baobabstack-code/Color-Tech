# PostgreSQL Migration Guide

This guide provides instructions for completing the remaining tasks in the PostgreSQL migration project. It includes patterns and examples for updating models and routes to ensure compatibility with PostgreSQL.

## Migration Patterns

When migrating from MySQL to PostgreSQL, follow these patterns:

### 1. Update Model Files

1. **Change Result Handling**:
   - MySQL: `const [rows] = await db.query(...)`
   - PostgreSQL: `const result = await db.query(...); const rows = result.rows`

2. **Update Parameterized Queries**:
   - MySQL: `WHERE id = ?` with `[id]`
   - PostgreSQL: `WHERE id = $1` with `[id]`

3. **Handle Row Count**:
   - MySQL: `result.affectedRows`
   - PostgreSQL: `result.rowCount`

4. **Use RETURNING Clauses**:
   - MySQL: Separate query to get inserted ID
   - PostgreSQL: `INSERT ... RETURNING id`

5. **Update User Name Handling**:
   - MySQL: `full_name`
   - PostgreSQL: `CONCAT(first_name, ' ', last_name) as full_name`

### 2. Update Route Files

1. **Ensure Controllers Use PostgreSQL Syntax**:
   - Check that all database queries in controllers use PostgreSQL syntax
   - Update any direct database queries in route files

2. **Update Error Handling**:
   - Ensure error handling accounts for PostgreSQL error formats

## Examples

### Model Update Example (Service Model)

```typescript
// Before (MySQL)
async findById(id: number): Promise<Service | null> {
  try {
    const query = `
      SELECT s.*, sc.name as category_name
      FROM services s
      JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.id = ?
    `;
    
    const [rows] = await db.query(query, [id]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    logger.error('Database error:', error);
    throw error;
  }
}

// After (PostgreSQL)
async findById(id: number): Promise<Service | null> {
  try {
    const query = `
      SELECT s.*, sc.name as category_name
      FROM services s
      JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.id = $1
    `;
    
    const result = await db.query(query, [id]);
    return result.rows.length ? result.rows[0] : null;
  } catch (error) {
    logger.error('Database error:', error);
    throw error;
  }
}
```

### Update Method Example

```typescript
// Before (MySQL)
async update(id: number, data: UpdateData): Promise<boolean> {
  try {
    const updates = [];
    const values = [];
    
    if (data.name) {
      updates.push('name = ?');
      values.push(data.name);
    }
    
    if (updates.length === 0) return false;
    
    values.push(id);
    
    const query = `
      UPDATE table_name
      SET ${updates.join(', ')}
      WHERE id = ?
    `;
    
    const [result] = await db.query(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    logger.error('Database error:', error);
    throw error;
  }
}

// After (PostgreSQL)
async update(id: number, data: UpdateData): Promise<boolean> {
  try {
    const updates = [];
    const values = [];
    let paramCounter = 1;
    
    if (data.name) {
      updates.push(`name = $${paramCounter++}`);
      values.push(data.name);
    }
    
    if (updates.length === 0) return false;
    
    values.push(id);
    
    const query = `
      UPDATE table_name
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
    `;
    
    const result = await db.query(query, values);
    return result.rowCount > 0;
  } catch (error) {
    logger.error('Database error:', error);
    throw error;
  }
}
```

## Remaining Tasks

### 1. Update Review Model

1. Create or update the Review model to use PostgreSQL syntax
2. Update all methods to use `$1, $2, ...` for parameterized queries
3. Update result handling to use `result.rows`
4. Update any user name references to use `CONCAT(first_name, ' ', last_name)`

### 2. Update Content Model

1. Create or update the Content model to use PostgreSQL syntax
2. Update all methods to use `$1, $2, ...` for parameterized queries
3. Update result handling to use `result.rows`

### 3. Update Inventory Model

1. Create or update the Inventory model to use PostgreSQL syntax
2. Update all methods to use `$1, $2, ...` for parameterized queries
3. Update result handling to use `result.rows`

### 4. Create/Update Route Files

1. Create or update `/routes/reviews.ts`
2. Create or update `/routes/content.ts`
3. Create or update `/routes/inventory.ts`
4. Update `server.ts` to use these routes

### 5. Testing

1. Test all API endpoints with the PostgreSQL database
2. Verify CRUD operations for all resources
3. Check authentication and authorization flows

## Conclusion

By following these patterns and examples, you can complete the migration of the Color-Tech application from MySQL to PostgreSQL. The key is to be consistent in how you handle database queries and results, ensuring that all parts of the application are updated to use PostgreSQL syntax. 