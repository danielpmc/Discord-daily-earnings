# Discord Daily Earnings Bot

A Discord bot that automatically logs daily Stripe and PayPal earnings in USD at midnight and posts them in a specified channel using a styled embed.

## Features
- Scheduled daily reporting at midnight (server time)
- Stripe and PayPal integration
- Embedded message format
- Totals in USD with automatic summation

## Setup

### Prerequisites
- Node.js (v18+ recommended)
- Stripe and PayPal API credentials
- Discord bot token and a channel ID

### Installation
```bash
git clone https://github.com/danielpmc/Discord-daily-earnings.git
cd Discord-daily-earnings
npm install
```

### Configuration
Create a `.env` file:
```env
DISCORD_TOKEN=your-discord-bot-token
DISCORD_CHANNEL_ID=your-target-channel-id
STRIPE_SECRET_KEY=your-stripe-secret-key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_SECRET=your-paypal-secret
```

### Run the Bot
```bash
node index.js
```

Make sure your bot is invited to your server with permission to read and write in the target channel.

## License
MIT
