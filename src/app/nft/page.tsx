'use client';

import React, { useState, useEffect } from 'react';
import { publicKey } from '@metaplex-foundation/umi';
import { das } from '@metaplex-foundation/mpl-core-das';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
// Create UMI instance with Solana devnet
const umi = createUmi('https://api.devnet.solana.com');
umi.use(dasApi());

const HomePage = () => {
  const wallet = useWallet();
  const walletid = wallet.publicKey?.toBase58(); // Get wallet public key as string
  const router = useRouter();
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');

  // Fetch assets once the wallet is connected and public key is available
  useEffect(() => {
    if (walletid) {
      fetchAssetsByOwner(walletid);
    }
  }, [walletid]);

  const fetchAssetsByOwner = async (walletId) => {
    try {
      setError('');
      setAssets([]);

      const foundAssets = await das.searchAssets(umi, {
        owner: publicKey(walletId),
        interface: 'MplCoreAsset',
      });

      // Fetch metadata for each asset
      const assetMetadataPromises = foundAssets.map(async (asset) => {
        const response = await fetch(asset.uri);
        const metadata = await response.json();
        return { ...asset, metadata };
      });

      const assetsWithMetadata = await Promise.all(assetMetadataPromises);
      setAssets(assetsWithMetadata);
    } catch (error) {
      console.error('Error fetching assets by owner:', error);
      setError(
        'Error fetching assets. Please check the public key and try again.'
      );
    }
  };

  const NftCard = ({ asset }) => {
    const { metadata } = asset;
    const router = useRouter();
    const serializeAsset = (asset) => {
      return JSON.stringify(asset, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      );
    };
    const handleClick = () => {
      const assetString = serializeAsset(asset); // Use the custom serialization
      const encodedAsset = encodeURIComponent(assetString);
      router.push(`/nft/${asset.publicKey}?asset=${encodedAsset}`);
    };

    return (
      <div
        onClick={handleClick}
        style={{
          border: '1px solid #ccc',
          borderRadius: '10px',
          padding: '15px',
          margin: '10px',
          width: '300px',
          textAlign: 'center',
        }}
      >
        <img
          src={metadata?.image || 'https://via.placeholder.com/150'}
          alt={metadata?.name || 'NFT Image'}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '10px',
          }}
        />
        <h3>{metadata?.name || 'Unnamed NFT'}</h3>
        <p>{metadata?.description || 'No description available'}</p>
        <p>{metadata?.price || '0'} SOL</p>
      </div>
    );
  };

  return (
    <div>
      <h1>Metaplex Asset Fetcher</h1>

      {/* Wallet must be connected to fetch NFT details */}
      {wallet.connected ? (
        <>
          <h2 className="text-black">NFT Assets:</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {assets.length > 0 ? (
              assets.map((asset, index) => (
                <NftCard key={index} asset={asset} />
              ))
            ) : (
              <p>No assets found or enter a public key to fetch assets.</p>
            )}
          </div>
        </>
      ) : (
        <p>Please connect your wallet to view your NFT assets.</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default HomePage;
