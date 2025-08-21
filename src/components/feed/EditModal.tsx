'use client';

import { editPost } from '@/lib/actions';
import { useState } from 'react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  currentDesc: string;
  onSuccess?: () => void;
}

const EditModal = ({
  isOpen,
  onClose,
  postId,
  currentDesc,
  onSuccess,
}: EditModalProps) => {
  const [newDesc, setNewDesc] = useState(currentDesc);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (newDesc.trim().length === 0) {
      alert('A descrição não pode estar vazia');
      return;
    }

    setIsLoading(true);
    try {
      await editPost(postId, newDesc.trim());
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao editar post:', error);
      alert('Erro ao editar post. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewDesc(currentDesc);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Editar Post</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
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
        </div>

        {/* Content */}
        <div className="p-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Descrição
          </label>
          <textarea
            id="description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            rows={4}
            placeholder="O que está pensando?"
            maxLength={250}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {newDesc.length}/250 caracteres
            </span>
            {newDesc.length > 250 && (
              <span className="text-xs text-red-500">Limite excedido!</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={
              isLoading || newDesc.trim().length === 0 || newDesc.length > 250
            }
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
