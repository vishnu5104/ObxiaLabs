'use client';

import React, { useState } from 'react';
import { publicKey } from '@metaplex-foundation/umi';
import { das } from '@metaplex-foundation/mpl-core-das';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('https://api.devnet.solana.com');
umi.use(dasApi());

const NFTFetch = () => {
  const [nftOwner, setNftOwner] = useState('');
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');

  const fetchAssetsByOwner = async () => {
    try {
      setError('');
      setAssets([]);

      const foundAssets = await das.searchAssets(umi, {
        owner: publicKey(nftOwner),
        interface: 'MplCoreAsset',
      });

      console.log('Assets owned by the address:', foundAssets);
      setAssets(foundAssets);
    } catch (error) {
      console.error('Error fetching assets by owner:', error);
      setError(
        'Error fetching assets. Please check the public key and try again.'
      );
    }
  };

  const customStringify = (obj) => {
    return JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
  };

  return (
    <div>
      <h1>Fetch NFT</h1>
      <input
        type="text"
        value={nftOwner}
        onChange={(e) => setNftOwner(e.target.value)}
        placeholder="Enter NFT Owner Public Key"
        style={{ marginRight: '10px' }}
      />
      <button onClick={fetchAssetsByOwner}>Fetch NFT Details</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>NFT Assets:</h2>
      {assets.length > 0 ? (
        <ul>
          {assets.map((asset, index) => (
            <li key={index}>
              <pre>{customStringify(asset)}</pre>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assets found or enter a public key to fetch assets.</p>
      )}
    </div>
  );
};

export default NFTFetch;
