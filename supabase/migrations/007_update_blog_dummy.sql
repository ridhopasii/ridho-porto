-- Fix blog dummy data dates and identical thumbnails
UPDATE article 
SET "imageUrl" = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60', 
    "createdAt" = NOW() - INTERVAL '2 days' 
WHERE title ILIKE '%Karir%';

UPDATE article 
SET "imageUrl" = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60', 
    "createdAt" = NOW() - INTERVAL '1 week' 
WHERE title ILIKE '%Supabase%';

UPDATE article 
SET "imageUrl" = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60', 
    "createdAt" = NOW() - INTERVAL '3 weeks' 
WHERE title ILIKE '%Next.js%';
