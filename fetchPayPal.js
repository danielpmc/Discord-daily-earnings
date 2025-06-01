const axios = require('axios');

async function getAccessToken() {
  const response = await axios({
    method: 'post',
    url: 'https://api-m.paypal.com/v1/oauth2/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET,
    },
    data: 'grant_type=client_credentials',
  });

  return response.data.access_token;
}

async function getPayPalEarningsUSD() {
  const accessToken = await getAccessToken();

  const today = new Date();
  const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  const response = await axios.get(
    `https://api-m.paypal.com/v1/reporting/transactions?start_date=${start}&end_date=${end}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  let totalUSD = 0;
  response.data.transaction_details.forEach(txn => {
    const amount = txn.transaction_info.transaction_amount;
    if (amount.currency_code === 'USD') {
      totalUSD += parseFloat(amount.value);
    }
  });

  return totalUSD.toFixed(2);
}

module.exports = { getPayPalEarningsUSD };
