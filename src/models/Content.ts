import db from '../utils/db';
import logger from '../utils/logger';

interface Content {
  id: number;
  title: string;
  type: string; // 'blog', 'faq', 'gallery', 'page', etc.
  content: string;
  meta_description?: string;
  meta_keywords?: string;
  slug?: string;
  is_published: boolean;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
}

interface ContentInput {
  title: string;
  type: string;
  content: string;
  meta_description?: string;
  meta_keywords?: string;
  slug?: string;
  is_published?: boolean;
  created_by: number;
  updated_by: number;
}

class ContentModel {
  /**
   * Find all published content with pagination and optional type filtering
   */
  async findPublished(
    limit: number,
    offset: number,
    type?: string
  ): Promise<Content[]> {
    try {
      let query = `
        SELECT c.*, u.first_name || ' ' || u.last_name as author_name
        FROM content c
        JOIN users u ON c.created_by = u.id
        WHERE c.is_published = true
      `;
      
      const values: any[] = [];
      let paramIndex = 1;
      
      if (type) {
        query += ` AND c.type = $${paramIndex}`;
        values.push(type);
        paramIndex++;
      }
      
      query += `
        ORDER BY c.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      values.push(limit, offset);
      
      const { rows } = await db.query(query, values);
      return rows;
    } catch (error) {
      logger.error('Database error in ContentModel.findPublished:', error);
      throw error;
    }
  }

  /**
   * Count published content for pagination with optional type filtering
   */
  async countPublished(type?: string): Promise<number> {
    try {
      let query = "SELECT COUNT(*) FROM content WHERE is_published = true";
      const values: any[] = [];
      
      if (type) {
        query += " AND type = $1";
        values.push(type);
      }
      
      const { rows } = await db.query(query, values);
      return parseInt(rows[0].count);
    } catch (error) {
      logger.error('Database error in ContentModel.countPublished:', error);
      throw error;
    }
  }

  /**
   * Find content by type with pagination
   */
  async findByType(
    type: string,
    limit: number,
    offset: number,
    publishedOnly: boolean = true
  ): Promise<Content[]> {
    try {
      let query = `
        SELECT c.*, u.first_name || ' ' || u.last_name as author_name
        FROM content c
        JOIN users u ON c.created_by = u.id
        WHERE c.type = $1
      `;
      
      const values: any[] = [type];
      let paramIndex = 2;
      
      if (publishedOnly) {
        query += ` AND c.is_published = true`;
      }
      
      query += `
        ORDER BY c.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      values.push(limit, offset);
      
      const { rows } = await db.query(query, values);
      return rows;
    } catch (error) {
      logger.error(`Database error in ContentModel.findByType for type ${type}:`, error);
      throw error;
    }
  }

  /**
   * Count content by type for pagination
   */
  async countByType(type: string, publishedOnly: boolean = true): Promise<number> {
    try {
      let query = "SELECT COUNT(*) FROM content WHERE type = $1";
      const values: any[] = [type];
      
      if (publishedOnly) {
        query += " AND is_published = true";
      }
      
      const { rows } = await db.query(query, values);
      return parseInt(rows[0].count);
    } catch (error) {
      logger.error(`Database error in ContentModel.countByType for type ${type}:`, error);
      throw error;
    }
  }

  /**
   * Find content by ID
   */
  async findById(id: number): Promise<Content | null> {
    try {
      const query = `
        SELECT c.*, u.first_name || ' ' || u.last_name as author_name
        FROM content c
        JOIN users u ON c.created_by = u.id
        WHERE c.id = $1
      `;
      const { rows } = await db.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Database error in ContentModel.findById:', error);
      throw error;
    }
  }

  /**
   * Find content by slug
   */
  async findBySlug(slug: string): Promise<Content | null> {
    try {
      const query = `
        SELECT c.*, u.first_name || ' ' || u.last_name as author_name
        FROM content c
        JOIN users u ON c.created_by = u.id
        WHERE c.slug = $1
      `;
      const { rows } = await db.query(query, [slug]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Database error in ContentModel.findBySlug:', error);
      throw error;
    }
  }

  /**
   * Find all content with pagination and optional filtering (admin only)
   */
  async findAll(
    limit: number,
    offset: number,
    type?: string,
    isPublished?: boolean
  ): Promise<Content[]> {
    try {
      let query = `
        SELECT c.*, u.first_name || ' ' || u.last_name as author_name
        FROM content c
        JOIN users u ON c.created_by = u.id
        WHERE 1=1
      `;
      
      const values: any[] = [];
      let paramIndex = 1;
      
      if (type) {
        query += ` AND c.type = $${paramIndex}`;
        values.push(type);
        paramIndex++;
      }
      
      if (isPublished !== undefined) {
        query += ` AND c.is_published = $${paramIndex}`;
        values.push(isPublished);
        paramIndex++;
      }
      
      query += `
        ORDER BY c.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      values.push(limit, offset);
      
      const { rows } = await db.query(query, values);
      return rows;
    } catch (error) {
      logger.error('Database error in ContentModel.findAll:', error);
      throw error;
    }
  }

  /**
   * Count all content for pagination with optional filtering (admin only)
   */
  async countAll(type?: string, isPublished?: boolean): Promise<number> {
    try {
      let query = "SELECT COUNT(*) FROM content WHERE 1=1";
      const values: any[] = [];
      let paramIndex = 1;
      
      if (type) {
        query += ` AND type = $${paramIndex}`;
        values.push(type);
        paramIndex++;
      }
      
      if (isPublished !== undefined) {
        query += ` AND is_published = $${paramIndex}`;
        values.push(isPublished);
        paramIndex++;
      }
      
      const { rows } = await db.query(query, values);
      return parseInt(rows[0].count);
    } catch (error) {
      logger.error('Database error in ContentModel.countAll:', error);
      throw error;
    }
  }

  /**
   * Create new content
   */
  async create(contentData: ContentInput): Promise<Content> {
    try {
      const { 
        title, 
        type, 
        content, 
        meta_description, 
        meta_keywords, 
        slug, 
        is_published = false, 
        created_by, 
        updated_by 
      } = contentData;
      
      // Generate slug if not provided
      const finalSlug = slug || this.generateSlug(title);
      
      const query = `
        INSERT INTO content (
          title, type, content, meta_description, meta_keywords, slug, 
          is_published, created_by, updated_by, created_at, updated_at,
          published_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), 
          $10
        ) RETURNING *
      `;
      
      const publishedAt = is_published ? new Date() : null;
      
      const values = [
        title, type, content, meta_description, meta_keywords, finalSlug,
        is_published, created_by, updated_by, publishedAt
      ];
      
      const { rows } = await db.query(query, values);
      
      return rows[0];
    } catch (error) {
      logger.error('Database error in ContentModel.create:', error);
      throw error;
    }
  }

  /**
   * Update content
   */
  async update(id: number, contentData: Partial<ContentInput>): Promise<Content | null> {
    try {
      // First check if content exists
      const content = await this.findById(id);
      if (!content) {
        return null;
      }
      
      // Generate slug if title is updated but slug is not provided
      if (contentData.title && !contentData.slug) {
        contentData.slug = this.generateSlug(contentData.title);
      }
      
      // Build the SET clause dynamically based on provided fields
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      // Add each field that needs to be updated
      Object.entries(contentData).forEach(([key, value]) => {
        if (value !== undefined) {
          updates.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });
      
      // Update published_at if is_published is changing from false to true
      if (contentData.is_published === true && !content.is_published) {
        updates.push(`published_at = NOW()`);
      }
      
      // Add updated_at
      updates.push(`updated_at = NOW()`);
      
      // Add the ID as the last parameter
      values.push(id);
      
      const query = `
        UPDATE content
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      const { rows } = await db.query(query, values);
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Database error in ContentModel.update:', error);
      throw error;
    }
  }

  /**
   * Update content publish status
   */
  async updatePublishStatus(id: number, isPublished: boolean, updatedBy: number): Promise<Content | null> {
    try {
      const query = `
        UPDATE content
        SET 
          is_published = $1, 
          updated_by = $2, 
          updated_at = NOW(),
          published_at = $3
        WHERE id = $4
        RETURNING *
      `;
      
      const publishedAt = isPublished ? new Date() : null;
      
      const { rows } = await db.query(query, [isPublished, updatedBy, publishedAt, id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Database error in ContentModel.updatePublishStatus:', error);
      throw error;
    }
  }

  /**
   * Delete content
   */
  async delete(id: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM content WHERE id = $1 RETURNING id';
      const { rows } = await db.query(query, [id]);
      return rows.length > 0;
    } catch (error) {
      logger.error('Database error in ContentModel.delete:', error);
      throw error;
    }
  }

  /**
   * Find featured blog posts
   */
  async findFeaturedBlogPosts(limit: number = 3): Promise<Content[]> {
    try {
      const query = `
        SELECT c.*, u.first_name || ' ' || u.last_name as author_name
        FROM content c
        JOIN users u ON c.created_by = u.id
        WHERE c.type = 'blog' AND c.is_published = true
        ORDER BY c.published_at DESC
        LIMIT $1
      `;
      
      const { rows } = await db.query(query, [limit]);
      return rows;
    } catch (error) {
      logger.error('Database error in ContentModel.findFeaturedBlogPosts:', error);
      throw error;
    }
  }

  /**
   * Get FAQ categories
   */
  async getFaqCategories(): Promise<any[]> {
    try {
      const query = `
        SELECT DISTINCT jsonb_extract_path_text(content::jsonb, 'category') as category
        FROM content
        WHERE type = 'faq' AND is_published = true
        ORDER BY category
      `;
      
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      logger.error('Database error in ContentModel.getFaqCategories:', error);
      throw error;
    }
  }

  /**
   * Generate a URL-friendly slug from a title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
}

export default new ContentModel(); 