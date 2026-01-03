'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import subscriptionService, { SubscriptionStatus } from './Subscriptionservice';

interface SubscriptionContextType {
  subscription: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  hasAccess: boolean;
  isTrialPeriod: boolean;
  daysRemaining: number;
  refreshSubscription: () => Promise<void>;
  startCheckout: () => Promise<void>;
  openBillingPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await subscriptionService.getSubscriptionStatus();
      setSubscription(status);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load subscription status');
      console.error('Error loading subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const startCheckout = async () => {
    try {
      const successUrl = `${window.location.origin}/subscription/success`;
      const cancelUrl = `${window.location.origin}/subscription`;
      
      const { checkoutUrl } = await subscriptionService.createCheckoutSession(
        successUrl,
        cancelUrl
      );
      
      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start checkout');
      throw err;
    }
  };

  const openBillingPortal = async () => {
    try {
      const returnUrl = `${window.location.origin}/subscription`;
      const { portalUrl } = await subscriptionService.getBillingPortalUrl(returnUrl);
      window.location.href = portalUrl;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to open billing portal');
      throw err;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshSubscription();
    } else {
      setLoading(false);
    }
  }, []);

  const hasAccess = subscription?.hasActiveSubscription ?? false;
  const isTrialPeriod = subscription?.isTrialPeriod ?? false;
  const daysRemaining = subscription?.daysRemaining ?? 0;

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        error,
        hasAccess,
        isTrialPeriod,
        daysRemaining,
        refreshSubscription,
        startCheckout,
        openBillingPortal,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;