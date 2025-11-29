-- Mumbai Hacks Healthcare Claims System - Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS claim_events CASCADE;
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;

-- Hospitals table
CREATE TABLE hospitals (
    id SERIAL PRIMARY KEY,
    hospital_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claims table
CREATE TABLE claims (
    id SERIAL PRIMARY KEY,
    claim_id VARCHAR(50) UNIQUE NOT NULL,
    hospital_id VARCHAR(50) NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_id VARCHAR(100),
    diagnosis TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'Submitted',
    fraud_score INTEGER,
    ipfs_hash VARCHAR(100),
    tx_hash VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id) ON DELETE CASCADE
);

-- Claim events table (audit trail)
CREATE TABLE claim_events (
    id SERIAL PRIMARY KEY,
    claim_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (claim_id) REFERENCES claims(claim_id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_claims_claim_id ON claims(claim_id);
CREATE INDEX idx_claims_hospital_id ON claims(hospital_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_created_at ON claims(created_at);
CREATE INDEX idx_claim_events_claim_id ON claim_events(claim_id);

-- Insert sample hospital data
INSERT INTO hospitals (hospital_id, name, address) VALUES
    ('APOLLO-DEL-001', 'Apollo Hospital Delhi', 'New Delhi, India'),
    ('APOLLO-MUM-001', 'Apollo Hospital Mumbai', 'Mumbai, India'),
    ('MAX-DEL-001', 'Max Hospital Delhi', 'New Delhi, India');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for claim statistics
CREATE VIEW claim_statistics AS
SELECT 
    status,
    COUNT(*) as count,
    AVG(amount) as avg_amount,
    SUM(amount) as total_amount,
    AVG(fraud_score) as avg_fraud_score
FROM claims
GROUP BY status;

COMMENT ON TABLE claims IS 'Stores all insurance claim submissions';
COMMENT ON TABLE hospitals IS 'Registered hospitals in the system';
COMMENT ON TABLE claim_events IS 'Audit trail for all claim-related events';
