'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-6 text-purple-800">
          Welcome to Obxia Labs
        </h1>
        <p className="text-gray-600 mb-8">
          Your gateway to creating and managing digital collections and NFTs for
          your onchain and get monetize
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button onClick={() => router.push('/create-collection')}>
            Create Collection
          </Button>
          <Button onClick={() => router.push('/create-nft')}>Create NFT</Button>
        </div>
      </div>
    </div>
  );
}
