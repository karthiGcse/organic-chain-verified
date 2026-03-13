

# OrganicChain — Blockchain Traceability Platform

## Overview
A premium AgTech SaaS platform connecting organic produce to blockchain-verified supply chains. 5 pages with MetaMask wallet integration, smart contract interactions via ethers.js v6, and a polished glassmorphism UI.

## Design System
- **Colors:** Deep forest green (#1A5C38), mint (#4ADE80), white, dark (#0A0F0D), gold (#F59E0B)
- **Fonts:** Plus Jakarta Sans (headings) + Inter (body) via Google Fonts
- **Style:** Glassmorphism cards with backdrop-blur, subtle green/gold gradient orbs, smooth fade/scale animations
- **Responsive:** Mobile-first with hamburger nav

## Pages & Features

### 1. Home Page (/)
- Hero section: "Know Exactly Where Your Food Comes From" with CTA buttons
- 5-step horizontal timeline: Farm → Harvest → Transport → Storage → Retail with emoji icons
- Stats counters (10,000+ Products Tracked, etc.)
- Features grid with icons (Transparency, Certification, Real-time Tracking, etc.)
- Testimonials carousel
- Footer with links

### 2. Farmer Dashboard (/dashboard)
- Dark sidebar navigation with collapsible icon mode
- Stats cards (Total Products, Verified, Pending)
- **Register Farmer form** → calls `registerFarmer()` on-chain
- **Add Product form** (Name, Location, Harvest Date, Cert Number, Category, Image Upload) → calls `addProduct()`
- Products table loaded from `getFarmerProducts()` with status badges (pill-shaped)
- All form submissions show loading spinner, disable button, display tx hash with Etherscan link on success

### 3. Supply Chain Tracker (/tracker)
- Search input for Product ID
- Vertical timeline with green connecting line and emoji nodes (🌱✂️🚛🏭🏪)
- Each node shows: stage name, location, date, handler, blockchain hash (monospace)
- "Add New Stage" dialog → calls `addStage()`
- Timeline loaded from `getSupplyChain()`

### 4. QR Code Page (/qr)
- Product ID input
- Generate QR button → calls `generateQR()` on-chain, then renders QR code client-side (qrcode library)
- Download QR as PNG button
- Print Label button
- QR links to `/verify/{productId}`

### 5. Consumer Verify Page (/verify/:productId)
- Clean, consumer-friendly layout (no wallet required for read calls)
- Green verified checkmark with organic status from `verifyOrganic()`
- Product details card from `getProduct()`
- Full supply chain timeline (same vertical style as tracker)
- Gold certification badge
- Trust banner: "Verified on Ethereum Blockchain"

## Blockchain Integration
- **ethers.js v6** for all contract interactions
- **Contract:** `0x61e56d103678d0e0e75c86f90Bb9FdF0c5CD65f3` on Sepolia (Chain ID: 11155111)
- **Wallet context** providing connect/disconnect, address display (truncated), ETH balance
- **Connect Wallet** button in navbar with MetaMask detection
- **TX UX:** Loading overlay on pending tx → success toast with tx hash (linked to Sepolia Etherscan) → error toast on failure
- **QR code generation** using `qrcode.react` library for client-side rendering

## Technical Approach
- React Router for 5 routes
- Shared `Web3Context` provider for wallet state and contract instance
- Sidebar layout component for dashboard pages
- Full-width layout for public pages (Home, Verify, QR)
- Install: `ethers` (v6), `qrcode.react`
- All contract ABI stored in a constants file

