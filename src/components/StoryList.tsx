'use client';

import { addStory } from '@/lib/actions';
import { useUser } from '@clerk/nextjs';
import { Story, User } from '@prisma/client';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useOptimistic, useState } from 'react';

type StoryWithUser = Story & { user: User };

const StoryList = ({
  stories,
  userId,
}: {
  stories: StoryWithUser[];
  userId: string;
}) => {
  const [storyList, setStoryList] = useState(stories);
  const [img, setImg] = useState<any>('');

  const { user, isLoaded } = useUser();

  const [optimisticStories, addOptimisticStory] = useOptimistic(
    storyList,
    (state, value: StoryWithUser) => {
      return [value, ...state];
    }
  );

  const add = async () => {
    if (!img?.secure_url) return;

    addOptimisticStory({
      id: Math.random(),
      img: img.secure_url,
      createdAt: new Date(Date.now()),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: userId,
      user: {
        id: userId,
        username: 'Enviando...',
        avatar: user?.imageUrl || '/noAvatar.png',
        cover: '',
        description: '',
        name: '',
        surname: '',
        city: '',
        work: '',
        school: '',
        website: '',
        createdAt: new Date(Date.now()),
      },
    });

    try {
      const createdStory = await addStory(img.secure_url);
      setStoryList((prev) => [createdStory!, ...prev]);
      setImg('');
    } catch (error) {}
  };

  return (
    <>
      <CldUploadWidget
        uploadPreset="social"
        onSuccess={(result, { widget }) => {
          setImg(result.info);
          widget.close();
        }}
      >
        {({ open }) => {
          return (
            <div className="flex flex-col items-center gap-2 cursor-pointer relative">
              <Image
                src={img?.secure_url || user?.imageUrl || '/noAvatar.png'}
                alt=""
                width={80}
                height={80}
                className="h-20 w-20 rounded-full ring-2 object-cover"
                onClick={() => open()}
              />
              {img ? (
                <form action={add}>
                  <button className="text-xs bg-blue-500 p-1 rounded-md text-white">
                    Adicionar
                  </button>
                </form>
              ) : (
                <span className="font-medium">Adicionar Story</span>
              )}
            </div>
          );
        }}
      </CldUploadWidget>
      {optimisticStories.map((story) => (
        <div className="flex flex-col items-center gap-2 cursor-pointer">
          <Image
            src={story.user.avatar || '/noAvatar.png'}
            alt=""
            width={80}
            height={80}
            className="h-20 w-20 rounded-full ring-2"
          />
          <span className="font-medium">{story.user.username}</span>
        </div>
      ))}
    </>
  );
};

export default StoryList;
