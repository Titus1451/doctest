
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/app/db/dbConnect';


export async function POST(req: Request) {
  try {
    //await connectDB2();
    
    const conn = await dbConnect('Prod');
    const User = conn.model('UserDocument');
    const { email } = await req.json();
    const user = await User.findOne({ email }).select('_id');
    //console.log('user:', user);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error finding user:', error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
      },
      {
        status: 500,
      },
    );
  }
}
