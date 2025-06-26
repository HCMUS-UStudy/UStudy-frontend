"use client";

import { useRouter } from "next/navigation";

export function useEncodedRoute() {
  const router = useRouter();
  const encodeId = (id: string): string => {
    return btoa(id);
  };

  const decodeId = (encodedId: string): string => {
    return atob(encodedId);
  };

  const handleNavigate = (id: string, basePath: string) => {
    const encryptedId = encodeId(id);
    router.push(`${basePath}/${encryptedId}`);
  };

  return {
    encodeId,
    decodeId,
    handleNavigate,
  };
}
