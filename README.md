# AlgoZ - Advanced Algorithmic Trading Platform

## Overview

AlgoZ is a powerful algorithmic trading platform designed to automate trading strategies across multiple financial markets. Our platform connects to various brokers and exchanges, allowing traders to execute strategies based on technical indicators, market data, and custom algorithms.

## Features

### Trading Capabilities
- **TradingView Integration**: Execute trades directly from TradingView charts using webhooks
- **Scalping Tools**: High-frequency trading tools optimized for short-term positions
- **Copy Trading**: Follow and automatically replicate trades from successful traders
- **Strategy Builder**: Create custom trading strategies using Pine Script, MQL, and AFL

### Platform Benefits
- **Broker Authentication**: Secure connection to multiple brokers and exchanges
- **Real-time Analytics**: Monitor performance metrics and trading history
- **Risk Management**: Set stop-loss, take-profit, and position sizing rules
- **Automated Execution**: Run strategies 24/7 without manual intervention

## Technology Stack

### Frontend
- Next.js (React framework)
- TypeScript
- Tailwind CSS
- Radix UI components

### Backend
- Node.js
- Express.js
- MongoDB
- JWT authentication
- WebSocket for real-time data

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- API keys for supported brokers

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/algo_Z.git
cd algo_Z
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
   - Create `.env` files in both frontend and backend directories
   - Configure database connection, API keys, and authentication settings

5. Start development servers
```bash
# In backend directory
npm run dev

# In frontend directory
npm run dev
```

6. Access the application at `http://localhost:3000`

## Deployment

For production deployment instructions, please refer to the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) file.

## Support

For technical support or feature requests, please contact our support team at support@algoz.com or visit the FAQ section in the application.

## License

Copyright © 2023 AlgoZ. All rights reserved.