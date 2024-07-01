import prisma from '@/lib/client'
import CommentList from './CommentList'

const Comments = async ({ postId }: { postId: number }) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId
    },
    include: {
      user: true
    }
  })
  return (
    <div className="flex flex-col gap-4">
      <CommentList comments={comments} postId={postId} />
    </div>
  )
}

export default Comments