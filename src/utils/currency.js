export const USD_TO_INR = 1; // static conversion rate (adjust as needed)

export function usdToInr(usd) {
  if (!usd && usd !== 0) return null;
  return Math.round(usd * USD_TO_INR);
}

export function formatINR(amount) {
  if (amount === 0) return 'Free';
  if (amount == null) return '-';
  const s = String(amount);
  return '₹' + s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
