"use client"

import { updateProfile } from "@/lib/actions"
import { User } from "@prisma/client"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useActionState, useState } from "react"
import UpdateButton from "./UpdateButton"

const UpdateUser = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false)
  const [cover, setCover] = useState<any>(false)

  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    state.success && router.refresh()
  }

  const [state, formAction] = useActionState(updateProfile, { success: false, error: false })

  return (
    <div>
      <span className="text-blue-500 text-xs cursor-pointer" onClick={() => setOpen(true)}>Update</span>
      {open && <div className="absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <form action={(formData) => formAction({ formData, cover: cover?.secure_url || "" })} className="p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-1/2 xl:w-1/3 relative">
          <h1>Atualizar Perfil</h1>
          <div className="mt-4 text-xs text-gray-500">
            Use o perfil da navegação para atualizar o avatar ou o nome de usuário.
          </div>
          <CldUploadWidget uploadPreset="social" onSuccess={(result) => setCover(result.info)}>
            {({ open }) => {
              return (
                <div className="flex flex-col gap-4 my-4">
                  <label htmlFor="">Foto de capa</label>
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => open()}>
                    <Image src={user.cover || "/noCover.png"} alt="" width={48} height={32} className="w-12 h-8 rounded-md object-cover" />
                    <span className="text-xs underline text-gray-4=600">Trocar</span>
                  </div>
                </div>
              );
            }}
          </CldUploadWidget>
          <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs text-gray-500">Nome</label>
              <input type="text" name="name" placeholder={user.name || "Nome"} className="ring-1 ring-gray-300 p-3 rounded-md text-sm" />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs text-gray-500">Sobrenome</label>
              <input type="text" name="surname" placeholder={user.surname || "Sobrenome"} className="ring-1 ring-gray-300 p-3 rounded-md text-sm" />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs text-gray-500">Descrição</label>
              <input type="text" name="description" placeholder={user.description || "Descrição"} className="ring-1 ring-gray-300 p-3 rounded-md text-sm" />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs text-gray-500">Cidade</label>
              <input type="text" name="city" placeholder={user.city || "Cidade"} className="ring-1 ring-gray-300 p-3 rounded-md text-sm" />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs text-gray-500">Estudo</label>
              <input type="text" name="school" placeholder={user.school || "Estudo"} className="ring-1 ring-gray-300 p-3 rounded-md text-sm" />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs text-gray-500">Trabalho</label>
              <input type="text" name="work" placeholder={user.work || "Trabalho"} className="ring-1 ring-gray-300 p-3 rounded-md text-sm" />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="" className="text-xs text-gray-500">Website</label>
              <input type="text" name="website" placeholder={user.website || "Website"} className="ring-1 ring-gray-300 p-3 rounded-md text-sm" />
            </div>
          </div>
          <UpdateButton />
          {state.success && <span className="text-green-500 text-xs">Atualizado com sucesso!</span>}
          {state.error && <span className="text-red-500 text-xs">Algo deu errado!</span>}
          <div className="absolute text-xl right-2 top-3 cursor-pointer" onClick={handleClose}>X</div>
        </form>
      </div>}
    </div>
  )
}

export default UpdateUser