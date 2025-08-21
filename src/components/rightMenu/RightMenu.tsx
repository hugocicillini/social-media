import { User } from '@prisma/client';

import { Suspense } from 'react';
import Ads from '../Ads';
import Birthdays from './Birthdays';
import FriendRequest from './FriendRequest';
import UserInfoCard from './UserInfoCard';
import UserMediaCard from './UserMediaCard';

const RightMenu = ({ user }: { user?: User }) => {
  return (
    <div className="flex flex-col w-[60%] gap-6">
      {user ? (
        <>
          <Suspense fallback="Loading...">
            <UserInfoCard user={user} />
          </Suspense>
          <Suspense fallback="Loading...">
            <UserMediaCard user={user} />
          </Suspense>
        </>
      ) : null}
      <FriendRequest />
      <Birthdays />
      <Ads size="md" />
    </div>
  );
};

export default RightMenu;
