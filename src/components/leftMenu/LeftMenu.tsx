import prisma from '@/lib/client';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import Ads from '../Ads';
import ProfileCard from './ProfileCard';

const LeftMenu = async ({ type }: { type: 'home' | 'profile' }) => {
  const { userId } = auth();

  if (!userId) return null;

  // Verificar se o usuário existe no banco, se não, criar
  let user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      name: true,
      username: true,
      surname: true,
      avatar: true,
    },
  });

  if (!user) {
    // Criar usuário se não existir
    await prisma.user.create({
      data: {
        id: userId,
        username: 'user_' + userId.slice(-6), // Username temporário
        avatar: '/noAvatar.png',
        cover: '/noCover.png',
      },
    });

    // Buscar novamente após criar
    user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        name: true,
        username: true,
        surname: true,
        avatar: true,
      },
    });
  }

  if (!user) return null;
  return (
    <div className="flex flex-col gap-6">
      {type === 'home' && <ProfileCard />}
      <div className="p-4 bg-white shadow-md rounded-lg text-sm text-gray-500 flex flex-col gap-2">
        <Link
          href={`/profile/${user.username}`}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/posts.png" alt="" width={20} height={20} />
          <span>Meus Posts</span>
        </Link>
        <hr className="border-t-1 bg-gray-50 w-full self-center" />
        <Link
          href={'/'}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/activity.png" alt="" width={20} height={20} />
          <span>Atividades</span>
        </Link>
        <hr className="border-t-1 bg-gray-50 w-full self-center" />
        <Link
          href={'/'}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/market.png" alt="" width={20} height={20} />
          <span>Marketplace</span>
        </Link>
        <hr className="border-t-1 bg-gray-50 w-full self-center" />
        <Link
          href={'/'}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/events.png" alt="" width={20} height={20} />
          <span>Eventos</span>
        </Link>
        <hr className="border-t-1 bg-gray-50 w-full self-center" />
        <Link
          href={'/'}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/albums.png" alt="" width={20} height={20} />
          <span>Álbuns</span>
        </Link>
        <hr className="border-t-1 bg-gray-50 w-full self-center" />
        <Link
          href={'/'}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/videos.png" alt="" width={20} height={20} />
          <span>Vídeos</span>
        </Link>
        <hr className="border-t-1 bg-gray-50 w-full self-center" />
        <Link
          href={'/'}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/news.png" alt="" width={20} height={20} />
          <span>Notícias</span>
        </Link>
        <hr className="border-t-1 bg-gray-50 w-full self-center" />
        <Link
          href={'/'}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/courses.png" alt="" width={20} height={20} />
          <span>Cursos</span>
        </Link>
        <hr className="border-t-1 bg-gray-50 w-full self-center" />
        <Link
          href={'/'}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/lists.png" alt="" width={20} height={20} />
          <span>Listas</span>
        </Link>
        <hr className="border-t-1 bg-gray-50 w-full self-center" />
        <Link
          href={'/'}
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/settings.png" alt="" width={20} height={20} />
          <span>Configurações</span>
        </Link>
      </div>
      <Ads size="sm" />
    </div>
  );
};

export default LeftMenu;
