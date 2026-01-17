-- Enable Row Level Security on all tables
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggested_edits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for areas
CREATE POLICY "Areas are viewable by everyone" ON areas
  FOR SELECT USING (true);

-- Public read access for categories
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Public read access for active listings
CREATE POLICY "Active listings are viewable by everyone" ON listings
  FOR SELECT USING (status = 'active');

-- Admin can manage all listings
CREATE POLICY "Admins can manage listings" ON listings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can manage their own favorites
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Reviews are viewable by everyone if approved
CREATE POLICY "Approved reviews are viewable" ON reviews
  FOR SELECT USING (is_approved = true);

-- Users can manage their own reviews
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can submit edits
CREATE POLICY "Users can submit edits" ON suggested_edits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own edits" ON suggested_edits
  FOR SELECT USING (auth.uid() = user_id);

-- Users can submit new places
CREATE POLICY "Users can submit places" ON user_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own submissions" ON user_submissions
  FOR SELECT USING (auth.uid() = user_id);
