import {ReplyMarkup} from '@/lib/telegram/sendMesssage';

export async function editMessageReplyMarkup({chatId, messageId, replyMarkup}: {
  chatId: number;
  messageId: number;
  replyMarkup?: ReplyMarkup | null;
}) {
  const response = await fetch(
    `https://api.telegram.org/bot${process.env.TG_TOKEN}/editMessageReplyMarkup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        reply_markup: replyMarkup,
      }),
    }
  );

  return response.json();
}