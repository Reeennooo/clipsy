import {prisma} from '@/lib/prisma';

export const getUserByTelegramId = async (telegramId: number) => {
  return prisma.user.findUnique({
    where: {
      telegramId: telegramId.toString(),
    },
  });
};