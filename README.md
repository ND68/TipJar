# TipJar - A DeFi Tipping Widget
TipJar transforms traditional digital tipping into a transparent, gamified, and trustless payment system. Unlike sending crypto directly to a wallet, TipJar uses a Solidity smart contract to guarantee public record-keeping and instantaneous community recognition.

**Check out a live demo!** [View the deployed app here](https://tip-jar-three.vercel.app/)

## Overview

TipJar allows creators, streamers, and communities to accept Ethereum-based tips through a fully on-chain system.  
Each tip is recorded on the blockchain and publicly visible, creating a transparent, trustless feedback loop between creators and supporters.

The system consists of:
- **A Solidity smart contract factory** (`TipJarFactory.sol`) that deploys individual tip jar contracts (`TipJar.sol`) per owner.
- **An interactive React + Next.js frontend**, powered by Wagmi, Viem, and ConnectKit.
- **A leaderboard and live feed**, displaying all recent tips and top contributors.

## Core Features

### Trustless Tipping  
Funds go directly from supporter → creator without intermediaries or fees, recorded permanently on-chain (minus gas).

### Immutable Leaderboard  
All tips are logged in the TipJar contract and visualized in real time on the frontend.  
The leaderboard ranks supporters transparently, making recognition instant and verifiable.

### Public Messages  
Supporters can attach personalized, on-chain messages with their tips, strengthening community engagement.

### Embeddable Widget  
The TipJar component can be dropped into **any website** with one import — creators can integrate decentralized tipping without managing wallets or backend infrastructure.

### Multi-Contract Support  
Each creator can deploy their own TipJar instance using the `TipJarFactory` contract, isolating funds and records, and allowing for full ownership.

## Tech Stack

**Smart Contracts**
- Solidity  
- Sepolia Testnet Deployment  

**Frontend**
- Next.js (React)  
- TailwindCSS  
- Wagmi + Viem for on-chain interactions  
- ConnectKit for wallet integration  
- Vercel for deployment  
