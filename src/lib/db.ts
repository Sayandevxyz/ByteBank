
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/bytebank';

declare global {

  var __bytebankPool: Pool | undefined;
}

export const pool: Pool = global.__bytebankPool || new Pool({
  connectionString,
  max: 25,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
});

if (process.env.NODE_ENV !== 'production') {
  global.__bytebankPool = pool;
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;

  return res;
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function withRole<T>(
  role: 'CUSTOMER' | 'ADMIN' | 'AUDITOR',
  actorId: string | number,
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (role === 'CUSTOMER') {
      await client.query(`SET LOCAL ROLE bytebank_customer;`);
      await client.query(`SET LOCAL bytebank.current_customer_id = $1;`, [String(actorId)]);
      await client.query(`SET LOCAL bytebank.current_actor = $1;`, [`customer:${actorId}`]);
    } else if (role === 'ADMIN') {
      await client.query(`SET LOCAL ROLE bytebank_admin;`);
      await client.query(`SET LOCAL bytebank.current_actor = $1;`, [`staff:${actorId}`]);
    } else if (role === 'AUDITOR') {
      await client.query(`SET LOCAL ROLE bytebank_auditor;`);
      await client.query(`SET LOCAL bytebank.current_actor = $1;`, [`auditor:${actorId}`]);
    }

    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function recordAutonomousFailure(
  senderAccount: number | null,
  receiverAccount: number,
  assetId: number,
  quantity: number | string,
  failureReason: string,
  actor: string = 'system'
): Promise<number | null> {
  try {
    const res = await pool.query(
      `INSERT INTO asset_transaction (sender_account, receiver_account, asset_id, quantity, type, status, failure_reason)
       VALUES ($1, $2, $3, $4, 'transfer', 'failed', $5)
       RETURNING transaction_id;`,
      [senderAccount, receiverAccount, assetId, quantity, failureReason]
    );

    const txnId = res.rows[0]?.transaction_id;

    await pool.query(
      `INSERT INTO audit_log (actor, action, resource, new_value)
       VALUES ($1, 'TRANSFER_REJECTED', $2, jsonb_build_object(
         'sender', $3,
         'receiver', $4,
         'asset_id', $5,
         'quantity', $6,
         'failure_reason', $7
       ));`,
      [actor, `transaction:${txnId || 'failed'}`, senderAccount, receiverAccount, assetId, quantity, failureReason]
    );

    return txnId;
  } catch (err) {
    console.error('Failed to write autonomous failure audit trail:', err);
    return null;
  }
}
