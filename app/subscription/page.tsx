'use client';
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { Subscriptionpagecontent } from './Subscriptionpagecontent';

const SubscriptionPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    }>
      <Subscriptionpagecontent />
    </Suspense>
  );
};

export default SubscriptionPage;