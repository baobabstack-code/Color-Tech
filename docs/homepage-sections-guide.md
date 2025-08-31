# Homepage Sections Management Guide

## Overview
The Homepage Sections Management system allows you to dynamically update content for different sections of your homepage through the admin dashboard, without needing to modify code.

## Features
- ✅ **Dynamic Content**: Update titles, subtitles, and descriptions
- ✅ **Admin Dashboard**: Easy-to-use interface
- ✅ **Real-time Updates**: Changes appear immediately on the homepage
- ✅ **Fallback Content**: Default content if database is empty
- ✅ **Multiple Sections**: Manage various homepage sections

## How to Access

### Method 1: Admin Content Dashboard
1. Go to `/admin/content`
2. Click on "Homepage Sections" card

### Method 2: Admin Sidebar
1. Navigate to any admin page
2. In the sidebar, expand "Content"
3. Click "Homepage Sections"

### Method 3: Direct URL
- Go directly to `/admin/content/homepage`

## Available Sections

The system comes with these predefined sections:

| Section Key | Default Title | Purpose |
|-------------|---------------|---------|
| `transformation_gallery` | Transformation Gallery | Before/after showcase section |
| `why_choose_us` | Why Choose Us | Features and benefits section |
| `our_services` | Our Services | Services overview section |
| `our_process` | Our Process | Step-by-step process section |
| `testimonials` | What Our Customers Say | Customer testimonials section |
| `blog_section` | From Our Blog | Latest blog posts section |

## Managing Sections

### Creating a New Section
1. Click "Add Section" button
2. Select a section key from the dropdown
3. Fill in the title (required)
4. Optionally add subtitle and description
5. Toggle "Active" if you want it to appear immediately
6. Click "Create Section"

### Editing an Existing Section
1. Find the section you want to edit
2. Click the edit button (pencil icon)
3. Modify the fields as needed
4. Click "Update Section"

### Deleting a Section
1. Find the section you want to delete
2. Click the delete button (trash icon)
3. Confirm the deletion

## Field Descriptions

### Section Key
- **Purpose**: Unique identifier for the section
- **Format**: lowercase_with_underscores
- **Note**: Cannot be changed after creation

### Title
- **Purpose**: Main heading for the section
- **Required**: Yes
- **Example**: "Transformation Gallery"

### Subtitle (Optional)
- **Purpose**: Secondary heading below the title
- **Example**: "Before & After Showcase"

### Description (Optional)
- **Purpose**: Explanatory text below the title/subtitle
- **Example**: "See the dramatic transformations we achieve through our expert repair and restoration work"

### Active Toggle
- **Purpose**: Controls whether the section content is used on the homepage
- **Default**: Active (enabled)

## Homepage Integration

The system automatically integrates with your homepage:

### Transformation Gallery Example
```jsx
// Before (hardcoded)
<h2>Transformation Gallery</h2>
<p>See the dramatic transformations we achieve...</p>

// After (dynamic)
<h2>{homepageSections.transformation_gallery?.title || "Transformation Gallery"}</h2>
{homepageSections.transformation_gallery?.subtitle && (
  <h3>{homepageSections.transformation_gallery.subtitle}</h3>
)}
<p>{homepageSections.transformation_gallery?.description || "Default description..."}</p>
```

## Technical Details

### Database Schema
```sql
CREATE TABLE homepage_sections (
  id SERIAL PRIMARY KEY,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints
- `GET /api/homepage-sections` - Public endpoint for frontend
- `GET /api/admin/homepage-sections` - Admin: List all sections
- `POST /api/admin/homepage-sections` - Admin: Create section
- `PUT /api/admin/homepage-sections/[id]` - Admin: Update section
- `DELETE /api/admin/homepage-sections/[id]` - Admin: Delete section

## Best Practices

### Content Guidelines
- **Titles**: Keep concise and descriptive (2-5 words)
- **Subtitles**: Optional, use for additional context
- **Descriptions**: 1-2 sentences explaining the section's purpose

### SEO Considerations
- Use relevant keywords in titles and descriptions
- Keep descriptions under 160 characters when possible
- Ensure content is engaging and informative

### Maintenance
- Regularly review and update content
- Test changes on a staging environment first
- Keep backup of important content changes

## Troubleshooting

### Section Not Appearing on Homepage
1. Check if the section is marked as "Active"
2. Verify the section key matches the one used in the code
3. Clear browser cache and refresh

### Database Connection Issues
- The system includes fallback content if database is unavailable
- Check your database connection in the environment variables

### Permission Issues
- Ensure you're logged in as an admin user
- Check that your user role has admin permissions

## Future Enhancements

Potential improvements that could be added:
- Rich text editor for descriptions
- Image upload for section backgrounds
- Section ordering/positioning
- Content versioning and rollback
- Multi-language support
- Content scheduling (publish at specific times)

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify database connectivity
3. Ensure proper admin permissions
4. Review the server logs for detailed error messages