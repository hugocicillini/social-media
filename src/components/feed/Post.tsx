import { auth } from '@clerk/nextjs/server';
import { Post as PostType, User } from '@prisma/client';
import Image from 'next/image';
import { Suspense } from 'react';
import Comments from './Comments';
import PostInfo from './PostInfo';
import PostInteraction from './PostInteraction';

type FeedPostType = PostType & { user: User } & {
  likes: [{ userId: string }];
} & { _count: { comments: number } };

const Post = ({ post }: { post: FeedPostType }) => {
  const { userId } = auth();

  return (
    <div className="flex flex-col gap-4 p-4 bg-white shadow-md rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post.user.avatar || '/noAvatar.png'}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">
            {post.user.name && post.user.surname
              ? post.user.name + ' ' + post.user.surname
              : post.user.username}
          </span>
        </div>
        {userId === post.user.id && <PostInfo postId={post.id} currentUserId={userId} postDesc={post.desc} />}
      </div>
      <div className="flex flex-col gap-4">
        <p>{post.desc}</p>
        {post.img && (
          <div className="w-full max-w-md mx-auto relative">
            <Image
              src={post.img}
              alt=""
              width={400}
              height={250}
              className="w-full h-auto object-contain rounded-md"
            />
          </div>
        )}
      </div>
      <Suspense fallback="Loading...">
        <PostInteraction
          postId={post.id}
          likes={post.likes.map((like) => like.userId)}
          commentNumber={post._count.comments}
        />
        <Comments postId={post.id} />
      </Suspense>
    </div>
  );
};

export default Post;
