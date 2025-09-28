/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable turbo/no-undeclared-env-vars */
import { SnapkitConfig, SnapkitEnvConfig } from './types';

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
      // Vite uses import.meta.env with explicit references for build-time replacement
      // @ts-expect-error import.meta is not available in Node.js
      if (typeof import.meta === 'undefined' || !import.meta.env) {
        return undefined;
      }

      switch (name) {
        case 'SNAPKIT_ORGANIZATION_NAME':
          // @ts-expect-error
          return import.meta.env.VITE_SNAPKIT_ORGANIZATION_NAME;
        case 'SNAPKIT_DEFAULT_QUALITY':
          // @ts-expect-error
          return import.meta.env.VITE_SNAPKIT_DEFAULT_QUALITY;
        case 'SNAPKIT_DEFAULT_OPTIMIZE_FORMAT':
          // @ts-expect-error
          return import.meta.env.VITE_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT;
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
      // CRA requires explicit environment variable references for build-time replacement
      switch (name) {
        case 'SNAPKIT_ORGANIZATION_NAME':
          return process.env.REACT_APP_SNAPKIT_ORGANIZATION_NAME;
        case 'SNAPKIT_DEFAULT_QUALITY':
          return process.env.REACT_APP_SNAPKIT_DEFAULT_QUALITY;
        case 'SNAPKIT_DEFAULT_OPTIMIZE_FORMAT':
          return process.env.REACT_APP_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT;
        default:
          return undefined;
      }
    },
    detect: () =>
      typeof process !== 'undefined' && !!process.env.REACT_APP_VERSION,
  },
  // Next.js environment (both local and Vercel)
  {
    name: 'nextjs',
    getEnvVar: (name: string) => {
      // Next.js requires explicit environment variable references for build-time replacement
      switch (name) {
        case 'SNAPKIT_ORGANIZATION_NAME':
          return process.env.NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME;
        case 'SNAPKIT_DEFAULT_QUALITY':
          return process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY;
        case 'SNAPKIT_DEFAULT_OPTIMIZE_FORMAT':
          return process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT;
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
      // Node.js can use direct environment variable access
      switch (name) {
        case 'SNAPKIT_ORGANIZATION_NAME':
          return process.env.SNAPKIT_ORGANIZATION_NAME;
        case 'SNAPKIT_DEFAULT_QUALITY':
          return process.env.SNAPKIT_DEFAULT_QUALITY;
        case 'SNAPKIT_DEFAULT_OPTIMIZE_FORMAT':
          return process.env.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT;
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
    // Try Vite first (import.meta.env)
    // @ts-expect-error import.meta is not available in Node.js
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (name === 'SNAPKIT_ORGANIZATION_NAME') {
        // @ts-expect-error
        return import.meta.env.VITE_SNAPKIT_ORGANIZATION_NAME;
      }
      if (name === 'SNAPKIT_DEFAULT_QUALITY') {
        // @ts-expect-error
        return import.meta.env.VITE_SNAPKIT_DEFAULT_QUALITY;
      }
      if (name === 'SNAPKIT_DEFAULT_OPTIMIZE_FORMAT') {
        // @ts-expect-error
        return import.meta.env.VITE_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT;
      }
    }

    // Fall back to process.env for other environments
    if (typeof process === 'undefined') return undefined;

    // Try each prefix in order
    // For Next.js and CRA, we need explicit references for build-time replacement
    if (name === 'SNAPKIT_ORGANIZATION_NAME') {
      return (
        process.env.REACT_APP_SNAPKIT_ORGANIZATION_NAME ||
        process.env.NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME ||
        process.env.SNAPKIT_ORGANIZATION_NAME
      );
    }
    if (name === 'SNAPKIT_DEFAULT_QUALITY') {
      return (
        process.env.REACT_APP_SNAPKIT_DEFAULT_QUALITY ||
        process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY ||
        process.env.SNAPKIT_DEFAULT_QUALITY
      );
    }
    if (name === 'SNAPKIT_DEFAULT_OPTIMIZE_FORMAT') {
      return (
        process.env.REACT_APP_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT ||
        process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT ||
        process.env.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT
      );
    }

    // Fallback for any other variables
    return (
      process.env[`REACT_APP_${name}`] ||
      process.env[`NEXT_PUBLIC_${name}`] ||
      process.env[name]
    );
  },
  detect: () => {
    // @ts-expect-error import.meta is not available in Node.js
    if (typeof import.meta !== 'undefined' && import.meta.env) return true;
    return typeof process !== 'undefined';
  },
};

/**
 * Get environment configuration using a specific strategy
 */
export function getEnvConfig(
  strategy: EnvironmentStrategy = universalStrategy,
): SnapkitEnvConfig {
  if (!strategy.detect()) {
    return {};
  }

  const getEnvVarAsNumber = (name: string): number | undefined => {
    const value = strategy.getEnvVar(name);
    const parsed = value ? parseInt(value, 10) : undefined;
    return parsed && !isNaN(parsed) ? parsed : undefined;
  };

  return {
    SNAPKIT_ORGANIZATION_NAME: strategy.getEnvVar('SNAPKIT_ORGANIZATION_NAME'),
    SNAPKIT_DEFAULT_QUALITY: getEnvVarAsNumber('SNAPKIT_DEFAULT_QUALITY'),
    SNAPKIT_DEFAULT_OPTIMIZE_FORMAT: strategy.getEnvVar(
      'SNAPKIT_DEFAULT_OPTIMIZE_FORMAT',
    ) as 'auto' | 'avif' | 'webp' | undefined,
  };
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
 * Get framework-specific environment variable name
 */
function getFrameworkEnvVarName(baseName: string, strategy?: EnvironmentStrategy): string {
  const currentStrategy = strategy || detectEnvironment();

  switch (currentStrategy.name) {
    case 'vite':
      return `VITE_${baseName}`;
    case 'cra':
      return `REACT_APP_${baseName}`;
    case 'nextjs':
      return `NEXT_PUBLIC_${baseName}`;
    default:
      return baseName;
  }
}

/**
 * Validate environment configuration
 */
export function validateEnvConfig(
  envConfig: SnapkitEnvConfig = getEnvConfig(),
  strict: boolean = false,
  strategy?: EnvironmentStrategy,
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Organization name validation with framework-specific message
  if (!envConfig.SNAPKIT_ORGANIZATION_NAME) {
    const envVarName = getFrameworkEnvVarName('SNAPKIT_ORGANIZATION_NAME', strategy);
    const message = `${envVarName} is not set. Image optimization requires this environment variable.`;

    if (strict) {
      errors.push(message);
    } else {
      warnings.push(message);
    }
  }

  // Quality validation with framework-specific message
  if (envConfig.SNAPKIT_DEFAULT_QUALITY !== undefined) {
    const quality = envConfig.SNAPKIT_DEFAULT_QUALITY;
    if (isNaN(quality) || quality < 1 || quality > 100) {
      const envVarName = getFrameworkEnvVarName('SNAPKIT_DEFAULT_QUALITY', strategy);
      errors.push(`${envVarName} must be a number between 1 and 100`);
    }
  }

  // Format validation with framework-specific message
  if (envConfig.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT) {
    const validFormats = ['avif', 'webp', 'auto', 'off'];
    if (!validFormats.includes(envConfig.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT)) {
      const envVarName = getFrameworkEnvVarName('SNAPKIT_DEFAULT_OPTIMIZE_FORMAT', strategy);
      errors.push(
        `${envVarName} must be one of: ${validFormats.join(', ')}`,
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Merge environment variables and props to return final configuration
 * Props take priority over environment variables
 */
export function mergeConfigWithEnv(
  propsConfig: Partial<SnapkitConfig>,
  strategy: EnvironmentStrategy = universalStrategy,
  strict: boolean = false,
): SnapkitConfig {
  const envConfig = getEnvConfig(strategy);

  // Validate environment config if strict mode is enabled
  if (strict) {
    const { isValid, errors, warnings } = validateEnvConfig(envConfig, strict, strategy);

    if (warnings.length > 0) {
      console.warn(`Environment warnings:\n  ${warnings.join('\n  ')}`);
    }

    if (!isValid) {
      throw new Error(`Invalid environment variables:\n  ${errors.join('\n  ')}`);
    }
  }

  const organizationName =
    propsConfig.organizationName ?? envConfig.SNAPKIT_ORGANIZATION_NAME;

  if (typeof organizationName === 'undefined') {
    const envVarName = getFrameworkEnvVarName('SNAPKIT_ORGANIZATION_NAME', strategy);
    throw new Error(
      `${envVarName} is not set. Image optimization requires this environment variable.`,
    );
  }

  return {
    organizationName,
    defaultQuality:
      propsConfig.defaultQuality ?? envConfig.SNAPKIT_DEFAULT_QUALITY ?? 85,
    defaultFormat:
      propsConfig.defaultFormat ??
      envConfig.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT ??
      'auto',
  };
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
  const envConfig = getEnvConfig(detectedStrategy);

  return {
    detectedStrategy: detectedStrategy.name,
    availableVars: {
      SNAPKIT_ORGANIZATION_NAME: envConfig.SNAPKIT_ORGANIZATION_NAME,
      SNAPKIT_DEFAULT_QUALITY: envConfig.SNAPKIT_DEFAULT_QUALITY?.toString(),
      SNAPKIT_DEFAULT_OPTIMIZE_FORMAT:
        envConfig.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT,
    },
    allStrategies: environmentStrategies.map((strategy) => ({
      name: strategy.name,
      detected: strategy.detect(),
    })),
  };
}
