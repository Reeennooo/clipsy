type InlineButton = {
  text: string;
  callback_data: string;
};

export type ReplyMarkup = {
  inline_keyboard: InlineButton[][];
};

type SendMessageParams = {
  chatId: number;
  text: string;
  replyMarkup?: ReplyMarkup;
};

export async function sendMessage({chatId, text, replyMarkup}: SendMessageParams) {
  await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup: replyMarkup,
    }),
  });
}