'use client';

import { updateProfile } from '@/lib/actions';
import { User } from '@prisma/client';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import UpdateButton from './UpdateButton';

// Internal component that can use useFormStatus
const FormContent = ({
  user,
  cover,
  coverPreview,
  setCover,
  setCoverPreview,
  handleClose,
  formData,
  setFormData,
  router,
}: {
  user: User;
  cover: any;
  coverPreview: string;
  setCover: (cover: any) => void;
  setCoverPreview: (preview: string) => void;
  handleClose: () => void;
  formData: {
    name: string;
    surname: string;
    description: string;
    city: string;
    school: string;
    work: string;
    website: string;
  };
  setFormData: (data: any) => void;
  router: any;
}) => {
  const { pending } = useFormStatus();
  const { enqueueSnackbar } = useSnackbar();

  const [state, formAction] = useActionState(updateProfile, {
    success: false,
    error: false,
  });

  // Effect to handle auto-close after successful update
  useEffect(() => {
    if (state.success) {
      enqueueSnackbar('Perfil atualizado com sucesso!', { variant: 'success' });
      handleClose();
      router.refresh();
    }
    if (state.error) {
      enqueueSnackbar('Erro ao atualizar perfil. Tente novamente.', {
        variant: 'error',
      });
    }
  }, [state.success, state.error, router, handleClose, enqueueSnackbar]);

  return (
    <form
      action={(formData) =>
        formAction({
          formData,
          cover: cover?.secure_url || user.cover || '',
        })
      }
    >
      {/* Loading overlay */}
      {pending && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">Salvando...</span>
          </div>
        </div>
      )}

      <h1>Editar Perfil</h1>
      <div className="mt-4 text-xs text-gray-500">
        Use o perfil da navegação para atualizar o avatar ou o nome de usuário.
      </div>
      <CldUploadWidget
        uploadPreset="social"
        onSuccess={(result) => {
          setCover(result.info);
          if (typeof result.info === 'object' && result.info?.secure_url) {
            setCoverPreview(result.info.secure_url);
          }
        }}
      >
        {({ open }) => {
          return (
            <div className="flex flex-col gap-2 my-4">
              <label htmlFor="">Foto de capa</label>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => open()}
              >
                <Image
                  src={coverPreview}
                  alt=""
                  width={56}
                  height={32}
                  className="w-12 h-8 rounded-md object-cover"
                />
                <span className="text-xs underline text-gray-600">Alterar</span>
              </div>
            </div>
          );
        }}
      </CldUploadWidget>
      <div className="flex flex-col gap-4">
        {/* Nome e Sobrenome - agrupados */}
        <div className="flex gap-8">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="" className="text-xs text-gray-500">
              Nome
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nome"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="ring-1 ring-gray-300 p-4 rounded-md text-sm"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="" className="text-xs text-gray-500">
              Sobrenome
            </label>
            <input
              type="text"
              name="surname"
              placeholder="Sobrenome"
              value={formData.surname}
              onChange={(e) =>
                setFormData({ ...formData, surname: e.target.value })
              }
              className="ring-1 ring-gray-300 p-4 rounded-md text-sm"
            />
          </div>
        </div>

        {/* Descrição em largura total */}
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="" className="text-xs text-gray-500">
            Descrição
          </label>
          <div className="relative">
            <textarea
              name="description"
              placeholder="Descrição"
              value={formData.description}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 200) {
                  setFormData({ ...formData, description: value });
                }
              }}
              maxLength={200}
              rows={3}
              className="ring-1 ring-gray-300 p-4 rounded-md text-sm w-full resize-none"
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {formData.description.length}/200
            </div>
          </div>
        </div>

        {/* Cidade e Estudo - agrupados */}
        <div className="flex gap-8">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="" className="text-xs text-gray-500">
              Cidade
            </label>
            <input
              type="text"
              name="city"
              placeholder="Cidade"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="ring-1 ring-gray-300 p-4 rounded-md text-sm"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="" className="text-xs text-gray-500">
              Estudo
            </label>
            <input
              type="text"
              name="school"
              placeholder="Estudo"
              value={formData.school}
              onChange={(e) =>
                setFormData({ ...formData, school: e.target.value })
              }
              className="ring-1 ring-gray-300 p-4 rounded-md text-sm"
            />
          </div>
        </div>

        {/* Trabalho e Website - agrupados */}
        <div className="flex gap-8">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="" className="text-xs text-gray-500">
              Trabalho
            </label>
            <input
              type="text"
              name="work"
              placeholder="Trabalho"
              value={formData.work}
              onChange={(e) =>
                setFormData({ ...formData, work: e.target.value })
              }
              className="ring-1 ring-gray-300 p-4 rounded-md text-sm"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="" className="text-xs text-gray-500">
              Website
            </label>
            <input
              type="text"
              name="website"
              placeholder="Website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="ring-1 ring-gray-300 p-4 rounded-md text-sm"
            />
          </div>
        </div>
      </div>
      <UpdateButton />
      <button
        type="button"
        className={`absolute right-4 top-4 transition-colors p-1 ${
          pending
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-400 hover:text-gray-600 cursor-pointer'
        }`}
        onClick={pending ? undefined : handleClose}
        disabled={pending}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </form>
  );
};

const UpdateUser = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<any>(false);
  const [coverPreview, setCoverPreview] = useState<string>(
    user.cover || '/noCover.png'
  );
  const [formKey, setFormKey] = useState(0); // Key to reset form state

  // Controlled form states
  const [formData, setFormData] = useState({
    name: user.name || '',
    surname: user.surname || '',
    description: user.description || '',
    city: user.city || '',
    school: user.school || '',
    work: user.work || '',
    website: user.website || '',
  });

  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
    setCoverPreview(user.cover || '/noCover.png'); // Reset preview to original
    setCover(false); // Reset selected cover
    // Reset form data to original user values
    setFormData({
      name: user.name || '',
      surname: user.surname || '',
      description: user.description || '',
      city: user.city || '',
      school: user.school || '',
      work: user.work || '',
      website: user.website || '',
    });
  };

  const handleOpen = () => {
    setOpen(true);
    setFormKey((prev) => prev + 1); // Force re-render with new key to reset useActionState
  };

  // Effect to sync form data when user prop changes
  useEffect(() => {
    setFormData({
      name: user.name || '',
      surname: user.surname || '',
      description: user.description || '',
      city: user.city || '',
      school: user.school || '',
      work: user.work || '',
      website: user.website || '',
    });
    setCoverPreview(user.cover || '/noCover.png');
  }, [user]);

  return (
    <div>
      <span
        className="text-blue-500 text-xs cursor-pointer"
        onClick={handleOpen}
      >
        Editar
      </span>
      {open && (
        <div className="absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-1/2 xl:w-1/3 relative">
            <FormContent
              key={formKey}
              user={user}
              cover={cover}
              coverPreview={coverPreview}
              setCover={setCover}
              setCoverPreview={setCoverPreview}
              handleClose={handleClose}
              formData={formData}
              setFormData={setFormData}
              router={router}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateUser;
