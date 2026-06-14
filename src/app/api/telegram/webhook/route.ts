import {NextRequest, NextResponse} from 'next/server';
import {checkReelUrl} from '@/lib/checkReelUrl';
import {checkUrl} from '@/lib/checkUrl';
import {ITelegramUser} from '@/types/telegram';
import {createUser} from '@/features/user/api/createUser';
import {sendMessage} from '@/lib/telegram/sendMesssage';
import {getUserByTelegramId} from '@/features/user/api/getUserByTelegramId';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = body.message;

  if (!message) {
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id;
  const telegramUser: ITelegramUser = message.from;

  // Команда регистрации
  if (message.text === '/start') {
    try {
      await createUser(telegramUser);

      await sendMessage(
        chatId,
        `Добро пожаловать в Clipsy, ${telegramUser.first_name}. Теперь ты можешь отправлять мне ссылки на видео, а я буду сохранять твои лучшие идеи`
      );
    } catch (err) {
      console.error(err);
      await sendMessage(chatId, 'Ошибка при регистрации');
    }

    return NextResponse.json({ ok: true });
  }

  // Проверяем зарегистрирован ли пользователь
  const user = await getUserByTelegramId(telegramUser.id);
  console.log(user);

  if (!user) {
    await sendMessage(
      chatId,
      'Ты ещё не зарегистрирован. Напиши команду /start'
    );

    return NextResponse.json({ ok: true });
  }

  // Основная логика
  if (checkUrl(message.text)) {
    const isReelUrl = checkReelUrl(message.text);

    await sendMessage(
      chatId,
      isReelUrl ? 'Сохранил видео идею' : 'Это не Reel url'
    );
  } else {
    await sendMessage(chatId, 'Отправь пожалуйста ссылку на видео');
  }

  return NextResponse.json({ ok: true });
}

// https://api.telegram.org/bot8831308691:AAHPTiczI15VEpa8Njs4ha-vtVFf09sDORY/setWebhook?url=https://d133-185-191-119-118.ngrok-free.app/api/telegram/webhook