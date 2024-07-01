import Link from "next/link"
import Image from "next/image"
import MobileMenu from "./MobileMenu"
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

const Navbar = () => {
  return (
    <div className="h-24 flex items-center justify-between">
      <div className="md:hidden lg:block w-[20%]">
        <Link href={'/'} className="font-bold text-xl text-blue-600">HugOcial</Link>
      </div>

      <div className="hidden md:flex w-[50%] text-sm items-center justify-between">
        <div className="flex gap-6 text-gray-600">
          <Link href={'/'} className="flex items-center gap-2">
            <Image src="/home.png" alt="Home" width={16} height={16} className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link href={'/'} className="flex items-center gap-2">
            <Image src="/friends.png" alt="Amigos" width={16} height={16} className="w-4 h-4" />
            <span>Amigos</span>
          </Link>
          <Link href={'/'} className="flex items-center gap-2">
            <Image src="/stories.png" alt="Stories" width={16} height={16} className="w-4 h-4" />
            <span>Stories</span>
          </Link>
        </div>
        <div className="hidden xl:flex p-2 bg-slate-100 items-center rounded-xl">
          <input type="text" placeholder="Pesquisar..." className="bg-transparent outline-none" />
          <Image src="/search.png" alt="Search" width={14} height={14} />
        </div>
      </div>

      <div className="w-[30%] flex items-center gap-4 xl:gap-8 justify-end">
        <ClerkLoading>
          <div className="inline-block h-8 w-8 animate-pulse rounded-full bg-current align-[-0.125em] text-surface opacity-0 dark:text-gray-400"></div>
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <div className="cursor-pointer">
              <Image src="/people.png" alt="Profile" width={24} height={24} />
            </div>
            <div className="cursor-pointer">
              <Image src="/messages.png" alt="Profile" width={20} height={20} />
            </div>
            <div className="cursor-pointer">
              <Image src="/notifications.png" alt="Profile" width={20} height={20} />
            </div>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2 text-sm">
              <Image src="/noAvatar.png" alt="Login" width={20} height={20} />
              <Link href={'/sign-in'}>Login/Registrar</Link>
            </div>
          </SignedOut>
        </ClerkLoaded>
        <MobileMenu />
      </div>
    </div>
  )
}

export default Navbar