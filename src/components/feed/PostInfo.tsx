'use client';

import Image from 'next/image';
import { useState } from 'react';
import DeleteConfirm from './DeleteConfirme';
import EditModal from './EditModal';

const PostInfo = ({
  postId,
  currentUserId,
  postDesc,
}: {
  postId: number;
  currentUserId: string;
  postDesc: string;
}) => {
  const [open, setOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = () => {
    setShowEditModal(true);
    setOpen(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
    setOpen(false);
  };

  const handleEditSuccess = () => {
    // Fechar modal após sucesso
    setShowEditModal(false);
  };

  const handleDeleteSuccess = () => {
    // Fechar modal após sucesso
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="relative">
        <Image
          src="/more.png"
          alt=""
          width={16}
          height={16}
          onClick={() => setOpen((prev) => !prev)}
          className="cursor-pointer"
        />
        {open && (
          <div className="absolute w-32 right-0 top-4 bg-white p-4 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30 border">
            <span
              onClick={handleEdit}
              className="cursor-pointer hover:text-blue-500 transition-colors"
            >
              Editar
            </span>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 transition-colors text-left"
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      {/* Modal de Edição */}
      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        postId={postId}
        currentDesc={postDesc}
        onSuccess={handleEditSuccess}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirm
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        postId={postId}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
};

export default PostInfo;
