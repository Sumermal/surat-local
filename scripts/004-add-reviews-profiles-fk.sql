-- Add foreign key relationship from reviews to profiles
-- This allows Supabase to use the embedded syntax for joining reviews with profiles

ALTER TABLE reviews
ADD CONSTRAINT reviews_user_id_profiles_fk
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Also add FK for suggested_edits to profiles
ALTER TABLE suggested_edits
ADD CONSTRAINT suggested_edits_user_id_profiles_fk
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Also add FK for user_submissions to profiles
ALTER TABLE user_submissions
ADD CONSTRAINT user_submissions_user_id_profiles_fk
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Also add FK for favorites to profiles
ALTER TABLE favorites
ADD CONSTRAINT favorites_user_id_profiles_fk
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
