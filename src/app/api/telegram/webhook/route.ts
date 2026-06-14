import {NextRequest, NextResponse} from 'next/server';
import {checkReelUrl} from '@/lib/checkReelUrl';
import {checkUrl} from '@/lib/checkUrl';
import {NoteAnswer} from '@/types/telegram';
import {createUser} from '@/entities/user/api/createUser';
import {sendMessage} from '@/lib/telegram/sendMesssage';
import {getUserByTelegramId} from '@/entities/user/api/getUserByTelegramId';
import {updateUserState} from '@/entities/user/api/updateUserState';
import {answerCallbackQuery} from '@/lib/telegram/answerCallbackQuery';
import {UserFlowState} from '@/entities/user/types';
import {saveReel} from '@/entities/reels/api/saveReel';
import {editMessageReplyMarkup} from '@/lib/telegram/editMessageReplyMarkup';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body);

  const message = body.message;
  const callback = body.callback_query;

  // =========================
  // CALLBACK HANDLER
  // =========================
  if (callback) {
    const chatId = callback.message.chat.id;
    const messageId = callback.message.message_id;
    const telegramId = callback.from.id.toString();

    const user = await getUserByTelegramId(telegramId);
    if (!user) return NextResponse.json({ ok: true });

    if (callback.data === NoteAnswer.NO_NOTE) {
      await saveReel({
        userId: user.id,
        url: user.pendingReelUrl!,
      });

      await updateUserState(telegramId, {
        pendingReelUrl: null,
        flowState: UserFlowState.IDLE,
      });

      await sendMessage({
        chatId,
        text: "Reel сохранён без заметки",
      });
    }

    if (callback.data === NoteAnswer.YES_NOTE) {
      await updateUserState(telegramId, {
        flowState: UserFlowState.WAITING_NOTE_TEXT,
      });

      await sendMessage({
        chatId,
        text: "Напиши заметку к видео",
      });
    }

    console.log("ВЫЗВАЛСЯ");
    const x = await editMessageReplyMarkup({chatId, messageId, replyMarkup: {inline_keyboard: []}});
    console.log('ОТВЕТ ---------------------------------------------');
    console.log(x);

    await answerCallbackQuery(callback.id);
    return NextResponse.json({ ok: true });
  }

  // =========================
  // MESSAGE HANDLER
  // =========================
  if (!message) {
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id;
  const telegramId = message.from.id.toString();
  const text = message.text;

  // -------------------------
  // START (REGISTRATION)
  // -------------------------
  if (text === "/start") {
    await createUser(message.from);

    await sendMessage({
      chatId,
      text: `Добро пожаловать, ${message.from.first_name}`,
    });

    return NextResponse.json({ ok: true });
  }

  const user = await getUserByTelegramId(telegramId);

  if (!user) {
    await sendMessage({
      chatId,
      text: "Ты не зарегистрирован. Напиши /start",
    });

    return NextResponse.json({ ok: true });
  }

  // -------------------------
  // RESET (DEV)
  // -------------------------
  if (text === "/reset") {
    await updateUserState(telegramId, {
      pendingReelUrl: null,
      flowState: UserFlowState.IDLE,
    });

    await sendMessage({
      chatId,
      text: "Сбросил состояние",
    });

    return NextResponse.json({ ok: true });
  }

  // -------------------------
  // WAITING NOTE TEXT STATE
  // -------------------------
  if (user.flowState === UserFlowState.WAITING_NOTE_TEXT) {
    await saveReel({
      userId: user.id,
      url: user.pendingReelUrl!,
      note: text,
    });

    await updateUserState(telegramId, {
      pendingReelUrl: null,
      flowState: UserFlowState.IDLE,
    });

    await sendMessage({
      chatId,
      text: "Заметка сохранена",
    });

    return NextResponse.json({ ok: true });
  }

  // -------------------------
  // URL HANDLING
  // -------------------------
  if (checkUrl(text)) {
    if (!checkReelUrl(text)) {
      await sendMessage({ chatId, text: "Это не Reel url" });
      return NextResponse.json({ ok: true });
    }

    await updateUserState(telegramId, {
      pendingReelUrl: text,
      flowState: UserFlowState.WAITING_NOTE_DECISION,
    });

    await sendMessage({
      chatId,
      text: "Хочешь оставить заметку?",
      replyMarkup: {
        inline_keyboard: [
          [
            { text: "Да", callback_data: NoteAnswer.YES_NOTE },
            { text: "Нет", callback_data: NoteAnswer.NO_NOTE },
          ],
        ],
      },
    });

    return NextResponse.json({ ok: true });
  }

  // -------------------------
  // DEFAULT
  // -------------------------
  await sendMessage({
    chatId,
    text: "Отправь ссылку на видео",
  });

  return NextResponse.json({ ok: true });
}