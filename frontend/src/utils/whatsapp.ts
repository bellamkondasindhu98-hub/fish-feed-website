import { formatPrice } from './formatters';

interface WhatsAppMessageParams {
  productName: string;
  packSize: string;
  price: number | string;
  whatsappNumber?: string;
}

/**
 * Builds the structured WhatsApp inquiry message and returns the complete wa.me link
 */
export function buildWhatsAppOrderUrl({
  productName,
  packSize,
  price,
  whatsappNumber = '+919876543210'
}: WhatsAppMessageParams): string {
  // Clean phone number: remove spaces, +, -, parentheses
  const cleanNumber = whatsappNumber.replace(/[\s\-()+]/g, '');

  const formattedPrice = formatPrice(price);

  const message = `Hello, I am interested in:
Product: ${productName}
Pack Size: ${packSize}
Price: ${formattedPrice}
Please provide more information about availability and ordering.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

/**
 * Builds general inquiry WhatsApp link
 */
export function buildGeneralWhatsAppUrl(whatsappNumber = '+919876543210', inquiryTopic = 'Aquaculture Feed Consultation'): string {
  const cleanNumber = whatsappNumber.replace(/[\s\-()+]/g, '');
  const message = `Hello AquaGrow Team, I would like to inquire about: ${inquiryTopic}. Please connect me with a technical representative.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
