import prisma from "@/lib/client"
import { auth } from "@clerk/nextjs/server"
import Post from "./Post"

const Feed = async ({ username }: { username: string }) => {
  const { userId } = auth()

  let posts: any[] = []

  if (username) {
    posts = await prisma.post.findMany({
      where: {
        user: {
          username
        }
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  if (!username && userId) {
    const following = await prisma.follower.findMany({
      where: {
        followerId: userId
      },
      select: {
        followingId: true
      }
    })

    const followingIds = following.map(f => f.followingId)

    const ids = [...followingIds, userId]

    posts = await prisma.post.findMany({
      where: {
        userId: {
          in: ids
        }
      },
      include: {
        user: true,
        likes: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  return (
    <div className='flex flex-col gap-4 mb-4'>
      {posts.length ? (posts.map(post => <Post key={post.id} post={post} />)) : <span className='text-gray-500'>Sem publicações</span>}
    </div>
  )
}

export default Feed