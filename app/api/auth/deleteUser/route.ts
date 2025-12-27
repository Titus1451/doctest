import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/app/db/dbConnect';

//API to delete a user

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const conn = await dbConnect('Prod');
    const User = conn.model('UserDocument');
    const deletedUser = await User.findByIdAndDelete(userId);
    return NextResponse.json({ success: true, deletedUser });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
