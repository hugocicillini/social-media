import prisma from '@/lib/client';
import { auth } from '@clerk/nextjs/server';
import { User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import UpdateUser from './UpdateUser';
import UserInfoCardInteraction from './UserInfoCardInteraction';

const UserInfoCard = async ({ user }: { user: User }) => {
  const createdAtDate = new Date(user.createdAt);

  const formattedDate = createdAtDate.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  let isUserBlocked = false;
  let isFollowing = false;
  let isFollowingSent = false;

  const { userId: currentUserId } = auth();

  if (currentUserId) {
    const blockRes = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: user.id,
      },
    });

    blockRes ? (isUserBlocked = true) : (isUserBlocked = false);

    const followRes = await prisma.follower.findFirst({
      where: {
        followerId: currentUserId,
        followingId: user.id,
      },
    });

    followRes ? (isFollowing = true) : (isFollowing = false);

    const followReqRes = await prisma.followRequest.findFirst({
      where: {
        senderId: currentUserId,
        receiverId: user.id,
      },
    });

    followReqRes ? (isFollowingSent = true) : (isFollowingSent = false);
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg text-sm flex flex-col gap-4">
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Informações Pessoais</span>
        {currentUserId === user.id ? (
          <UpdateUser user={user} />
        ) : (
          <Link href="/" className="text-blue-500 text-xs">
            Ver mais
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-4 text-gray-500">
        {/* Foto de perfil, Nome e Username */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex-shrink-0">
            <Image
              src={user.avatar || '/noAvatar.png'}
              alt=""
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl text-black font-semibold">
              {user.name && user.surname
                ? user.name + ' ' + user.surname
                : user.username}
            </span>
            <span className="text-sm text-gray-400">@{user.username}</span>
          </div>
        </div>

        {/* Descrição */}
        {user.description && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-700 italic">{user.description}</p>
          </div>
        )}

        {/* Informações de localização e formação */}
        <div className="space-y-3">
          {user.city && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex-shrink-0">
                <Image src="/map.png" alt="" width={20} height={20} />
              </div>
              <span className="text-sm">
                Morando em <b className="text-gray-700">{user.city}</b>
              </span>
            </div>
          )}

          {user.school && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex-shrink-0">
                <Image src="/school.png" alt="" width={20} height={20} />
              </div>
              <span className="text-sm">
                Estudou em <b className="text-gray-700">{user.school}</b>
              </span>
            </div>
          )}

          {user.work && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex-shrink-0">
                <Image src="/work.png" alt="" width={20} height={20} />
              </div>
              <span className="text-sm">
                Trabalha em <b className="text-gray-700">{user.work}</b>
              </span>
            </div>
          )}
        </div>

        {/* Website e Data de entrada */}
        <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
          {user.website && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex-shrink-0">
                <Image src="/link.png" alt="" width={20} height={20} />
              </div>
              <Link
                href={
                  user.website.startsWith('http')
                    ? user.website
                    : `https://${user.website}`
                }
                className="text-blue-500 hover:text-blue-700 font-medium text-sm transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.website.replace(/^https?:\/\//, '')}
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 flex-shrink-0">
              <Image src="/date.png" alt="" width={20} height={20} />
            </div>
            <span className="text-sm">
              Entrou em <b className="text-gray-700">{formattedDate}</b>
            </span>
          </div>
        </div>

        {/* Botões de interação */}
        {currentUserId && currentUserId !== user.id && (
          <div className="pt-3 border-t border-gray-100">
            <UserInfoCardInteraction
              userId={user.id}
              isUserBlocked={isUserBlocked}
              isFollowing={isFollowing}
              isFollowingSent={isFollowingSent}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;
