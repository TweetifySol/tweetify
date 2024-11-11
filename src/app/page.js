"use client";
import { useState, useEffect } from 'react';
import { VersionedTransaction, Connection, Keypair } from '@solana/web3.js';
import bs58 from "bs58";
import Sidebar from './sidebar';
import axios from 'axios';

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
const web3Connection = new Connection(RPC_ENDPOINT, 'confirmed');

export default function Home() {
  const [link, setLink] = useState('');
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveFeed, setLiveFeed] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [transactionLink, setTransactionLink] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    initializeSubmissionState();
    
    try {
      const twitterLink = formatLink(link);

      const { tweet, mediaUrl, profileImageUrl, username } = await fetchTweetMetadata(twitterLink);
      const { ticker, name } = await fetchTokenMetadata(tweet.text);

      logTokenCreationDetails(ticker, name);

      setCoinData({ ticker, name, profileImageUrl, username });

      const imageUrl = selectImage(mediaUrl, profileImageUrl);
      await createPumpFunToken({ ticker, name, description: tweet.text, mediaUrl: imageUrl, viewLink: twitterLink });
    } catch (error) {
      handleError("Error processing tweet data", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSubmissionState = () => {
    setLoading(true);
    setCoinData(null);
    setTransactionLink(null);
  };

  const formatLink = (link) => {
    console.log("Formatting link:", link);
    return link.trim();
  };

  const fetchTweetMetadata = async (twitterLink) => {
    const response = await fetch(process.env.NEXT_PUBLIC_FETCH_TWEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ twitterLink }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tweet metadata: ${response.statusText}`);
    }

    return await response.json();
  };

  const fetchTokenMetadata = async (message) => {
    const chatResponse = await fetch(process.env.NEXT_PUBLIC_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const chatData = await chatResponse.json();
    const [ticker, name] = chatData.response.split('\n').map(line => line.split(': ')[1]);

    return { ticker, name };
  };

  const logTokenCreationDetails = (ticker, name) => {
    console.log("API Response - Ticker:", ticker, "Name:", name);
  };

  const selectImage = (mediaUrl, profileImageUrl) => {
    return mediaUrl || profileImageUrl;
  };

  // Function to create PumpFun token
  const createPumpFunToken = async ({ ticker, name, description, mediaUrl, viewLink }) => {
    try {
      logTokenDetails(ticker, name, description, mediaUrl);

      const tweetLink = await postTweet(ticker, name, viewLink);
      setCoinData(prev => ({ ...prev, tweetLink }));

      const metadataUri = await uploadToIPFS({ name, ticker, description, mediaUrl });

      await deployToken({ ticker, name, metadataUri });
    } catch (error) {
      handleError("Error uploading to IPFS or creating token", error);
    }
  };

  const logTokenDetails = (ticker, name, description, mediaUrl) => {
    console.log("Creating PumpFun token with:", { ticker, name, description, mediaUrl });
  };

  const postTweet = async (name, ticker, viewLink) => {
    const response = await fetch(process.env.NEXT_PUBLIC_POST_TWEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ticker, link: viewLink }),
    });

    if (!response.ok) {
      throw new Error(`Failed to post tweet: ${response.statusText}`);
    }

    const tweetData = await response.json();
    return `https://twitter.com/TweetifySOL/status/${tweetData.tweetId}`;
  };

  const uploadToIPFS = async ({ name, ticker, description, mediaUrl }) => {
    const metadataResponse = await axios.post(process.env.NEXT_PUBLIC_IPFS_UPLOAD_URL, {
      name, symbol: ticker, description, twitter: "", website: "", telegram: '', showName: "true", imageUrl: mediaUrl,
    });

    if (metadataResponse.status !== 200) {
      throw new Error(`Failed to upload metadata to IPFS: ${metadataResponse.statusText}`);
    }

    return metadataResponse.data.metadataUri;
  };

  const deployToken = async ({ ticker, name, metadataUri }) => {
    const signerKeyPair = Keypair.fromSecretKey(bs58.decode(process.env.SIGNER_SECRET_KEY));
    const mintKeypair = Keypair.generate();

    const response = await fetch("https://pumpportal.fun/api/trade-local", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        publicKey: signerKeyPair.publicKey.toBase58(),
        action: "create",
        tokenMetadata: { name, symbol: ticker, uri: metadataUri },
        mint: mintKeypair.publicKey.toBase58(),
        denominatedInSol: "true",
        amount: 0,
        slippage: 10,
        priorityFee: 0.0005,
        pool: "pump",
      }),
    });

    if (response.status === 200) {
      const data = await response.arrayBuffer();
      const tx = VersionedTransaction.deserialize(new Uint8Array(data));
      tx.sign([mintKeypair, signerKeyPair]);
      const signature = await web3Connection.sendTransaction(tx);
      setTransactionLink(`https://solscan.io/tx/${signature}`);
    } else {
      throw new Error(`Failed to create token: ${response.statusText}`);
    }
  };

  const handleError = (message, error) => {
    console.error(message, error);
  };

  // Fetch the live feed data
  const fetchLiveFeed = async () => {
    setFeedLoading(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LIVE_FEED_URL);
      setLiveFeed(await response.json());
    } catch (error) {
      handleError('Error fetching live feed', error);
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveFeed();
    const intervalId = setInterval(fetchLiveFeed, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 bg-black text-white w-64 min-h-screen p-4">
        <Sidebar />
      </div>
      <div className="flex-1 min-h-screen ml-64 bg-gray-900 text-white flex flex-col items-center p-4 relative">
        <img src="/tweetify.png" alt="Tweetify Logo" className="absolute top-4 left-4 w-10 h-10" />
        <header className="w-full max-w-2xl flex items-center justify-center py-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Tweetify</h1>
        </header>
        <main className="w-full max-w-2xl mt-10">
          <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-lg shadow-md mb-4 flex items-start space-x-4">
            <img src="/tweetify2.png" alt="Profile" className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <label className="block text-lg font-semibold mb-2">What is happening?!</label>
              <input
                type="text"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter a Twitter link"
                required
              />
              <div className="flex justify-end mt-4">
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-full font-semibold hover:bg-blue-600">
                  Post
                </button>
              </div>
            </div>
          </form>

          {loading && <p className="text-center text-gray-400">Loading...</p>}

          {coinData && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-4">
              <div className="flex items-center space-x-3 mb-2">
                <img src={coinData.profileImageUrl} alt={coinData.username} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-bold">{coinData.username} <span className="text-gray-400">@{coinData.username}</span></p>
                  <p className="text-gray-400 text-sm">Just now</p>
                </div>
              </div>
              <div className="text-lg">
                <p><span className="font-semibold">Ticker:</span> {coinData.ticker}</p>
                <p><span className="font-semibold">Name:</span> {coinData.name}</p>
                {coinData.tweetLink && (
                  <p className="text-blue-400 mt-2">
                    <a href={coinData.tweetLink} target="_blank" rel="noopener noreferrer">
                      View Tweetified Post
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}

          {transactionLink && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md mt-4 text-center">
              <p className="text-lg font-semibold">Transaction Created!</p>
              <a href={transactionLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                View on Solscan
              </a>
            </div>
          )}

          <hr className="w-full border-gray-700 my-8" />

          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Tweetified Feed</h2>
            {feedLoading && <p className="text-center text-gray-400">Loading live feed...</p>}
            {liveFeed.map((coin) => (
              <div key={coin.mint} className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                <div className="flex items-start space-x-4">
                  <img src={coin.image_uri} alt={coin.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-bold text-lg">{coin.name}</p>
                      <span className="text-gray-400">@{coin.symbol}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{coin.description}</p>
                    <div className="mt-2 text-gray-400 text-sm">
                      <p>Market Cap: ${coin.usd_market_cap ? coin.usd_market_cap.toFixed(2) : 'N/A'}</p>
                      <p>Total Supply: {coin.total_supply ? coin.total_supply.toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
