
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runSeed() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/bytebank';
  console.log(`Connecting to PostgreSQL for seed checking...`);

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const isForce = process.argv.includes('--force');
    const custCountRes = await client.query(`SELECT count(*) FROM customer;`);
    const count = parseInt(custCountRes.rows[0].count, 10);

    if (count > 0 && !isForce) {
      console.log(`✓ Database already seeded (${count} customers found). Use --force to reload.`);
      const recRes = await client.query(`
        SELECT
          count(*) AS total_pairs,
          count(*) FILTER (WHERE matched) AS matched_pairs,
          count(*) FILTER (WHERE NOT matched) AS mismatched_pairs
        FROM v_reconciliation;
      `);
      const { total_pairs, matched_pairs, mismatched_pairs } = recRes.rows[0];
      console.log(`✓ Reconciliation Invariant: ${matched_pairs}/${total_pairs} pairs balanced (Mismatches: ${mismatched_pairs})`);
      return;
    }

    if (isForce) {
      console.log('Force reseed requested. Clearing operational data...');
      await client.query(`
        TRUNCATE notification, access_log, audit_log, asset_reservation, transfer_authorization,
                 risk_assessment_reason, risk_assessment, transfer_request, ledger_entry,
                 asset_transaction, holding, app_user, account, customer, staff, asset, risk_rule,
                 reconciliation_issue, reconciliation_run CASCADE;
      `);
    }

    const seedFile = path.join(__dirname, '..', 'seed', '001_seed_master.sql');
    console.log(`Loading master seed file: ${seedFile}...`);
    const sql = fs.readFileSync(seedFile, 'utf8');

    await client.query(sql);
    console.log('✓ Master seed dataset loaded successfully.');

    const recRes = await client.query(`
      SELECT
        count(*) AS total_pairs,
        count(*) FILTER (WHERE matched) AS matched_pairs,
        count(*) FILTER (WHERE NOT matched) AS mismatched_pairs
      FROM v_reconciliation;
    `);
    const { total_pairs, matched_pairs, mismatched_pairs } = recRes.rows[0];
    console.log(`✓ Reconciliation Invariant: ${matched_pairs}/${total_pairs} pairs balanced (Mismatches: ${mismatched_pairs})`);

    const custRes = await client.query(`SELECT count(*) FROM customer;`);
    console.log(`✓ Customer Count: ${custRes.rows[0].count} customer master records active.`);

  } catch (err) {
    console.error('Seed execution failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeed();
