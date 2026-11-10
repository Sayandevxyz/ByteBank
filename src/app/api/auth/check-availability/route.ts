import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';

const checkSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(8).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = checkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ emailTaken: false, phoneTaken: false });
    }

    const email = parsed.data.email?.trim().toLowerCase();
    const phone = parsed.data.phone?.trim();

    let emailTaken = false;
    let phoneTaken = false;

    if (email) {
      const emailRes = await query(
        `SELECT 1 FROM customer WHERE LOWER(email) = $1
         UNION ALL
         SELECT 1 FROM app_user WHERE LOWER(email) = $1
         LIMIT 1;`,
        [email]
      );
      emailTaken = emailRes.rows.length > 0;
    }

    if (phone) {
      const phoneRes = await query(
        `SELECT 1 FROM customer WHERE phone = $1 LIMIT 1;`,
        [phone]
      );
      phoneTaken = phoneRes.rows.length > 0;
    }

    return NextResponse.json({ emailTaken, phoneTaken });
  } catch {
    return NextResponse.json({ emailTaken: false, phoneTaken: false });
  }
}

