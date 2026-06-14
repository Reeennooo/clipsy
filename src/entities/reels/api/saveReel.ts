import {prisma} from '@/lib/prisma';

type SaveReelInput = {
  url: string;
  note?: string;
  userId: string;
};

export async function saveReel(data: SaveReelInput) {
  return prisma.reel.upsert({
    where: {
      userId_url: {
        userId: data.userId,
        url: data.url,
      },
    },
    update: {
      note: data.note,
    },
    create: {
      url: data.url,
      note: data.note,
      userId: data.userId,
    },
  });
}