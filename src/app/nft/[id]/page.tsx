'use client';
import React, { useState, useCallback, useEffect } from 'react';
import {
  addPlugin,
  CollectionV1,
  mplCore,
} from '@metaplex-foundation/mpl-core';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useSearchParams } from 'next/navigation';
import {
  Umi,
  keypairIdentity,
  publicKey as keys,
} from '@metaplex-foundation/umi';
import { useWallet } from '@solana/wallet-adapter-react';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

import { useRouter } from 'next/navigation';

const NftDetailPage = () => {
  const wallet = useWallet();

  const router = useRouter();
  const searchParams = useSearchParams();
  const assetString = searchParams.get('asset');
  const [asset, setAsset] = useState(null);
  const [isListed, setIsListed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const customStringify = (obj) => {
    return JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
  };

  useEffect(() => {
    if (assetString) {
      const parsedAsset = JSON.parse(decodeURIComponent(assetString));
      setAsset(parsedAsset);
      checkIfListed(parsedAsset);
    }
  }, [assetString]);

  const checkIfListed = (assetData) => {
    const isListed =
      assetData.transferDelegate &&
      assetData.transferDelegate.authority &&
      assetData.transferDelegate.authority.type === 'Address';

    console.log('is listed', isListed);
    setIsListed(isListed);
  };

  const listNFT = useCallback(async () => {
    if (!asset || !asset.publicKey) {
      console.error('Asset or asset public key is missing');
      setError('Asset information is missing. Please try again.');
      return;
    }

    setIsLoading(true);
    setError('');

    const umi: Umi = createUmi('https://api.devnet.solana.com')
      .use(mplCore())
      .use(walletAdapterIdentity(wallet));
    console.log('the asset is', asset.publicKey);
    const assetAddress = keys(asset.publicKey);

    //fixed platform addres
    const delegate = keys('GkM8wz8ZcfQdhDCDKgRbNj6GHx6LNtQ7rA5gmHF8Mj7N');
    // const collection: CollectionV1 = {
    //   publicKey: keys(colkey), // Create a PublicKey instance
    //   oracles: [], // Replace with actual oracles if needed
    //   lifecycleHooks: [], // Replace with actual lifecycle hooks if needed
    // };
    try {
      await addPlugin(umi, {
        asset: assetAddress,
        collection: keys('HQQoaRStzHUrvWwKrdkY14esPx8n6qS4VjZsUQjMyrne'),
        plugin: {
          type: 'TransferDelegate',
          authority: { type: 'Address', address: delegate },
        },
      }).sendAndConfirm(umi);

      setIsListed(true);
      console.log('NFT listed successfully');
    } catch (error) {
      console.error('Error listing NFT:', error);
      setError('Error listing NFT. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [wallet, asset]);

  const serializeAsset = (asset) => {
    return JSON.stringify(asset, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
  };

  if (!asset) {
    return <div className="p-4 text-center">No asset found!</div>;
  }

  const { metadata } = asset;

  const handleClick = () => {
    console.log('the assets from click', asset);
    const assetString = serializeAsset(asset); // Use the custom serialization
    const encodedAsset = encodeURIComponent(assetString);
    router.push(`/nftsell?asset=${encodedAsset}`);
  };

  return (
    <div className="p-4 max-w-md mx-auto text-black">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={metadata.image}
            alt={metadata.name}
            className="w-full h-64 object-cover"
          />
          {isListed && (
            <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 m-2 rounded">
              Listed
            </div>
          )}
        </div>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">{metadata.name}</h1>
          <p className="text-gray-600 mb-4">{metadata.description}</p>
          <p className="text-lg font-semibold mb-4">Price: {metadata.price}</p>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            onClick={listNFT}
            disabled={isListed || isLoading}
            className={`w-full py-2 px-4 rounded ${
              isListed
                ? 'bg-gray-400 cursor-not-allowed'
                : isLoading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isListed ? 'Listed' : isLoading ? 'Listing...' : 'List NFT'}
          </button>
          <button onClick={handleClick}>Show listed NFT</button>
          {/* <button
            onClick={() => {
              router.push('/nftsell');
            }}
          >
            Show listed NFT
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default NftDetailPage;
