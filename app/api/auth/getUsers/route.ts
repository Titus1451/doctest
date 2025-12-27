import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/app/db/dbConnect';

export async function GET(req: NextRequest) {
  try {
    const conn = await dbConnect('Prod');
    const User = conn.model('UserDocument');
    // Fetch all users from MongoDB
    const users = await User.find();
    console.log('Users:', users);
    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

