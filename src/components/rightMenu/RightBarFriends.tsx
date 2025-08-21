'use client';

import { useEffect, useState } from 'react';
import { friendsList } from '@/lib/actions';
import Image from 'next/image';

interface Friend {
  id: string;
  name?: string | null;
  surname?: string | null;
  avatar?: string | null;
}

const RightBarFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsData = await friendsList();
      console.log(friendsData);
      setFriends(friendsData);
    };

    fetchFriends();
  }, []);

  console.log(friends);

  return (
    <div className="hidden xl:block w-[40%] mx-6 p-4 bg-white rounded-lg shadow-md text-sm">
      <div className="flex justify-between items-center font-medium mb-4">
        <span className="text-gray-500">Amigos</span>
      </div>
      {friends.length > 0
        ? friends.map((friend) => (
            <div key={friend.id} className="flex flex-col gap-4">
              <div className="flex items-center rounded-lg gap-4 p-2 hover:bg-slate-100">
                <Image
                  src={friend.avatar || '/noAvatar.png'}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span>{`${friend.name} ${friend.surname}`}</span>
              </div>
            </div>
          ))
        : 'Nenhum amigo encontrado!'}
    </div>
  );
};

export default RightBarFriends;
