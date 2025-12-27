import { dbConnect } from '@/app/db/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const data = await req.json();
  //console.log(data);
  const { firstName, lastName, email, password, role } = data;
  const salt = await bcrypt.genSalt(7);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const conn = await dbConnect('Prod');
    const User = conn.model('UserDocument');

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    return NextResponse.json(
      {
        message: 'User Registered Successfully',
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
        message: 'An error occurred while registering user',
      },
      {
        status: 500,
      },
    );
  }
}
