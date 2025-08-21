'use client';

import { addPost } from '@/lib/actions';
import { useUser } from '@clerk/nextjs';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useState } from 'react';
import AddPostButton from './AddPostButton';

const AddPost = () => {
  const { user, isLoaded } = useUser();
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState<any>('');

  if (!isLoaded) return 'Carregando...';

  const handleSubmit = async (formData: FormData) => {
    try {
      await addPost(formData, img?.secure_url || '');
      // Limpar formulário após sucesso
      setDesc('');
      setImg('');
    } catch (error) {
      console.error('Erro ao criar post:', error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      <Image
        src={user?.imageUrl || '/noAvatar.png'}
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      <div className="flex-1">
        <form action={handleSubmit} className="flex gap-4">
          <textarea
            name="desc"
            placeholder="O que está pensando?"
            className="bg-slate-100 rounded-lg flex-1 p-2 resize-none"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
          ></textarea>
          <div>
            <Image
              src="/emoji.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer self-end"
            />
            <AddPostButton />
          </div>
        </form>

        {/* Preview da imagem selecionada */}
        {img && (
          <div className="mt-4 relative inline-block">
            <Image
              src={img.secure_url}
              alt="Preview"
              width={200}
              height={150}
              className="rounded-lg object-cover max-w-full h-auto"
            />
            <button
              type="button"
              onClick={() => setImg('')}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-lg"
              title="Remover imagem"
            >
              ×
            </button>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              Imagem carregada
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <CldUploadWidget
            uploadPreset="social"
            onSuccess={(result, { widget }) => {
              setImg(result.info);
              widget.close();
            }}
            options={{
              multiple: false,
              maxFiles: 1,
              resourceType: 'image',
              clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
              maxFileSize: 10000000, // 10MB
            }}
          >
            {({ open }) => {
              return (
                <div
                  className="flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors"
                  onClick={() => open()}
                >
                  <Image src="/addImage.png" alt="" width={20} height={20} />
                  {img ? 'Trocar Foto' : 'Adicionar Foto'}
                </div>
              );
            }}
          </CldUploadWidget>
          <div className="flex items-center gap-2 cursor-pointer opacity-50">
            <Image src="/addVideo.png" alt="" width={20} height={20} />
            Vídeo
          </div>
          <div className="flex items-center gap-2 cursor-pointer opacity-50">
            <Image src="/poll.png" alt="" width={20} height={20} />
            Enquete
          </div>
          <div className="flex items-center gap-2 cursor-pointer opacity-50">
            <Image src="/addEvent.png" alt="" width={20} height={20} />
            Evento
          </div>
        </div>

        {/* Instruções para o usuário */}
        {img && (
          <div className="mt-2 text-xs text-gray-500 bg-green-50 p-2 rounded">
            ✓ Imagem pronta! Escreva sua mensagem e clique em "Enviar" para
            publicar.
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPost;
