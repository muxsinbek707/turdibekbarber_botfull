import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = "8986152183:AAEZqzbK15cgCptyF_qq5LhABZ5kzbw0qQk";
const adminId = 8667749270;
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.static(__dirname));

let bot = null;

const info = `Turdibek barber xizmat ko'rsatish markazi boti.
Ushbu bot orqali saytdan yuborilgan taklif, shikoyat va bron ma'lumotlarini qabul qilamiz.
Bron qilish uchunn bron qilish tugmasini bosing.`;

if (token && adminId) {
  bot = new TelegramBot(token, { polling: true });
  console.log('Telegram bot muvaffaqiyatli ishga tushirildi.');

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const user = msg.from;

    if (text === '/start') {
      return bot.sendMessage(chatId, `Salom ${user.first_name}! Botimizga xush kelibsiz 👋🏻\n\n${info}`);
    }
  });
} else {
  console.warn('DIQQAT: TOKEN yoki ADMIN_ID atrof-muhit o‘zgaruvchilari .env faylida to‘g‘ri sozlanmagan. Telegram xabarnoma xizmati ishlamaydi.');
}

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contact', (_req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.post('/contact', async (req, res) => {
  const { name, phone, time, type, message } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ ok: false, message: 'Iltimos, ism va telefon raqamni to‘ldiring.' });
  }

  const text = [
    '🆕 Yangi bron/murojaat keldi',
    `Ism: ${name}`,
    `Telefon: ${phone}`,
    `Vaqt: ${time || 'Ko‘rsatilmagan'}`,
    `Mavzu: ${type || 'Bron'}`,
    `Xabar: ${message || 'Xabar kiritilmagan'}`,
  ].join('\n');

  try {
    if (bot) {
      await bot.sendMessage(adminId, text);
    }

    res.json({ ok: true, message: 'Xabaringiz muvaffaqiyatli yuborildi.' });
  } catch (error) {
    console.error('Telegram xabar yuborishda xato:', error);
    res.status(500).json({ ok: false, message: 'Xabar yuborishda xatolik yuz berdi.' });
  }
});

app.listen(port, () => {
  console.log(`Server ${port}-portda ishlamoqda`);
});
