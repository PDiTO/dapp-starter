import * as chains from "viem/chains";

// Map of chain names to chain objects
const chainMap: Record<string, chains.Chain> = {
  // Mainnets
  mainnet: chains.mainnet,
  polygon: chains.polygon,
  arbitrum: chains.arbitrum,
  optimism: chains.optimism,
  base: chains.base,
  avalanche: chains.avalanche,
  bsc: chains.bsc,
  gnosis: chains.gnosis,
  
  // Testnets
  sepolia: chains.sepolia,
  holesky: chains.holesky,
  polygonAmoy: chains.polygonAmoy,
  polygonMumbai: chains.polygonMumbai,
  arbitrumSepolia: chains.arbitrumSepolia,
  arbitrumGoerli: chains.arbitrumGoerli,
  optimismSepolia: chains.optimismSepolia,
  optimismGoerli: chains.optimismGoerli,
  baseSepolia: chains.baseSepolia,
  avalancheFuji: chains.avalancheFuji,
  bscTestnet: chains.bscTestnet,
  
  // Layer 2s
  zora: chains.zora,
  zoraSepolia: chains.zoraSepolia,
  scroll: chains.scroll,
  scrollSepolia: chains.scrollSepolia,
  mantle: chains.mantle,
  mantleTestnet: chains.mantleTestnet,
};

/**
 * Get a chain object by its name
 */
export function getChainByName(chainName: string): chains.Chain {
  const chain = chainMap[chainName];
  if (!chain) {
    throw new Error(
      `Chain "${chainName}" not found. Available chains: ${Object.keys(chainMap).join(", ")}`
    );
  }
  return chain;
}

/**
 * Parse multiple chain names from a comma-separated string
 */
export function parseChains(chainsString: string): chains.Chain[] {
  return chainsString
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
    .map(getChainByName);
}

/**
 * Get the default chain from environment variable
 */
export function getDefaultChain(): chains.Chain {
  const defaultChainName = process.env.NEXT_PUBLIC_DEFAULT_CHAIN || "arbitrumSepolia";
  return getChainByName(defaultChainName);
}

/**
 * Get supported chains from environment variable
 */
export function getSupportedChains(): chains.Chain[] {
  const supportedChainsString = process.env.NEXT_PUBLIC_SUPPORTED_CHAINS || "arbitrumSepolia";
  return parseChains(supportedChainsString);
}