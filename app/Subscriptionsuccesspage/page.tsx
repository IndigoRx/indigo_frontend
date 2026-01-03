import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSubscription } from '@/app/subscription/Subscriptioncontext';
import subscriptionService from '@/app/subscription/Subscriptionservice';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const SubscriptionSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshSubscription } = useSubscription();
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      handleSuccess(sessionId);
    } else {
      setError('No session ID found');
      setLoading(false);
    }
  }, [searchParams]);

  const handleSuccess = async (sessionId: string) => {
    try {
      await subscriptionService.handleCheckoutSuccess(sessionId);
      await refreshSubscription();
      setSuccess(true);
    } catch (err: any) {
      console.error('Error confirming subscription:', err);
      setError(err.response?.data?.error || 'Failed to confirm subscription');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Confirming your subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/subscription')}
              className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to IndigoRx Pro!
        </h1>
        <p className="text-gray-600 mb-6">
          Your subscription is now active. You have full access to all features.
        </p>
        
        <div className="bg-emerald-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-medium text-emerald-900 mb-2">What's included:</h3>
          <ul className="text-sm text-emerald-700 space-y-1">
            <li>✓ Unlimited prescriptions</li>
            <li>✓ Patient management</li>
            <li>✓ Digital signatures</li>
            <li>✓ PDF reports & exports</li>
            <li>✓ Email notifications</li>
            <li>✓ Priority support</li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
        >
          Go to Dashboard
        </button>
        
        <p className="text-sm text-gray-500 mt-4">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;