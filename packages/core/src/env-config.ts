/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable turbo/no-undeclared-env-vars */
import { CdnConfig, CdnProvider } from './types';

/**
 * Environment configuration strategy for different React environments
 */
export interface EnvironmentStrategy {
  /** Environment name for debugging */
  name: string;
  /** Function to get environment variable by name */
  getEnvVar: (name: string) => string | undefined;
  /** Function to validate if this strategy should be used */
  detect: () => boolean;
}

/**
 * Built-in environment strategies
 */
export const environmentStrategies: EnvironmentStrategy[] = [
  // Vite environment - uses import.meta.env
  {
    name: 'vite',
    getEnvVar: (name: string) => {
      // @ts-expect-error import.meta is not available in Node.js
      if (typeof import.meta === 'undefined' || !import.meta.env) {
        return undefined;
      }

      switch (name) {
        case 'IMAGE_CDN_PROVIDER':
          // @ts-expect-error
          return import.meta.env.VITE_IMAGE_CDN_PROVIDER;
        case 'IMAGE_CDN_URL':
          // @ts-expect-error
          return import.meta.env.VITE_IMAGE_CDN_URL;
        case 'SNAPKIT_ORGANIZATION':
          // @ts-expect-error
          return import.meta.env.VITE_SNAPKIT_ORGANIZATION;
        default:
          return undefined;
      }
    },
    detect: () => {
      return (
        typeof import.meta !== 'undefined' &&
        // @ts-expect-error
        import.meta.env?.MODE !== undefined
      );
    },
  },
  // Create React App
  {
    name: 'cra',
    getEnvVar: (name: string) => {
      switch (name) {
        case 'IMAGE_CDN_PROVIDER':
          return process.env.REACT_APP_IMAGE_CDN_PROVIDER;
        case 'IMAGE_CDN_URL':
          return process.env.REACT_APP_IMAGE_CDN_URL;
        case 'SNAPKIT_ORGANIZATION':
          return process.env.REACT_APP_SNAPKIT_ORGANIZATION;
        default:
          return undefined;
      }
    },
    detect: () =>
      typeof process !== 'undefined' && !!process.env.REACT_APP_VERSION,
  },
  // Next.js environment
  {
    name: 'nextjs',
    getEnvVar: (name: string) => {
      switch (name) {
        case 'IMAGE_CDN_PROVIDER':
          return process.env.NEXT_PUBLIC_IMAGE_CDN_PROVIDER;
        case 'IMAGE_CDN_URL':
          return process.env.NEXT_PUBLIC_IMAGE_CDN_URL;
        case 'SNAPKIT_ORGANIZATION':
          return process.env.NEXT_PUBLIC_SNAPKIT_ORGANIZATION;
        default:
          return undefined;
      }
    },
    detect: () =>
      typeof process !== 'undefined' &&
      (!!process.env.NEXT_PHASE || !!process.env.NEXT_PUBLIC_VERCEL_URL),
  },
  // Node.js / plain environment (fallback)
  {
    name: 'nodejs',
    getEnvVar: (name: string) => {
      switch (name) {
        case 'IMAGE_CDN_PROVIDER':
          return process.env.IMAGE_CDN_PROVIDER;
        case 'IMAGE_CDN_URL':
          return process.env.IMAGE_CDN_URL;
        case 'SNAPKIT_ORGANIZATION':
          return process.env.SNAPKIT_ORGANIZATION;
        default:
          return undefined;
      }
    },
    detect: () => typeof process !== 'undefined',
  },
];

/**
 * Universal environment strategy that tries multiple prefixes
 */
export const universalStrategy: EnvironmentStrategy = {
  name: 'universal',
  getEnvVar: (name: string) => {
    // Try Vite first
    // @ts-expect-error import.meta is not available in Node.js
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (name === 'IMAGE_CDN_PROVIDER') {
        // @ts-expect-error
        return import.meta.env.VITE_IMAGE_CDN_PROVIDER;
      }
      if (name === 'IMAGE_CDN_URL') {
        // @ts-expect-error
        return import.meta.env.VITE_IMAGE_CDN_URL;
      }
      if (name === 'SNAPKIT_ORGANIZATION') {
        // @ts-expect-error
        return import.meta.env.VITE_SNAPKIT_ORGANIZATION;
      }
    }

    // Fall back to process.env
    if (typeof process === 'undefined') return undefined;

    if (name === 'IMAGE_CDN_PROVIDER') {
      return (
        process.env.REACT_APP_IMAGE_CDN_PROVIDER ||
        process.env.NEXT_PUBLIC_IMAGE_CDN_PROVIDER ||
        process.env.IMAGE_CDN_PROVIDER
      );
    }
    if (name === 'IMAGE_CDN_URL') {
      return (
        process.env.REACT_APP_IMAGE_CDN_URL ||
        process.env.NEXT_PUBLIC_IMAGE_CDN_URL ||
        process.env.IMAGE_CDN_URL
      );
    }
    if (name === 'SNAPKIT_ORGANIZATION') {
      return (
        process.env.REACT_APP_SNAPKIT_ORGANIZATION ||
        process.env.NEXT_PUBLIC_SNAPKIT_ORGANIZATION ||
        process.env.SNAPKIT_ORGANIZATION
      );
    }

    return undefined;
  },
  detect: () => {
    // @ts-expect-error import.meta is not available in Node.js
    if (typeof import.meta !== 'undefined' && import.meta.env) return true;
    return typeof process !== 'undefined';
  },
};

/**
 * Get CDN configuration from environment variables
 */
export function getCdnConfig(
  strategy: EnvironmentStrategy = universalStrategy,
): CdnConfig {
  if (!strategy.detect()) {
    throw new Error('Environment detection failed');
  }

  const provider = (strategy.getEnvVar('IMAGE_CDN_PROVIDER') ||
    'snapkit') as CdnProvider;

  if (provider === 'snapkit') {
    const organizationName = strategy.getEnvVar('SNAPKIT_ORGANIZATION');
    if (!organizationName) {
      throw new Error(
        'SNAPKIT_ORGANIZATION is required when IMAGE_CDN_PROVIDER is "snapkit"',
      );
    }
    return {
      provider: 'snapkit',
      organizationName,
    };
  }

  if (provider === 'custom') {
    const baseUrl = strategy.getEnvVar('IMAGE_CDN_URL');
    if (!baseUrl) {
      throw new Error(
        'IMAGE_CDN_URL is required when IMAGE_CDN_PROVIDER is "custom"',
      );
    }
    return {
      provider: 'custom',
      baseUrl,
    };
  }

  throw new Error(`Unsupported CDN provider: ${provider}`);
}

/**
 * Detect current environment and return appropriate strategy
 */
export function detectEnvironment(): EnvironmentStrategy {
  for (const strategy of environmentStrategies) {
    if (strategy.detect()) {
      return strategy;
    }
  }
  return universalStrategy;
}

/**
 * Get environment debug information
 */
export function getEnvironmentDebugInfo(): {
  detectedStrategy: string;
  availableVars: Record<string, string | undefined>;
  allStrategies: Array<{ name: string; detected: boolean }>;
} {
  const detectedStrategy = detectEnvironment();

  return {
    detectedStrategy: detectedStrategy.name,
    availableVars: {
      IMAGE_CDN_PROVIDER: detectedStrategy.getEnvVar('IMAGE_CDN_PROVIDER'),
      IMAGE_CDN_URL: detectedStrategy.getEnvVar('IMAGE_CDN_URL'),
      SNAPKIT_ORGANIZATION: detectedStrategy.getEnvVar('SNAPKIT_ORGANIZATION'),
    },
    allStrategies: environmentStrategies.map((strategy) => ({
      name: strategy.name,
      detected: strategy.detect(),
    })),
  };
}
