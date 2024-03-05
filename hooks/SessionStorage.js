'use client'

export default function useSessionStorage(name) {
  if (typeof window !== 'undefined') {
      return sessionStorage.getItem(name);
   }

  return null;
}

