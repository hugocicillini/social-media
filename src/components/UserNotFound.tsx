'use client';

import Link from 'next/link';

interface UserNotFoundProps {
  type: 'blocked' | 'not-found';
  username?: string;
}

const UserNotFound = ({ type, username }: UserNotFoundProps) => {
  const isBlocked = type === 'blocked';

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full text-center">
        {/* Ícone */}
        <div className="mb-8">
          <div
            className={`w-24 h-24 mx-auto ${
              isBlocked ? 'bg-red-100' : 'bg-yellow-100'
            } rounded-full flex items-center justify-center`}
          >
            {isBlocked ? (
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                />
              </svg>
            ) : (
              <svg
                className="w-12 h-12 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {isBlocked ? 'Acesso Negado' : 'Usuário Não Encontrado'}
        </h1>

        {/* Descrição */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {isBlocked ? (
            <>
              Você não pode acessar este perfil. O usuário
              {username && (
                <span className="font-medium"> @{username}</span>
              )}{' '}
              pode ter restringido o acesso ou bloqueado você.
            </>
          ) : (
            <>
              O usuário
              {username && (
                <span className="font-medium"> @{username}</span>
              )}{' '}
              não foi encontrado. Verifique se o nome de usuário está correto ou
              se o perfil ainda existe.
            </>
          )}
        </p>

        {/* Sugestões */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">
            {isBlocked ? 'O que você pode fazer:' : 'Sugestões:'}
          </h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            {isBlocked ? (
              <>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Respeite a decisão do usuário
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Explore outros perfis da comunidade
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Entre em contato por outros meios se apropriado
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Verifique a ortografia do nome de usuário
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  O usuário pode ter alterado seu nome de usuário
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  A conta pode ter sido desativada
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Botões de ação */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Voltar ao Feed
          </Link>

          <Link
            href="/friends"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Encontrar Amigos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserNotFound;
