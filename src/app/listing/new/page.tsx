'use client';

import { useState } from 'react';
import ListingWizard from '@/components/ListingWizard';
import { useRouter } from 'next/navigation';

export default function NewListingPage() {
  const router = useRouter();
  const [show, setShow] = useState(true);

  if (!show) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-obsidian">
      <ListingWizard
        onClose={() => setShow(false)}
        onSuccess={() => setShow(false)}
      />
    </div>
  );
}
