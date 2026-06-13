import {NextRequest, NextResponse} from 'next/server';
import {checkReelUrl} from '@/lib/checkReelUrl';
import {checkUrl} from '@/lib/checkUrl';

async function sendMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body);
  const message = body.message;

  if (!message) {
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id;

  if (message.text === '/start') {
    await sendMessage(chatId, `Добро пожаловать в Clipsy, ${message.from.first_name}. Теперь ты можешь отправлять мне ссылки на видео, а я буду сохранять твои лучшие идеи`);
  } else if (checkUrl(message.text)) {

    const isReelUrl = checkReelUrl(message.text);
    await sendMessage(chatId, isReelUrl ? `Сохранил видео идею` : 'Это не Reel url');

  } else {
    await sendMessage(chatId, `Не понимаю тебя`);
  }

  return NextResponse.json({ ok: true });
}

// Установка Вебхука

// https://api.telegram.org/bot8831308691:AAHPTiczI15VEpa8Njs4ha-vtVFf09sDORY/setWebhook?url=https://cc41-185-191-119-118.ngrok-free.app/api/telegram/webhook