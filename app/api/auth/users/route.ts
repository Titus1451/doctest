
import User from '@/app/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/app/db/dbConnect';

export async function GET(req: NextRequest) {
  const username = 'test1';
  const url = new URL(req.url);
  const companyName = url.searchParams.get('companyName');
  const productGroupName = url.searchParams.get('productGroupName');
  const productMapGroupName = url.searchParams.get('productMapGroupName');
  const productCategory = url.searchParams.get('productCategory');

  try {
    const conn = await dbConnect('Prod');
    const User = conn.model('UserDocument');

    const user = await User.findOne({ username: username as string });
    //console.log('User:', user);
    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
        },
        {
          status: 404,
        },
      );
    }
    return NextResponse.json(
      {
        message: 'User found',
      },
      {
        status: 200,
      },
    );
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

export async function POST(req: Request) {
  const data = await req.json();
  //console.log(data);
  const { username, email, password, role } = data;

  try {
    const conn = await dbConnect('Prod');
    const User = conn.model('UserDocument');

    const newUser = new User({ username, email, password, role });
    await newUser.save();

    return NextResponse.json(
      {
        message: 'User created',
        user: newUser,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
      },
      {
        status: 500,
      },
    );
  } /*finally {
    mongoose.connection.close();
  }*/
}
