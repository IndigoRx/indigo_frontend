import { API_BASE_URL } from '@/app/api/config';

// Add these to your API_ENDPOINTS object in api.ts
export const SUBSCRIPTION_ENDPOINTS = {
  STATUS: `${API_BASE_URL}/api/subscription/status`,
  DETAILS: `${API_BASE_URL}/api/subscription/details`,
  CHECK_ACCESS: `${API_BASE_URL}/api/subscription/check-access`,
  CHECKOUT: `${API_BASE_URL}/api/subscription/checkout`,
  BILLING_PORTAL: `${API_BASE_URL}/api/subscription/billing-portal`,
  CANCEL: `${API_BASE_URL}/api/subscription/cancel`,
  PRICING: `${API_BASE_URL}/api/subscription/pricing`,
   START_TRIAL: `${API_BASE_URL}/api/subscription/start-trial`, 
  CHECKOUT_SUCCESS: (sessionId: string) => 
    `${API_BASE_URL}/api/subscription/checkout-success?session_id=${sessionId}`,
};

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  status: 'TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED' | 'PENDING' | null;
  plan: 'TRIAL' | 'YEARLY' | null;
  daysRemaining: number;
  isTrialPeriod: boolean;
  trialExpired: boolean;
  expiryDate: string | null;
  message: string;
}

export interface SubscriptionDetails {
  id: number;
  doctorId: number;
  doctorName: string;
  doctorEmail: string;
  status: string;
  plan: string;
  trialStartDate: string | null;
  trialEndDate: string | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  nextBillingDate: string | null;
  amountPaid: number | null;
  currency: string;
  isActive: boolean;
  daysRemaining: number;
  trialExpired: boolean;
  requiresPayment: boolean;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  checkoutUrl: string;
  publishableKey: string;
}

export interface PricingInfo {
  trialDays: number;
  yearlyPrice: number;
  currency: string;
  features: string[];
}

class SubscriptionService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
 async startTrial(): Promise<{ success: boolean; message: string; status: SubscriptionStatus }> {
    const response = await fetch(SUBSCRIPTION_ENDPOINTS.START_TRIAL, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const response = await fetch(SUBSCRIPTION_ENDPOINTS.STATUS, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<SubscriptionStatus>(response);
  }

  async getSubscriptionDetails(): Promise<SubscriptionDetails> {
    const response = await fetch(SUBSCRIPTION_ENDPOINTS.DETAILS, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<SubscriptionDetails>(response);
  }

  async checkAccess(): Promise<{
    hasAccess: boolean;
    status: string;
    isTrialPeriod: boolean;
    daysRemaining: number;
    message: string;
  }> {
    const response = await fetch(SUBSCRIPTION_ENDPOINTS.CHECK_ACCESS, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async createCheckoutSession(
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSessionResponse> {
    const response = await fetch(SUBSCRIPTION_ENDPOINTS.CHECKOUT, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ successUrl, cancelUrl }),
    });
    return this.handleResponse<CheckoutSessionResponse>(response);
  }

  async getBillingPortalUrl(returnUrl: string): Promise<{ portalUrl: string }> {
    const response = await fetch(SUBSCRIPTION_ENDPOINTS.BILLING_PORTAL, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ returnUrl }),
    });
    return this.handleResponse<{ portalUrl: string }>(response);
  }

  async cancelSubscription(reason: string, immediate: boolean = false): Promise<void> {
    const response = await fetch(SUBSCRIPTION_ENDPOINTS.CANCEL, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ reason, immediate }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to cancel subscription');
    }
  }

  async getPricing(): Promise<PricingInfo> {
    const response = await fetch(SUBSCRIPTION_ENDPOINTS.PRICING, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse<PricingInfo>(response);
  }

  async handleCheckoutSuccess(sessionId: string): Promise<any> {
    const response = await fetch(SUBSCRIPTION_ENDPOINTS.CHECKOUT_SUCCESS(sessionId), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;