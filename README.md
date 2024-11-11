
# Tweetify Tokenizer

> Turn tweets into Solana-based tokens and view their metadata, transactions, and live feed using our engaging interface.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Adding a Twitter Template](#adding-a-twitter-template)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction
The **Tweetify Tokenizer** project allows users to transform tweets into tradable tokens on the Solana blockchain. With automated metadata fetching, token creation, and live feed updates, the project leverages the power of Solana for real-time transactions and user engagement.

## Features
- Fetch metadata from tweets automatically.
- Generate Solana tokens based on tweet content.
- Utilize IPFS for secure metadata storage.
- View live token activity feeds.
- User-friendly interface with a responsive design.

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v14.x or higher recommended)
- **npm** or **yarn**
- **GitHub Account** (if you want to fork/clone)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   or using yarn:
   ```bash
   yarn install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_RPC_ENDPOINT=your_rpc_endpoint_here
   NEXT_PUBLIC_FETCH_TWEET_URL=your_fetch_tweet_url_here
   NEXT_PUBLIC_CHAT_URL=your_chat_url_here
   NEXT_PUBLIC_POST_TWEET_URL=your_post_tweet_url_here
   NEXT_PUBLIC_IPFS_UPLOAD_URL=your_ipfs_upload_url_here
   NEXT_PUBLIC_LIVE_FEED_URL=your_live_feed_url_here
   SIGNER_SECRET_KEY=your_signer_secret_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   or using yarn:
   ```bash
   yarn dev
   ```

### Environment Variables
This project relies on several environment variables to function correctly:

- `NEXT_PUBLIC_RPC_ENDPOINT`: The Solana RPC endpoint for blockchain interactions.
- `NEXT_PUBLIC_FETCH_TWEET_URL`: API endpoint for fetching tweet metadata.
- `NEXT_PUBLIC_CHAT_URL`: API endpoint for retrieving token metadata via chat.
- `NEXT_PUBLIC_POST_TWEET_URL`: API endpoint for posting processed tweets.
- `NEXT_PUBLIC_IPFS_UPLOAD_URL`: API endpoint for uploading metadata to IPFS.
- `NEXT_PUBLIC_LIVE_FEED_URL`: URL for fetching live feed data of tokens.
- `SIGNER_SECRET_KEY`: Private key for signing transactions. **Note**: Do not expose this key if it should remain private.

## Usage
1. **Enter a Twitter Link**: Input a valid Twitter link in the designated input field.
2. **Process the Tweet**: Click the "Post" button to process and tokenize the tweet.
3. **View Token Details**: See the token’s ticker, name, metadata, and related transaction links.
4. **Live Feed**: Monitor token activity through the live feed section.

## Adding a Twitter Template
To enhance the tweet-to-token process, you can add a custom template for tweets:

1. **Create a Template File**:
   Add a `twitter-template.json` file in your `src` folder with the following structure:
   ```json
   {
     "template": "Customize token properties using this template."
   }
   ```

2. **Access and Apply the Template**:
   Import and use the template in your code:
   ```javascript
   import template from './twitter-template.json';

   const applyTemplate = (data) => {
     console.log(`Using template: ${template.template}`);
     // Apply the template logic here
   };
   ```

## Contributing
We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your meaningful commit message here"
   ```
4. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.

## License
This project is licensed under the MIT License. You are free to use, modify, and distribute this project under the terms of the license.
