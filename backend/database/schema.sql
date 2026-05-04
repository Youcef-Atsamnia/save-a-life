CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  blood_type VARCHAR(3) NOT NULL,
  city VARCHAR(120) NOT NULL,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  available BOOLEAN NOT NULL DEFAULT TRUE,
  preferred_language VARCHAR(5) NOT NULL DEFAULT 'en',
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_code VARCHAR(6),
  verification_expires_at TIMESTAMPTZ,
  donor_points INTEGER NOT NULL DEFAULT 0,
  reputation_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donation_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blood_type VARCHAR(3) NOT NULL,
  city VARCHAR(120) NOT NULL,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  urgency VARCHAR(10) NOT NULL CHECK (urgency IN ('low', 'medium', 'high')),
  status VARCHAR(10) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  donor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_id INTEGER NOT NULL REFERENCES donation_requests(id) ON DELETE CASCADE,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verified_facilities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN ('hospital', 'blood_bank')),
  city VARCHAR(120) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(40) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT TRUE,
  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(5) NOT NULL DEFAULT 'en';
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_expires_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS donor_points INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reputation_score INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_users_blood_type ON users (blood_type);
CREATE INDEX IF NOT EXISTS idx_users_city ON users (city);
CREATE INDEX IF NOT EXISTS idx_users_available ON users (available);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users (email_verified);
CREATE INDEX IF NOT EXISTS idx_requests_status ON donation_requests (status);
CREATE INDEX IF NOT EXISTS idx_requests_blood_type ON donation_requests (blood_type);
CREATE INDEX IF NOT EXISTS idx_requests_city ON donation_requests (city);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations (donor_id);
CREATE INDEX IF NOT EXISTS idx_facilities_city ON verified_facilities (city);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON verified_facilities (type);

INSERT INTO verified_facilities (name, type, city, address, phone, verified, latitude, longitude)
SELECT * FROM (
  VALUES
    ('Centre National de Transfusion Sanguine', 'blood_bank', 'Rabat', 'Avenue Allal El Fassi, Rabat', '+212-537-77-44-55', true, 34.020882, -6.841650),
    ('CHU Ibn Sina', 'hospital', 'Rabat', 'Avenue Allal El Fassi, Rabat', '+212-537-67-09-90', true, 34.009536, -6.847811),
    ('Centre Régional de Transfusion Sanguine Casablanca', 'blood_bank', 'Casablanca', 'Boulevard Abdelmoumen, Casablanca', '+212-522-47-48-49', true, 33.573981, -7.632127),
    ('CHU Ibn Rochd', 'hospital', 'Casablanca', 'Rue des Hôpitaux, Casablanca', '+212-522-48-20-20', true, 33.579216, -7.617240)
) AS seed(name, type, city, address, phone, verified, latitude, longitude)
WHERE NOT EXISTS (
  SELECT 1
  FROM verified_facilities existing
  WHERE existing.name = seed.name
);
