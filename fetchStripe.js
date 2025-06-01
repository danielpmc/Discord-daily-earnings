const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function getStripeEarningsUSD() {
  const now = new Date();
  const todayStart = Math.floor(new Date(now.setHours(0, 0, 0, 0)).getTime() / 1000);
  const todayEnd = Math.floor(new Date(now.setHours(23, 59, 59, 999)).getTime() / 1000);

  const charges = await stripe.charges.list({
    created: {
      gte: todayStart,
      lte: todayEnd,
    },
    limit: 100,
  });

  let total = 0;
  charges.data.forEach(charge => {
    if (charge.paid && !charge.refunded) {
      const amountUSD = charge.currency !== 'usd' ? 0 : charge.amount / 100;
      total += amountUSD;
    }
  });

  return total.toFixed(2);
}

module.exports = { getStripeEarningsUSD };
