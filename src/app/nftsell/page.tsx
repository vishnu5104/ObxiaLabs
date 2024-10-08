'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { mplCore, transferV1 } from '@metaplex-foundation/mpl-core';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { publicKey as keys, keypairIdentity } from '@metaplex-foundation/umi';
import Link from 'next/link';

const umi = createUmi('https://api.devnet.solana.com').use(mplCore());

const BuyNFT = () => {
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const searchParams = useSearchParams();
  const { publicKey, signTransaction, connected, wallet } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { connection } = useConnection();
  const [result, setResult] = useState(null);
  const [assetId, setAssetId] = useState('');

  // Parse asset from URL
  useEffect(() => {
    const assetString = searchParams.get('asset');
    if (assetString) {
      try {
        const parsedAsset = JSON.parse(decodeURIComponent(assetString));
        setAsset(parsedAsset);
      } catch (e) {
        setError('Failed to parse asset data from URL');
        console.error('Error parsing asset:', e);
      }
    }
  }, [searchParams]);

  const transferSOL = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      setResult(null);
      setStatus('');

      if (!connected || !publicKey || !signTransaction) {
        setStatus('Wallet not connected or available.');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Public key of sender: ', publicKey.toString());
        //nft onwr so fund trasfer
        const receiverWallet = new web3.PublicKey(
          'DbKW3pvLvdkX17379F5DHkxQEZXzH71rq1Z8rXQEhfZh'
        );
        console.log('the asset', asset);

        const priceinsolfloat = parseFloat(asset.metadata.price);
        console.log('the asset', asset, priceinsolfloat);
        const transaction = new web3.Transaction().add(
          web3.SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: receiverWallet,
            lamports: priceinsolfloat * web3.LAMPORTS_PER_SOL,
          })
        );

        transaction.feePayer = publicKey;

        const { blockhash, lastValidBlockHeight } =
          await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;

        const signedTransaction = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signedTransaction.serialize()
        );

        await connection.confirmTransaction(signature, 'finalized');
        console.log('Transaction successful with signature: ', signature);
        setStatus('Transaction successful! ');

        // NFT transfer after successful SOL transfer
        const umi = createUmi('https://api.devnet.solana.com')
          .use(mplCore())
          .use(
            irysUploader({
              address: 'https://devnet.irys.xyz',
            })
          );

        const keypairData = new Uint8Array([
          111, 118, 9, 215, 254, 33, 130, 191, 77, 122, 223, 203, 199, 142, 163,
          37, 108, 144, 76, 19, 145, 171, 61, 107, 167, 161, 80, 105, 83, 3, 63,
          225, 233, 250, 12, 54, 73, 14, 233, 233, 180, 75, 94, 242, 179, 143,
          138, 11, 32, 109, 109, 151, 220, 154, 203, 14, 44, 23, 181, 215, 67,
          86, 235, 169,
        ]);

        const keypair = umi.eddsa.createKeypairFromSecretKey(keypairData);
        umi.use(keypairIdentity(keypair));
        // const assetId = '4UUjMQ5NxuayfoS6FvhKXvPetLptvcuFmHDqzDUt3GFU';
        console.log('Transferring Asset...');
        console.log('the asset is ', asset.publicKey);
        console.log('Public key of sender: ', publicKey.toString());
        const tx = await transferV1(umi, {
          asset: keys(asset.publicKey),
          collection: keys('HQQoaRStzHUrvWwKrdkY14esPx8n6qS4VjZsUQjMyrne'),
          authority: umi.identity,
          newOwner: keys(publicKey.toBase58()),
        }).sendAndConfirm(umi);

        const nftSignature = base58.deserialize(tx.signature)[0];
        console.log('NFT transfer signature:', nftSignature);
        setStatus(
          (prevStatus) =>
            `${prevStatus}\nNFT Added to your Wallet successfully! Signature: ${nftSignature}`
        );
      } catch (err) {
        console.error('Transaction failed: ', err);
        setError(err.message || 'An error occurred during the transaction');
        setStatus('Transaction failed');
      } finally {
        setIsLoading(false);
      }
    },
    [wallet, assetId, connected, publicKey, signTransaction, connection, asset]
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Buy NFT</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {asset ? (
        <div className="border p-4 rounded">
          {asset.metadata?.image && (
            <img
              src={asset.metadata.image}
              alt={asset.metadata.name || 'NFT Image'}
              className="w-full h-48 object-cover mb-2 rounded"
            />
          )}
          <h3 className="font-bold mb-2">{asset.metadata?.name || 'NFT'}</h3>
          <p>{asset.metadata?.description || 'No description available'}</p>
          <p>Price: {asset.metadata?.price} SOL</p>

          <button
            onClick={transferSOL}
            disabled={!connected || isLoading}
            className="mt-2 bg-green-500 text-white p-2 rounded"
          >
            {isLoading
              ? 'Processing...'
              : connected
              ? 'Buy'
              : 'Connect Wallet to Buy'}
          </button>
          <div className="mt-2 bg-green-500 text-white p-2 rounded w-[230px]">
            <Link href="/gamebuilder" passHref>
              <button>Build Games With Your NFT</button>
            </Link>
          </div>
          {status && <p>{status}</p>}
        </div>
      ) : (
        <p>No asset found in the URL.</p>
      )}
    </div>
  );
};

export default BuyNFT;
