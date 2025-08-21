import prisma from '@/lib/client';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import StoryList from './StoryList';

const Stories = async () => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) return null;

  // Verificar se o usuário existe no banco, se não, criar
  const existingUser = await prisma.user.findUnique({
    where: { id: currentUserId }
  });

  if (!existingUser) {
    // Criar usuário se não existir
    await prisma.user.create({
      data: {
        id: currentUserId,
        username: 'user_' + currentUserId.slice(-6), // Username temporário
        avatar: '/noAvatar.png',
        cover: '/noCover.png'
      }
    });
  }

  const stories = await prisma.story.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
      OR: [
        {
          user: {
            followers: {
              some: {
                followerId: currentUserId,
              },
            },
          },
        },
        {
          userId: currentUserId,
        },
      ],
    },
    include: {
      user: true,
    },
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide">
      <div className="flex gap-8 w-max">
        <StoryList stories={stories} userId={currentUserId} />
      </div>
    </div>
  );
};

export default Stories;
