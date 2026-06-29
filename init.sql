-- Table for Quote Information
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    quote_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    premium_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Issued Policies
CREATE TABLE IF NOT EXISTS policies (
    id SERIAL PRIMARY KEY,
    quote_id INTEGER REFERENCES quotes(id),
    policy_number VARCHAR(20) UNIQUE NOT NULL,
    effective_date DATE NOT NULL,
    receipt_id VARCHAR(50),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Vehicles (MTA - Mid Term Adjustments)
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    policy_id INTEGER REFERENCES policies(id),
    registration_number VARCHAR(20) NOT NULL,
    action_type VARCHAR(10), -- 'Added' or 'Removed'
    effective_from DATE,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some dummy data for testing
INSERT INTO quotes (quote_number, customer_name, premium_amount) VALUES ('Q-8829', 'John Doe', 1250.00);
