import { User } from "@prisma/client"

import { Suspense } from "react"
import UserInfoCard from "./UserInfoCard"
import UserMediaCard from "./UserMediaCard"
import FriendRequest from "./FriendRequest"
import Birthdays from "./Birthdays"
import Ads from "../Ads"

const RightMenu = ({ user }: { user?: User }) => {
  return (
    <div className="flex flex-col gap-6">
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
  )
}

export default RightMenu