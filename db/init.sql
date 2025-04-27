-- Create tables
CREATE TABLE IF NOT EXISTS loans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    term INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    borrower_name VARCHAR(255) NOT NULL,
    borrower_email VARCHAR(255) NOT NULL,
    description TEXT,
    credit_score INTEGER,
    collateral DECIMAL(15,2),
    risk_score INTEGER NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    loan_id INTEGER REFERENCES loans(id),
    amount DECIMAL(15,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status VARCHAR(20) NOT NULL,
    payment_number INTEGER NOT NULL,
    principal DECIMAL(15,2) NOT NULL,
    interest DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO loans (name, amount, interest_rate, term, start_date, end_date, status, borrower_name, borrower_email, description, credit_score, collateral, risk_score, risk_level) VALUES
('Home Mortgage', 250000.00, 4.50, 360, '2023-01-15', '2053-01-15', 'active', 'John Smith', 'john.smith@example.com', '30-year fixed rate mortgage for primary residence', 780, 300000.00, 25, 'low'),
('Auto Loan', 35000.00, 3.20, 60, '2023-02-01', '2028-02-01', 'active', 'Sarah Johnson', 'sarah.j@example.com', 'New vehicle financing', 750, 40000.00, 35, 'low'),
('Business Expansion', 150000.00, 6.75, 120, '2022-11-01', '2032-11-01', 'active', 'Acme Corporation', 'finance@acmecorp.com', 'Funding for new equipment and facility expansion', 680, 100000.00, 55, 'medium'),
('Personal Loan', 15000.00, 8.50, 36, '2023-03-15', '2026-03-15', 'pending', 'Michael Chen', 'm.chen@example.com', 'Debt consolidation', 620, 0.00, 70, 'high'),
('Student Loan Refinance', 45000.00, 5.25, 120, '2022-09-01', '2032-09-01', 'active', 'Emily Rodriguez', 'e.rodriguez@example.com', 'Consolidation of federal and private student loans', 710, 0.00, 40, 'medium'),
('Small Business Startup', 75000.00, 9.50, 84, '2023-04-01', '2030-04-01', 'active', 'Tech Innovators LLC', 'finance@techinnovators.com', 'Initial funding for tech startup', 650, 25000.00, 85, 'very-high'),
('Home Renovation', 50000.00, 5.75, 60, '2023-05-15', '2028-05-15', 'active', 'David Wilson', 'd.wilson@example.com', 'Kitchen and bathroom remodeling', 760, 250000.00, 30, 'low'),
('Commercial Property', 500000.00, 5.25, 240, '2022-12-01', '2042-12-01', 'active', 'Retail Solutions Inc', 'property@retailsolutions.com', 'Purchase of retail space in downtown area', 720, 650000.00, 45, 'medium');

-- Generate sample payments for each loan
DO $$
DECLARE
    loan_record RECORD;
    payment_date DATE;
    payment_amount DECIMAL(15,2);
    principal_amount DECIMAL(15,2);
    interest_amount DECIMAL(15,2);
    payment_number INTEGER;
BEGIN
    FOR loan_record IN SELECT * FROM loans LOOP
        payment_date := loan_record.start_date;
        payment_number := 1;
        
        WHILE payment_date <= loan_record.end_date LOOP
            -- Calculate payment amounts (simplified calculation)
            payment_amount := (loan_record.amount * (loan_record.interest_rate / 100 / 12)) / 
                            (1 - POWER(1 + (loan_record.interest_rate / 100 / 12), -loan_record.term));
            principal_amount := payment_amount * 0.7; -- Simplified principal calculation
            interest_amount := payment_amount - principal_amount;
            
            INSERT INTO payments (
                loan_id, amount, due_date, status, payment_number,
                principal, interest
            ) VALUES (
                loan_record.id,
                payment_amount,
                payment_date,
                CASE 
                    WHEN payment_date < CURRENT_DATE THEN 'paid'
                    WHEN payment_date = CURRENT_DATE THEN 'pending'
                    ELSE 'pending'
                END,
                payment_number,
                principal_amount,
                interest_amount
            );
            
            payment_date := payment_date + INTERVAL '1 month';
            payment_number := payment_number + 1;
        END LOOP;
    END LOOP;
END $$; 