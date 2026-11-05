const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres:password@localhost:5432/bytebank' });

async function check() {
  const schemaRes = await pool.query(
    "SELECT table_schema, table_name FROM information_schema.tables WHERE table_name IN ('customer', 'account', 'app_user', 'asset_transaction', 'ledger_entry')"
  );
  console.log('Tables found:', schemaRes.rows);

  const searchPath = await pool.query('SHOW search_path;');
  console.log('Default search_path:', searchPath.rows[0]);

  const roles = await pool.query("SELECT rolname, rolconfig FROM pg_roles WHERE rolname LIKE '%bytebank%'");
  console.log('Roles:', roles.rows);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SET LOCAL ROLE bytebank_customer');
    const roleSearchPath = await client.query('SHOW search_path;');
    console.log('bytebank_customer search_path:', roleSearchPath.rows[0]);
    
    try {
      const custRes = await client.query('SELECT count(*) FROM customer;');
      console.log('Customer count as bytebank_customer:', custRes.rows[0]);
    } catch (err) {
      console.error('Query customer as bytebank_customer failed:', err.message);
    }
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }

  process.exit(0);
}
check().catch(e => { console.error(e); process.exit(1); });
