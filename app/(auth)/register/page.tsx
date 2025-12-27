'use client';
import React, { useEffect } from 'react';

import { useSession } from 'next-auth/react';
import RegisterForm from '@/app/components/Authentication/RegisterForm';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return;

  if (status === 'authenticated') {
    // If NOT the first render, show a toast
    
    toast.success('You are already logged in');
    
    // Always redirect if authenticated
    router.push('/dashboard/getStoreData');
    return null;
  }

  if (status === 'loading') {
    return null;
  }
  return (
    <p>
      <RegisterForm />
    </p>
  );
}
