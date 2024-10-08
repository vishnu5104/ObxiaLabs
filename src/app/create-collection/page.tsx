'use client';

import { createCollection, mplCore } from '@metaplex-foundation/mpl-core';
import { generateSigner, Umi } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMetadata, setUploadingMetadata] = useState(false);

  const wallet = useWallet();

  const walletid = wallet.publicKey?.toBase58();

  useEffect(() => {
    console.log('the wallet', walletid);
  }, [walletid]);

  //  for craete nft on chain

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const uploadImage = async () => {
    try {
      if (!image) {
        alert('Please select an image');
        return;
      }

      setUploadingImage(true);

      const formData = new FormData();
      formData.append('file', image);

      // Accessing Pinata JWT from environment variable
      const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

      const imageUploadRequest = await fetch(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${PINATA_JWT}`,
          },
          body: formData,
        }
      );

      const imageUploadResponse = await imageUploadRequest.json();

      if (!imageUploadRequest.ok) {
        throw new Error('Failed to upload image to IPFS');
      }

      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${imageUploadResponse.IpfsHash}`;
      setImageUrl(ipfsUrl);
    } catch (e) {
      console.error(e);
      alert(
        'Error uploading image: ' + (e instanceof Error ? e.message : String(e))
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadMetadata = async () => {
    try {
      if (!name || !description || !imageUrl) {
        alert('Please provide name, description, and upload an image');
        return;
      }

      setUploadingMetadata(true);

      const metadata = {
        owner: walletid,
        name,
        description,
        image: imageUrl,
      };

      const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

      const metadataUploadRequest = await fetch(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${PINATA_JWT}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metadata),
        }
      );

      const metadataUploadResponse = await metadataUploadRequest.json();

      if (!metadataUploadRequest.ok) {
        throw new Error('Failed to upload metadata to IPFS');
      }
      const metadataurl = `https://gateway.pinata.cloud/ipfs/${metadataUploadResponse.IpfsHash}`;
      setUrl(metadataurl);
    } catch (e) {
      console.error(e);
      alert(
        'Error uploading metadata: ' +
          (e instanceof Error ? e.message : String(e))
      );
    } finally {
      setUploadingMetadata(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target?.files?.[0] || null);
  };

  const createCollectionNFT = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!name && !description && !url) {
        alert('Please provide details for the NFT');
        setIsLoading(false);
        return;
      }
      console.log('the meta dta', url);

      const umi: Umi = createUmi('https://api.devnet.solana.com')
        .use(mplCore())
        .use(walletAdapterIdentity(wallet));

      const collection = generateSigner(umi);
      // later if needed set the owner be if needed
      console.log('Creating Colection...');
      const tx = await createCollection(umi, {
        collection,
        name: name, // Use the 'name' input from the form
        uri: url,
      }).sendAndConfirm(umi);

      console.log('Asset creation transaction sent:', tx);

      const signature = base58.deserialize(tx.signature)[0];

      setResult({
        collectionAddress: collection.publicKey,
        signature: signature,
      });

      console.log('Collection Created');
      console.log('Transaction signature:', signature);
    } catch (err) {
      console.error('Error creating collection:', err);
      setError(
        err.message || 'An error occurred while creating the collection'
      );
    } finally {
      setIsLoading(false);
    }
  }, [name, wallet, url]);

  return (
    <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center text-black">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />
      <button
        disabled={uploadingImage}
        onClick={uploadImage}
        className="mb-4 p-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
      >
        {uploadingImage ? 'Uploading Image...' : 'Upload Image'}
      </button>

      {imageUrl && <p className="mb-4">Image IPFS URL: {imageUrl}</p>}

      <button
        disabled={uploadingMetadata || !imageUrl}
        onClick={uploadMetadata}
        className="mb-4 p-2 bg-green-500 text-white rounded disabled:bg-green-300"
      >
        {uploadingMetadata ? 'Uploading Metadata...' : 'Upload Metadata'}
      </button>
      <h2>Create Your New Collection</h2>
      <button onClick={createCollectionNFT} disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Collection'}
      </button>

      {error && <div>Error: {error}</div>}
      {result && (
        <div>
          <p>
            Your NFT:
            <a
              href={`https://explorer.solana.com/address/${result.collectionAddress}?cluster=devnet`}
              target="_blank" // Opens the link in a new tab
              rel="noopener noreferrer" // Prevents security risks
              className="text-blue-500 underline" // Optional: for styling the link
            >
              View on Solana Explorer
            </a>
          </p>
          <p>Transaction Signature: {result.signature}</p>
        </div>
      )}

      {url && <p>Metadata IPFS URL: {url}</p>}
    </main>
  );
}
