'use client';

import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="h-[calc(100vh-6rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Ilustração/Ícone */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>

        {/* Subtítulo */}
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Página não encontrada
        </h2>

        {/* Descrição */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Ops! A página que você está procurando não existe ou foi removida.
          Talvez você tenha digitado o endereço errado ou a página foi movida.
        </p>

        {/* Botões de ação */}
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Voltar ao início
          </Link>

          <button
            onClick={() => window.history.back()}
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Voltar à página anterior
          </button>
        </div>

        {/* Links úteis */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Ou visite uma dessas páginas:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Home
            </Link>
            <Link
              href="/friends"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Amigos
            </Link>
            <Link
              href="/stories"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Stories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
