"use client"

import { deletePost } from "@/lib/actions"
import Image from "next/image"
import { useState } from "react"

const PostInfo = ({ postId }: { postId: number }) => {
  const [open, setOpen] = useState(false)

  const deletePostWithId = deletePost.bind(null, postId)

  return (
    <div className="relative">
      <Image src="/more.png" alt="" width={16} height={16} onClick={() => setOpen(prev => !prev)} className="cursor-pointer" />
      {open && <div className="absolute w-32 right-0 top-4 bg-white p-4 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
        <span className="cursor-pointer">Ver</span>
        <span className="cursor-pointer">Repostar</span>
        <form action={deletePostWithId}>
          <button className="text-red-500">Deletar</button>
        </form>
      </div>}
    </div>
  )
}

export default PostInfo