require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');
const { getStripeEarningsUSD } = require('./fetchStripe');
const { getPayPalEarningsUSD } = require('./fetchPayPal');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`Bot is online as ${client.user.tag}`);

  // Post immediately on startup
  try {
    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    const [stripeTotal, paypalTotal] = await Promise.all([
      getStripeEarningsUSD(),
      getPayPalEarningsUSD(),
    ]);

    const total = (parseFloat(stripeTotal) + parseFloat(paypalTotal)).toFixed(2);

    const embed = new EmbedBuilder()
      .setTitle('💰 Daily Earnings Report')
      .addFields(
        { name: '🟦 Stripe', value: `$${stripeTotal} USD`, inline: true },
        { name: '🟨 PayPal', value: `$${paypalTotal} USD`, inline: true },
        { name: '🧮 Total', value: `**$${total} USD**`, inline: false }
      )
      .setTimestamp()
      .setColor(0x00bfff);

    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.error('Error posting startup earnings:', err);
  }

  // Run every day at midnight
  schedule.scheduleJob('0 0 * * *', async () => {
    const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);

    try {
      const [stripeTotal, paypalTotal] = await Promise.all([
        getStripeEarningsUSD(),
        getPayPalEarningsUSD(),
      ]);

      const total = (parseFloat(stripeTotal) + parseFloat(paypalTotal)).toFixed(2);

      const embed = new EmbedBuilder()
        .setTitle('💰 Daily Earnings Report')
        .addFields(
          { name: '🟦 Stripe', value: `$${stripeTotal} USD`, inline: true },
          { name: '🟨 PayPal', value: `$${paypalTotal} USD`, inline: true },
          { name: '🧮 Total', value: `**$${total} USD**`, inline: false }
        )
        .setTimestamp()
        .setColor(0x00bfff);

      await channel.send({ embeds: [embed] });
    } catch (err) {
      console.error('Error fetching earnings:', err);
    }
  });
});

client.login(process.env.DISCORD_TOKEN);
