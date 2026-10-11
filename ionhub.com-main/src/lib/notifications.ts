// ==============================================================================
// ION HUB - NOTIFICATION ARCHITECTURE
// ==============================================================================

export type NotificationEventType =
  | 'BOOKING_CONFIRMED'
  | 'PICKUP_SCHEDULED'
  | 'SERVICE_STARTED'
  | 'SERVICE_COMPLETED'
  | 'OUT_FOR_DELIVERY'
  | 'BOOKING_CANCELLED';

export interface NotificationPayload {
  userId: string;
  userPhone?: string;
  userEmail?: string;
  bookingReference: string;
  serviceName: string;
  timeSlot?: string;
  eventType: NotificationEventType;
}

export interface NotificationChannel {
  send(payload: NotificationPayload): Promise<{ delivered: boolean; channel: string }>;
}

export const notificationDispatcher = {
  async dispatch(payload: NotificationPayload) {
    // Check if external SMS / WhatsApp provider is configured
    const hasSmsConfigured = Boolean(process.env.SMS_PROVIDER_API_KEY);
    const hasWhatsAppBotConfigured = Boolean(process.env.WHATSAPP_BOT_API_KEY);

    const logEntry = {
      timestamp: new Date().toISOString(),
      event: payload.eventType,
      recipient: payload.userPhone || payload.userEmail,
      reference: payload.bookingReference,
      liveProviderConnected: hasSmsConfigured || hasWhatsAppBotConfigured,
    };

    console.log('[ION HUB Notification Event]', logEntry);

    return {
      logged: true,
      providerActive: hasSmsConfigured || hasWhatsAppBotConfigured,
    };
  },
};
