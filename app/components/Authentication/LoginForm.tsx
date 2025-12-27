'use client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { set } from 'lodash';
import { toast } from 'sonner';
import UIButton from '@/app/components/common/components/Button';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        toast.error('Invalid credentials or awaiting approval');
        return;
      }

      toast.success('Logged in successfully');
      router.replace('dashboard');
    } catch (error) {
      //console.log(error);
    }
  };

  return (
    <div>
    <div
  style={{
    position: 'fixed', // Ensures it remains centered
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // Centers it precisely
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f5f5f5', // Optional: background color for the page
  }}
>
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '600px',
      backgroundColor: '#fff',
      padding: '20px', // Increased padding for better spacing
      borderRadius: '8px',
      boxShadow: '0px 0px 10px rgba(20, 115, 79, 0.2)',
    }}
  >
        <h1
            className="font-right-grotesk text-xl"
            style={{ marginBottom: '2px' }}
          >
            Login
          </h1>

        <form 
            onSubmit={handleSubmit} 
            style={{
              display: 'flex',
              padding: '20px',
              flexDirection: 'column',
              alignItems: 'center',
              width: '400px',
            }}>
                <style>
              {`
          input::placeholder {
            text-align: left;
            //color: #14734f;
          }
            
        `}
            </style>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="email"
            style={{
                width: '100%',
                padding: '5px',
                marginBottom: '5px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
              className=" outline-custom-green-above"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            style={{
                width: '100%',
                padding: '5px',
                marginBottom: '5px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
              className=" outline-custom-green-above"
          />
          <div className="text-md mt-2">
              <UIButton type="submit" text="Submit" />
            </div>
          <Link className="mt-3 text-right text-sm" href={'/register'}>
            Dont have an account?{' '}
            <span className="text-green-500 hover:underline">
              Create an account
            </span>
          </Link>
        </form>
      </div>
      </div>
    </div>
  );
};

export default LoginForm;
