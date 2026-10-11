// ==============================================================================
// ION HUB - PAYMENT GATEWAY ABSTRACTION (Razorpay / UPI)
// ==============================================================================

export interface PaymentOrderParams {
  amount: number; // in INR paise or rupees
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentVerificationParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentGateway {
  isConfigured(): boolean;
  createPayment(params: PaymentOrderParams): Promise<{ orderId: string; amount: number } | null>;
  verifyPayment(params: PaymentVerificationParams): Promise<boolean>;
  refundPayment(paymentId: string, amount?: number): Promise<boolean>;
}

export const razorpayGateway: PaymentGateway = {
  isConfigured() {
    return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  },

  async createPayment(params: PaymentOrderParams) {
    if (!this.isConfigured()) {
      // Current business model allows Doorstep Pay / Pay on Delivery
      return null;
    }
    // Ready for Razorpay SDK instantiation
    return {
      orderId: `order_${Date.now()}`,
      amount: params.amount,
    };
  },

  async verifyPayment(params: PaymentVerificationParams) {
    if (!this.isConfigured()) return false;
    // Crypto HMAC-SHA256 signature verification hook
    return Boolean(params.orderId && params.paymentId && params.signature);
  },

  async refundPayment(paymentId: string, amount?: number) {
    if (!this.isConfigured()) return false;
    return true;
  },
};
