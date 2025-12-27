import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/app/db/dbConnect';


export async function POST(req: NextRequest) {
    try {
      const conn = await dbConnect('Prod');
      const User = conn.model('UserDocument');
      const { users } = await req.json();
  
      if (!Array.isArray(users)) {
        return NextResponse.json(
          { message: 'Invalid payload' },
          { status: 400 }
        );
      }
  
      // Gather all user IDs from the payload.
      const payloadIds = users.map((user: any) => user._id);
  
      // Delete any users not included in the payload (i.e. removed from the grid).
      await User.deleteMany({ _id: { $nin: payloadIds } });
  
      // Update each user in the payload.
      const updatePromises = users.map(async (user: any) => {
        const { _id, ...updateData } = user;
        return await User.findByIdAndUpdate(_id, updateData, { new: true });
      });
  
      const updatedUsers = await Promise.all(updatePromises);
      return NextResponse.json({ updatedUsers });
    } catch (error: any) {
      console.error('Error updating users:', error);
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
  