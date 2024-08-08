'use client';

import { searchUsers } from '@/lib/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type User = {
  id: string;
  username: string;
  avatar: string | null;
  cover: string | null;
  name: string | null;
  surname: string | null;
  description: string | null;
  city: string | null;
  school: string | null;
  work: string | null;
  website: string | null;
  createdAt: Date;
};

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([] as User[]);
  const router = useRouter();

  async function handleSearch(query: string) {
    setSearch(query);

    if (query.length > 1) {
      const users = await searchUsers(query);
      setResults(users);
    } else {
      setResults([]);
    }
  }

  function handleSelectUser(name: string) {
    router.push(`/profile/${name}`);
    setSearch('');
    setResults([]);
  }

  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Pesquisar..."
          className="bg-transparent outline-none border-gray-300 w-full pl-3 pr-10"
          onChange={(e) => handleSearch(e.target.value)}
          value={search}
        />
        {search.length > 0 ? (
          <button
            onClick={() => {
              setSearch('');
              setResults([]);
            }}
            className="absolute right-3"
          >
            X
          </button>
        ) : (
          <Image
            src="/search.png"
            alt="Search"
            width={14}
            height={14}
            className="absolute right-3"
          />
        )}
      </div>
      {results.length > 0 && (
        <ul className="absolute rounded-lg bg-white border border-gray-300 mt-3 w-full z-10">
          {results.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelectUser(user.username)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={user.avatar || '/user.png'}
                  alt="User"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                {user.username}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
