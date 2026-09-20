/**
 * Formats a number into Indian Rupee currency string, e.g. 1250 -> ₹1,250
 */
export function formatPrice(price: number | string | undefined): string {
  if (price === undefined || price === null || isNaN(Number(price))) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(price));
}

/**
 * Formats date string into readable Indian standard format (e.g. 20 Sep 2026)
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch (e) {
    return dateString;
  }
}
