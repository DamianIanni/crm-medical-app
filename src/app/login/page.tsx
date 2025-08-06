"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { EntityForm } from '@/components/forms/entityForm';

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/centers';

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(from);
    }
  }, [isAuthenticated, from, router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <EntityForm formType="auth" />
      </div>
    </div>
  );
}
