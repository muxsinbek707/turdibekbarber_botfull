import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Token va adminId ni to‘g‘ridan-to‘g‘ri yozib qo‘yish
const token = "8986152183:AAEZqzbK15cgCptyF_qq5LhABZ5kzbw0qQk";
const adminId = 8667749270;

const app = express();
const PORT = process.env.PORT || 5000; // Render portni avtomatik beradi

app.use(cors({ origin: '*' })); // GitHub Pages uchun ruxsat
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // static fayllar

let bot = null;

const info = `Turdibek barber xizmat ko'rsatish markazi boti.
Ushbu bot orqali saytdan yuborilgan taklif, shikoyat va bron ma'lumotlarini qabul qilamiz.
Bron qilish uchun bron qilish tugmasini bosing.`;

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
  console.warn('DIQQAT: TOKEN yoki ADMIN_ID kodda to‘g‘ri yozilmagan.');
}

// Asosiy sahifa
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Contact sahifa (faqat HTML ko‘rsatish)
app.get('/contact', (_req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// Contact form ma'lumotlarini GET orqali qabul qilish
app.get('/send-contact', async (req, res) => {
  const { name, phone, time, type, message } = req.query || {};

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

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlamoqda`);
});
