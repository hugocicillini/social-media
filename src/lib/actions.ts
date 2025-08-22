'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from './client';

export const searchUsers = async (search: string) => {
  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: search,
        mode: 'insensitive',
      },
    },
    take: 5,
  });

  return users;
};

export const friendsList = async () => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) throw new Error('Nenhum usuário logado!');

  const followers = await prisma.follower.findMany({
    where: {
      followingId: currentUserId,
    },
    select: {
      follower: {
        select: {
          id: true,
          name: true,
          surname: true,
          avatar: true,
        },
      },
    },
  });

  const followings = await prisma.follower.findMany({
    where: {
      followerId: currentUserId,
    },
    select: {
      following: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const followersList = followers.map((f) => f.follower);
  const followingsList = followings.map((f) => f.following);

  const friends = followersList.filter((follower) =>
    followingsList.some((following) => following.id === follower.id)
  );

  return friends;
};

export const switchFollow = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) throw new Error('Nenhum usuário logado!');

  try {
    const existingFollow = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    if (existingFollow) {
      await prisma.follower.delete({
        where: {
          id: existingFollow.id,
        },
      });
    } else {
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      });
      if (existingFollowRequest) {
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          },
        });
      } else {
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error('Algo deu errado!');
  }
};

export const switchBlock = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) throw new Error('Nenhum usuário logado!');

  try {
    const existingBlock = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    });

    if (existingBlock) {
      await prisma.block.delete({
        where: {
          id: existingBlock.id,
        },
      });
    } else {
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error('Algo deu errado!');
  }
};

export const acceptFollowRequest = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) throw new Error('Nenhum usuário logado!');

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });

      await prisma.follower.create({
        data: {
          followerId: userId,
          followingId: currentUserId,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error('Algo deu errado!');
  }
};

export const declineFollowRequest = async (userId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) throw new Error('Nenhum usuário logado!');

  try {
    const existingFollowRequest = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (existingFollowRequest) {
      await prisma.followRequest.delete({
        where: {
          id: existingFollowRequest.id,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error('Algo deu errado!');
  }
};

export const updateProfile = async (
  prevState: { success: boolean; error: boolean },
  payload: { formData: FormData; cover: string }
) => {
  const { userId } = auth();

  if (!userId) throw new Error('Nenhum usuário logado!');

  const { formData, cover } = payload;

  const fields = Object.fromEntries(formData);

  const filteredFields = {
    ...Object.fromEntries(
      Object.entries(fields).filter(([_, value]) => value !== '')
    ),
    ...Object.fromEntries(
      Object.entries(cover).filter(([_, value]) => value !== '')
    ),
  };

  const Profile = z.object({
    cover: z.string().optional(),
    name: z.string().max(50).optional(),
    surname: z.string().max(50).optional(),
    description: z.string().max(250).optional(),
    city: z.string().max(50).optional(),
    school: z.string().max(50).optional(),
    work: z.string().max(50).optional(),
    website: z.string().max(50).optional(),
  });

  const validatedFields = Profile.safeParse({ ...filteredFields, cover });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return { success: false, error: true };
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: validatedFields.data,
    });
    return { success: true, error: false };
  } catch (error) {
    return { success: false, error: true };
  }
};

export const switchLike = async (postId: number) => {
  const { userId } = auth();

  if (!userId) throw new Error('Nenhum usuário logado!');

  try {
    // Verificar se o usuário existe no banco, se não, criar
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      // Criar usuário se não existir
      await prisma.user.create({
        data: {
          id: userId,
          username: 'user_' + userId.slice(-6), // Username temporário
          avatar: '/noAvatar.png',
          cover: '/noCover.png',
        },
      });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error('Algo deu errado!');
  }
};

export const addComment = async (postId: number, desc: string) => {
  const { userId } = auth();

  if (!userId) throw new Error('Nenhum usuário logado!');

  try {
    // Verificar se o usuário existe no banco, se não, criar
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      // Criar usuário se não existir
      await prisma.user.create({
        data: {
          id: userId,
          username: 'user_' + userId.slice(-6), // Username temporário
          avatar: '/noAvatar.png',
          cover: '/noCover.png',
        },
      });
    }

    const createdComment = await prisma.comment.create({
      data: {
        postId,
        userId,
        desc,
      },
      include: {
        user: true,
      },
    });

    revalidatePath('/');
    return createdComment;
  } catch (error) {
    console.log(error);
    throw new Error('Algo deu errado!');
  }
};

export const addPost = async (formData: FormData, img: string) => {
  const desc = formData.get('desc') as string;

  const Desc = z.string().min(1).max(250);

  const validateDesc = Desc.safeParse(desc);

  if (!validateDesc.success) {
    console.log('Descrição inválida!');

    return;
  }

  const { userId } = auth();

  if (!userId) throw new Error('Nenhum usuário logado!');

  try {
    // Verificar se o usuário existe no banco, se não, criar
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      // Criar usuário se não existir
      await prisma.user.create({
        data: {
          id: userId,
          username: 'user_' + userId.slice(-6), // Username temporário
          avatar: '/noAvatar.png',
          cover: '/noCover.png',
        },
      });
    }

    await prisma.post.create({
      data: {
        desc: validateDesc.data,
        userId,
        img,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.log(error);
  }
};

export const addStory = async (img: string) => {
  const { userId } = auth();

  if (!userId) throw new Error('Nenhum usuário logado!');

  try {
    // Verificar se o usuário existe no banco, se não, criar
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      // Criar usuário se não existir
      await prisma.user.create({
        data: {
          id: userId,
          username: 'user_' + userId.slice(-6), // Username temporário
          avatar: '/noAvatar.png',
          cover: '/noCover.png',
        },
      });
    }

    const existingStory = await prisma.story.findFirst({
      where: {
        userId,
      },
    });

    if (existingStory) {
      await prisma.story.delete({
        where: {
          id: existingStory.id,
        },
      });
    }

    const createdStory = await prisma.story.create({
      data: {
        userId,
        img,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        user: true,
      },
    });

    return createdStory;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (postId: number) => {
  const { userId } = auth();

  if (!userId) throw new Error('Nenhum usuário logado!');

  try {
    await prisma.post.delete({
      where: {
        id: postId,
        userId,
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.log(error);
  }
};

export const editPost = async (postId: number, desc: string) => {
  const { userId } = auth();

  if (!userId) throw new Error('Nenhum usuário logado!');

  const Desc = z.string().min(1).max(250);
  const validateDesc = Desc.safeParse(desc);

  if (!validateDesc.success) {
    throw new Error('Descrição inválida!');
  }

  try {
    await prisma.post.update({
      where: {
        id: postId,
        userId, // Garantir que só o dono pode editar
      },
      data: {
        desc: validateDesc.data,
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.log(error);
    throw new Error('Erro ao editar post!');
  }
};
