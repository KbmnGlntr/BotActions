#!/usr/bin/env node

const os = require('os');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const botStartTime = Date.now();

console.log('Bot started...');

bot.setMyCommands([
  { command: 'start', description: 'Start the bot' },
  { command: 'cek', description: 'View your Telegram ID' },
  { command: 'server', description: 'View server info' },
]);

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / 1048576).toFixed(2) + ' MB';
}

function formatUptime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Hello ${msg.from.first_name}!\nSend /cek to view your Telegram ID.`);
});

bot.onText(/\/cek/, (msg) => {
  const text = `📋 Your Telegram Info:\n\n` +
    `🆔 ID: <code>${msg.from.id}</code>\n` +
    `👤 Name: ${msg.from.first_name} ${msg.from.last_name || ''}\n` +
    `📛 Username: @${msg.from.username || 'none'}`;
    
  bot.sendMessage(msg.chat.id, text, { parse_mode: 'HTML' });
});

bot.onText(/\/server/, (msg) => {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const botUptime = Date.now() - botStartTime;
  const text = `🖥 Server Info:\n\n` +
    `💻 OS: <code>${os.type()} ${os.release()}</code>\n` +
    `⚙️ CPU: <code>${cpus[0].model} (${cpus.length} core)</code>\n` +
    `🧠 Total RAM: <code>${formatBytes(totalMem)}</code>\n` +
    `📊 Used RAM: <code>${formatBytes(usedMem)}</code>\n` +
    `📦 Free RAM: <code>${formatBytes(freeMem)}</code>\n` +
    `⏱ Bot Uptime: <code>${formatUptime(botUptime)}</code>`;

  bot.sendMessage(msg.chat.id, text, { parse_mode: 'HTML' });
});

bot.on('polling_error', (err) => {
  console.error('Polling error:', err.message);
});
