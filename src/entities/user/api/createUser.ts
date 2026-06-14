import {prisma} from '@/lib/prisma';
import {ITelegramUser} from '@/types/telegram';

export async function createUser(telegramUser: ITelegramUser) {
  await prisma.user.upsert({
    where: {
      telegramId: telegramUser.id.toString(),
    },
    update: {
      username: telegramUser.username,
      firstName: telegramUser.first_name
    },
    create: {
      telegramId: telegramUser.id.toString(),
      username: telegramUser.username,
      firstName: telegramUser.first_name
    }
  })
}