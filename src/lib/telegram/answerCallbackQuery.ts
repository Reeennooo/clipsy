export async function answerCallbackQuery(callbackQueryId: number) {
  await fetch(
    `https://api.telegram.org/bot${process.env.TG_TOKEN}/answerCallbackQuery`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
      }),
    }
  );
}