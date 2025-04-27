import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'loan_manager',
  password: 'postgres',
  port: 5432,
});

async function testDatabase() {
  try {
    // Test connection
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0].now);

    // Test getting all loans
    console.log('\nTesting getLoans...');
    const loans = await pool.query('SELECT * FROM loans');
    console.log(`Found ${loans.rows.length} loans`);
    console.log('Sample loan:', loans.rows[0]);

    // Test getting payments for a loan
    console.log('\nTesting getPayments...');
    const payments = await pool.query('SELECT * FROM payments WHERE loan_id = 1 LIMIT 5');
    console.log(`Found ${payments.rows.length} payments for loan 1`);
    console.log('Sample payments:', payments.rows);

    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error during database testing:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the tests
testDatabase(); 