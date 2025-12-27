'use client';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/app/components/Authentication/LoginForm';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated') {
      toast.success('You are logged in');
      router.push('/dashboard/getStoreData');
    }
  }, [status, router]);

  if (status === 'loading') {
    return null; 
  }

  return <LoginForm />;
}
