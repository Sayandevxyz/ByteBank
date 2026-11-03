
import { NextResponse } from 'next/server';
import { requireAuth, getUserById } from '@/lib/auth';
import { formatErrorResponse } from '@/lib/errors';

export async function GET() {
  try {
    const session = await requireAuth();
    const user = await getUserById(session.userId);

    if (!user) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'User record not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.full_name || user.staff_name,
        customerId: user.customer_id,
        staffId: user.staff_id,
        accountNo: user.account_no,
        accountId: user.account_id,
        accountStatus: user.account_status,
        kycStatus: user.kyc_status,
      },
    });
  } catch (err) {
    const { error, status } = formatErrorResponse(err);
    return NextResponse.json({ error }, { status });
  }
}
