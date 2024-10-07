'use client';

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMetadata, setUploadingMetadata] = useState(false);

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

      const ipfsUrl = `https://dweb.link/ipfs/${imageUploadResponse.IpfsHash}`;
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

      setUrl(metadataUploadResponse.IpfsHash);
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

  return (
    <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
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

      {url && <p>Metadata IPFS URL: https://dweb.link/ipfs/{url}</p>}
    </main>
  );
}
