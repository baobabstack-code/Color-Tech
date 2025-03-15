-- Drop existing reviews table if it exists
DROP TABLE IF EXISTS reviews;

-- Create updated reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add updated_at trigger to reviews table
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add some sample reviews for testing
INSERT INTO reviews (user_id, service_id, rating, comment, status)
SELECT 
    u.id, 
    s.id, 
    5, 
    'Great service! My car looks brand new again.', 
    'approved'
FROM 
    users u 
    CROSS JOIN services s 
WHERE 
    u.role = 'client' 
    AND s.name LIKE '%Paint%'
LIMIT 1;

INSERT INTO reviews (user_id, service_id, rating, comment, status)
SELECT 
    u.id, 
    s.id, 
    4, 
    'Very professional team. Would recommend to friends.', 
    'approved'
FROM 
    users u 
    CROSS JOIN services s 
WHERE 
    u.role = 'client' 
    AND s.name LIKE '%Detail%'
LIMIT 1;

INSERT INTO reviews (user_id, service_id, rating, comment, status)
SELECT 
    u.id, 
    s.id, 
    5, 
    'Excellent work on my car''s paint correction. The finish is flawless!', 
    'pending'
FROM 
    users u 
    CROSS JOIN services s 
WHERE 
    u.role = 'client' 
    AND s.name LIKE '%Correction%'
LIMIT 1; 