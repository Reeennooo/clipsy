import {prisma} from '@/lib/prisma';
import {UserFlowState} from '@/entities/user/types';

export async function updateUserState(
  telegramId: string,
  data: {
    pendingReelUrl?: string | null;
    flowState?: UserFlowState
  }
) {
  return prisma.user.update({
    where: {
      telegramId,
    },
    data,
  });
}