'use client';
import { FadeIn } from '@/components/common/fade-in';
import { SearchInput } from '@/components/ui/search-input';
import Link from 'next/link';
import { useState } from 'react';
import { settingsItems } from './constants';

export const SettingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = searchTerm
    ? settingsItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : settingsItems;

  return (
    <FadeIn className='max-w-7xl mx-auto py-8 space-y-8 px-5'>
      <div className='flex w-full justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-800'>Settings</h1>
        <div className='w-64'>
          <SearchInput
            placeholder='Search settings'
            value={searchTerm}
            onChange={(e: any) => setSearchTerm(e)}
          />
        </div>
      </div>

      <main className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'>
        {filteredItems.map((item) =>
          item.disabled ? (
            <div
              key={item.key}
              className='col-span-1 p-6 bg-gray-100 rounded-lg shadow-sm border border-gray-200 flex flex-col opacity-60 cursor-not-allowed'
            >
              <div className='flex items-center mb-4'>
                {item.icon}
                <h2 className='text-xl font-bold ml-3 text-gray-600'>{item.title}</h2>
              </div>
              <p className='text-gray-500'>{item.description}</p>
              <span className='mt-3 text-xs text-gray-500 italic'>Currently unavailable</span>
            </div>
          ) : (
            <Link
              href={`/dashboard/settings/${item.key}`}
              key={item.key}
              className='col-span-1 p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex flex-col'
            >
              <div className='flex items-center mb-4'>
                {item.icon}
                <h2 className='text-xl font-bold ml-3 text-gray-800'>{item.title}</h2>
              </div>
              <p className='text-gray-600'>{item.description}</p>
            </Link>
          ),
        )}
      </main>

      {filteredItems.length === 0 && (
        <div className='text-center py-10'>
          <p className='text-gray-500 text-lg'>No settings found matching "{searchTerm}"</p>
          <button
            className='mt-4 text-indigo-600 hover:text-indigo-800'
            onClick={() => setSearchTerm('')}
          >
            Clear search
          </button>
        </div>
      )}
    </FadeIn>
  );
};
