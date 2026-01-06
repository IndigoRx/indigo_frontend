'use client';
import React, { useEffect, useState,Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSubscription } from './Subscriptioncontext';
import subscriptionService, { SubscriptionDetails, PricingInfo } from './Subscriptionservice';
import { 
  Check, 
  Clock, 
  CreditCard, 
  Calendar,
  Shield,
  Headphones,
  Loader2,
  AlertCircle,
  Star,
  Building2,
  Zap,
  Phone,
  CheckCircle
} from 'lucide-react';
import { API_ENDPOINTS } from '@/app/api/config';

type PlanType = 'trial' | 'pro' | 'enterprise';

const Subscriptionpagecontent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { 
    subscription, 
    loading, 
    error, 
    hasAccess, 
    isTrialPeriod, 
    daysRemaining,
    startCheckout,
    openBillingPortal,
    refreshSubscription
  } = useSubscription();

  const [details, setDetails] = useState<SubscriptionDetails | null>(null);
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Handle Stripe checkout success redirect
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success');
    
    if (sessionId || success === 'true') {
      setSuccessMessage('Payment successful! Thank you for subscribing to IndigoRx.');
      // Refresh subscription data
      refreshSubscription();
      loadData();
      
      // Redirect to dashboard after showing success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
    
    // Handle cancelled checkout
    const cancelled = searchParams.get('cancelled');
    if (cancelled === 'true') {
      setLocalError('Checkout was cancelled. You can try again when ready.');
    }

    // Handle expired subscription redirect
    const reason = searchParams.get('reason');
    if (reason === 'expired') {
      setLocalError('Your subscription has expired. Please subscribe to continue creating prescriptions.');
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingDetails(true);
    try {
      const [detailsData, pricingData] = await Promise.all([
        subscriptionService.getSubscriptionDetails(),
        subscriptionService.getPricing()
      ]);
      setDetails(detailsData);
      setPricing(pricingData);
    } catch (err) {
      console.error('Error loading subscription data:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

 const handleStartTrial = async () => {
  setTrialLoading(true);
  setLocalError(null);
  setSuccessMessage(null);

  try {
    const data = await subscriptionService.startTrial();
    
    setSuccessMessage(data.message || 'Your 3-month free trial has started!');
    
    await refreshSubscription();
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);

  } catch (err: any) {
    console.error('Error starting trial:', err);
    setLocalError(err.message || 'Failed to start trial. Please try again.');
    setTrialLoading(false);
  }
};

  const handleSubscribe = async (plan: PlanType) => {
    if (plan === 'enterprise') {
      window.location.href = 'mailto:info@indigorx.me?subject=Enterprise Plan Inquiry';
      return;
    }
    
    if (plan === 'trial') {
      await handleStartTrial();
      return;
    }

    setCheckoutLoading(true);
    setLocalError(null);
    try {
      await startCheckout();
      // Note: startCheckout will redirect to Stripe, so we don't need to do anything else here
    } catch (err: any) {
      console.error('Error starting checkout:', err);
      setLocalError(err.message || 'Failed to start checkout. Please try again.');
      setCheckoutLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      await openBillingPortal();
    } catch (err) {
      console.error('Error opening billing portal:', err);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading || loadingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading subscription details...</span>
        </div>
      </div>
    );
  }

  // Determine status display
  const getStatusDisplay = () => {
    if (!subscription) {
      return { text: 'No Active Plan', className: 'bg-gray-100 text-gray-800' };
    }
    switch (subscription.status) {
      case 'ACTIVE':
        return { text: 'Active', className: 'bg-green-100 text-green-800' };
      case 'TRIAL':
        return { text: 'Free Trial', className: 'bg-blue-100 text-blue-800' };
      case 'PAST_DUE':
        return { text: 'Past Due', className: 'bg-amber-100 text-amber-800' };
      case 'EXPIRED':
        return { text: 'Expired', className: 'bg-red-100 text-red-800' };
      default:
        return { text: subscription.status || 'Unknown', className: 'bg-gray-100 text-gray-800' };
    }
  };

  const statusDisplay = getStatusDisplay();

  // Check if trial has already been used
  const hasUsedTrial = subscription?.status === 'TRIAL' || 
                       subscription?.status === 'ACTIVE' || 
                       subscription?.status === 'EXPIRED' ||
                       details?.trialStartDate !== null;

  const plans = [
    {
      id: 'trial' as PlanType,
      name: 'Free Trial',
      price: '₹0',
      period: '3 months',
      description: 'Perfect to get started and explore all features',
      features: [
        'Full access for 3 months',
        'Up to 100 prescriptions',
        'Patient management',
        'Digital signatures',
        'PDF reports',
        'Email support'
      ],
      icon: <Clock className="w-6 h-6" />,
      buttonText: 'Start Free Trial',
      buttonStyle: 'bg-gray-900 hover:bg-gray-800 text-white',
      cardStyle: 'border-gray-200 bg-white',
      badge: null,
      disabled: hasUsedTrial
    },
    {
      id: 'pro' as PlanType,
      name: 'Pro Annual',
      price: '₹6,000',
      period: '/year',
      description: 'Everything you need to manage your practice',
      features: [
        'Unlimited prescriptions',
        'Unlimited patients',
        'Digital signatures',
        'PDF reports & exports',
        'Email notifications',
        'Priority support',
        'Data backup & security',
        'Analytics dashboard'
      ],
      icon: <Star className="w-6 h-6" />,
      buttonText: 'Subscribe Now',
      buttonStyle: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      cardStyle: 'border-emerald-500 border-2 bg-white shadow-lg shadow-emerald-100',
      badge: 'Most Popular',
      disabled: subscription?.status === 'ACTIVE'
    },
    {
      id: 'enterprise' as PlanType,
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For clinics and healthcare organizations',
      features: [
        'Everything in Pro',
        'Multiple doctor accounts',
        'Clinic-wide dashboard',
        'Custom branding',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'On-premise deployment option'
      ],
      icon: <Building2 className="w-6 h-6" />,
      buttonText: 'Contact Sales',
      buttonStyle: 'bg-gray-900 hover:bg-gray-800 text-white',
      cardStyle: 'border-gray-200 bg-white',
      badge: null,
      disabled: false
    }
  ];

  // Get disabled button text
  const getDisabledButtonText = (plan: typeof plans[0]) => {
    if (plan.id === 'trial') {
      if (subscription?.status === 'TRIAL') return 'Currently on Trial';
      if (subscription?.status === 'ACTIVE') return 'Already Subscribed';
      if (hasUsedTrial) return 'Trial Already Used';
    }
    if (plan.id === 'pro' && subscription?.status === 'ACTIVE') {
      return 'Current Plan';
    }
    return plan.buttonText;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start with a free trial or choose the plan that best fits your practice needs
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3 max-w-2xl mx-auto">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-green-800">{successMessage}</span>
              <p className="text-green-600 text-sm mt-1">Redirecting to dashboard...</p>
            </div>
            <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
          </div>
        )}

        {/* Error Messages */}
        {(error || localError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3 max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800">{localError || error}</span>
          </div>
        )}

        {/* Current Status Banner - Show if user has active subscription */}
        {subscription?.status === 'ACTIVE' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    You're on the Pro Annual Plan
                  </h2>
                </div>
                <p className="text-gray-600 text-sm">
                  {details?.subscriptionEndDate && (
                    <>Your subscription renews on {formatDate(details.subscriptionEndDate)}</>
                  )}
                </p>
              </div>
              <button
                onClick={handleManageBilling}
                className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
              >
                Manage Billing
              </button>
            </div>
          </div>
        )}

        {/* Expired Status Banner */}
        {subscription?.status === 'EXPIRED' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-gray-900">Your Trial Has Expired</h3>
            </div>
            <p className="text-sm text-gray-600">
              Subscribe to Pro Annual to continue creating prescriptions and managing your practice.
            </p>
          </div>
        )}

        {/* Trial Status Banner */}
        {isTrialPeriod && daysRemaining > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Trial in Progress</h3>
              <span className="ml-auto text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                {daysRemaining} days left
              </span>
            </div>
            <div className="h-2 bg-blue-200 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                style={{ width: `${((90 - daysRemaining) / 90) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Subscribe to Pro Annual to ensure uninterrupted access after your trial ends.
            </p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => !plan.disabled && setSelectedPlan(plan.id)}
              className={`
                relative rounded-2xl border p-6 transition-all cursor-pointer
                ${plan.cardStyle}
                ${selectedPlan === plan.id ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}
                ${plan.disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'}
              `}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6 pt-2">
                <div className={`
                  inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4
                  ${plan.id === 'pro' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}
                `}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      plan.id === 'pro' ? 'text-emerald-600' : 'text-gray-400'
                    }`} />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe(plan.id);
                }}
                disabled={plan.disabled || (checkoutLoading && selectedPlan === plan.id) || (trialLoading && plan.id === 'trial')}
                className={`
                  w-full py-3 px-4 font-medium rounded-xl transition-all
                  flex items-center justify-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${plan.buttonStyle}
                `}
              >
                {(checkoutLoading && selectedPlan === plan.id && plan.id === 'pro') || (trialLoading && plan.id === 'trial') ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : plan.disabled ? (
                  getDisabledButtonText(plan)
                ) : (
                  <>
                    {plan.id === 'pro' && <CreditCard className="w-5 h-5" />}
                    {plan.id === 'enterprise' && <Phone className="w-5 h-5" />}
                    {plan.id === 'trial' && <Zap className="w-5 h-5" />}
                    {plan.buttonText}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure payments via Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="font-medium text-gray-900 mb-2">
                What happens when my trial ends?
              </h4>
              <p className="text-sm text-gray-600">
                After your 3-month free trial, you'll need to subscribe to continue 
                creating prescriptions. Your data will be preserved.
              </p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="font-medium text-gray-900 mb-2">
                Can I cancel my subscription?
              </h4>
              <p className="text-sm text-gray-600">
                Yes, you can cancel anytime. You'll continue to have access until 
                the end of your billing period.
              </p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="font-medium text-gray-900 mb-2">
                What payment methods are accepted?
              </h4>
              <p className="text-sm text-gray-600">
                We accept all major credit/debit cards, UPI, and net banking 
                through Stripe.
              </p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="font-medium text-gray-900 mb-2">
                Is my data secure?
              </h4>
              <p className="text-sm text-gray-600">
                Yes, we use industry-standard encryption and comply with healthcare 
                data protection regulations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Subscriptionpagecontent };