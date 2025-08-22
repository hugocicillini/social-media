'use client';

import { switchBlock, switchFollow } from '@/lib/actions';
import { useOptimistic, useState } from 'react';

const UserInfoCardInteraction = ({
  userId,
  isUserBlocked,
  isFollowing,
  isFollowingSent,
}: {
  userId: string;
  isUserBlocked: boolean;
  isFollowing: boolean;
  isFollowingSent: boolean;
}) => {
  const [userState, setUserState] = useState({
    following: isFollowing,
    blocked: isUserBlocked,
    followingRequestSent: isFollowingSent,
  });

  const [isLoading, setIsLoading] = useState(false);

  const follow = async () => {
    if (isLoading) return; // Prevenir múltiplos cliques

    setIsLoading(true);
    switchOptimisticState('follow');
    try {
      await switchFollow(userId);
      setUserState((prev) => ({
        ...prev,
        following: prev.following ? false : prev.following,
        followingRequestSent:
          !prev.following && !prev.followingRequestSent
            ? true
            : prev.followingRequestSent
            ? false
            : prev.followingRequestSent,
      }));
    } catch (error) {
      console.error('Erro ao seguir usuário:', error);
      // Reverter estado otimista em caso de erro
      setUserState((prev) => ({
        ...prev,
        following: isFollowing,
        followingRequestSent: isFollowingSent,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const block = async () => {
    if (isLoading) return; // Prevenir múltiplos cliques

    setIsLoading(true);
    switchOptimisticState('block');
    try {
      await switchBlock(userId);
      setUserState((prev) => ({
        ...prev,
        blocked: !prev.blocked,
      }));
    } catch (error) {
      console.error('Erro ao bloquear usuário:', error);
      // Reverter estado em caso de erro
      setUserState((prev) => ({
        ...prev,
        blocked: isUserBlocked,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const [optimisticState, switchOptimisticState] = useOptimistic(
    userState,
    (state, value: 'follow' | 'block') =>
      value === 'follow'
        ? {
            ...state,
            // Se já está seguindo, para de seguir
            following: state.following ? false : state.following,
            // Se não está seguindo e não enviou pedido, envia pedido
            // Se já enviou pedido, cancela o pedido
            followingRequestSent:
              !state.following && !state.followingRequestSent
                ? true
                : state.followingRequestSent
                ? false
                : state.followingRequestSent,
          }
        : {
            ...state,
            blocked: !state.blocked,
          }
  );
  return (
    <>
      <form>
        <button
          type="button"
          onClick={follow}
          className="w-full bg-blue-500 text-white text-sm rounded-md p-2 disabled:opacity-70 disabled:cursor-not-allowed transition-opacity"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Carregando...
            </div>
          ) : (
            <>
              {optimisticState.following
                ? 'Seguindo'
                : optimisticState.followingRequestSent
                ? 'Pedido Enviado'
                : 'Seguir'}
            </>
          )}
        </button>
      </form>
      <form className="self-end mt-4">
        <button
          type="button"
          onClick={block}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:bg-gray-50"
        >
          <svg
            className={`w-4 h-4 transition-opacity ${
              isLoading ? 'opacity-50' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                optimisticState.blocked
                  ? 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z'
                  : 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              }
            />
          </svg>
          <span
            className={`text-red-400 text-xs cursor-pointer transition-opacity ${
              isLoading ? 'opacity-50' : ''
            }`}
          >
            {optimisticState.blocked
              ? 'Desbloquear Usuário'
              : 'Bloquear Usuário'}
          </span>
        </button>
      </form>
    </>
  );
};

export default UserInfoCardInteraction;
