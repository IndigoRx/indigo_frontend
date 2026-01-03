import React from 'react';
import { useSubscription } from './Subscriptioncontext';
import { AlertTriangle, Clock, CreditCard, X } from 'lucide-react';

interface SubscriptionBannerProps {
  onDismiss?: () => void;
  showDismiss?: boolean;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ 
  onDismiss, 
  showDismiss = false 
}) => {
  const { subscription, isTrialPeriod, daysRemaining, startCheckout, loading } = useSubscription();

  if (loading || !subscription) return null;

  // Don't show banner for active paid subscriptions with more than 30 days
  if (subscription.status === 'ACTIVE' && daysRemaining > 30) {
    return null;
  }

  // Determine banner type and styling
  let bannerConfig = {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    icon: <Clock className="w-5 h-5" />,
    title: '',
    message: '',
    showCTA: false,
    ctaText: 'Subscribe Now',
    urgency: 'info' as 'info' | 'warning' | 'danger',
  };

  if (subscription.trialExpired || subscription.status === 'EXPIRED') {
    bannerConfig = {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'Subscription Required',
      message: 'Your trial has expired. Subscribe now to continue using IndigoRx.',
      showCTA: true,
      ctaText: 'Subscribe Now - ₹6,000/year',
      urgency: 'danger',
    };
  } else if (isTrialPeriod && daysRemaining <= 7) {
    bannerConfig = {
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      icon: <Clock className="w-5 h-5" />,
      title: 'Trial Ending Soon',
      message: `Your free trial expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. Subscribe to continue uninterrupted access.`,
      showCTA: true,
      ctaText: 'Subscribe Now',
      urgency: 'warning',
    };
  } else if (isTrialPeriod && daysRemaining <= 14) {
    bannerConfig = {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: <Clock className="w-5 h-5" />,
      title: 'Free Trial',
      message: `${daysRemaining} days remaining in your free trial.`,
      showCTA: true,
      ctaText: 'View Plans',
      urgency: 'info',
    };
  } else if (subscription.status === 'PAST_DUE') {
    bannerConfig = {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Payment Failed',
      message: 'Your last payment failed. Please update your payment method to continue.',
      showCTA: true,
      ctaText: 'Update Payment',
      urgency: 'danger',
    };
  } else if (subscription.status === 'ACTIVE' && daysRemaining <= 30) {
    bannerConfig = {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: <Clock className="w-5 h-5" />,
      title: 'Renewal Coming Up',
      message: `Your subscription renews in ${daysRemaining} days.`,
      showCTA: false,
      ctaText: '',
      urgency: 'info',
    };
  } else {
    return null; // No banner needed
  }

  return (
    <div 
      className={`${bannerConfig.bgColor} ${bannerConfig.borderColor} border rounded-lg p-4 mb-4`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={bannerConfig.textColor}>
            {bannerConfig.icon}
          </div>
          <div>
            <h4 className={`font-semibold ${bannerConfig.textColor}`}>
              {bannerConfig.title}
            </h4>
            <p className={`text-sm mt-1 ${bannerConfig.textColor} opacity-90`}>
              {bannerConfig.message}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {bannerConfig.showCTA && (
            <button
              onClick={startCheckout}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${bannerConfig.urgency === 'danger' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : bannerConfig.urgency === 'warning'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              {bannerConfig.ctaText}
            </button>
          )}
          
          {showDismiss && onDismiss && (
            <button
              onClick={onDismiss}
              className={`p-1 rounded hover:bg-black/5 ${bannerConfig.textColor}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;