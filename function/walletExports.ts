import { mainnet, polygon, arbitrum, sepolia } from '@wagmi/core/chains';
import { defaultWagmiConfig } from '@web3modal/wagmi-react-native';

const projectId = 'af21521794137bf96ff2ad602ac95493';

const metadata = {
    name: 'Your App',
    description: 'Your App Description',
    url: 'https://your-app.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    redirect: {
      native: 'yourapp://',
      universal: 'https://your-universal-link.com',
    },
  };

const chains = [mainnet, sepolia] as const;

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

export default wagmiConfig;