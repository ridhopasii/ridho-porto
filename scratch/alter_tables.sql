-- Alter Education table to match education.ts
ALTER TABLE public."Education" 
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS gpa text,
ADD COLUMN IF NOT EXISTS start_year integer,
ADD COLUMN IF NOT EXISTS end_year integer,
ADD COLUMN IF NOT EXISTS link text;

-- Alter Experience table to match carreers.ts
ALTER TABLE public."Experience"
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS location_type text,
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS start_date text,
ADD COLUMN IF NOT EXISTS end_date text,
ADD COLUMN IF NOT EXISTS industry text,
ADD COLUMN IF NOT EXISTS link text,
ADD COLUMN IF NOT EXISTS responsibilities jsonb,
ADD COLUMN IF NOT EXISTS lessons_learned jsonb,
ADD COLUMN IF NOT EXISTS impact jsonb;

-- Alter Skill table to match stacks.tsx
ALTER TABLE public."Skill"
ADD COLUMN IF NOT EXISTS background text,
ADD COLUMN IF NOT EXISTS color text,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Alter Social table to match socialMedia.tsx
ALTER TABLE public."Social"
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS text_color text,
ADD COLUMN IF NOT EXISTS background_color text,
ADD COLUMN IF NOT EXISTS border_color text,
ADD COLUMN IF NOT EXISTS background_gradient_color text,
ADD COLUMN IF NOT EXISTS col_span text,
ADD COLUMN IF NOT EXISTS is_show boolean DEFAULT true;
