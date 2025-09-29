import {
  EnvironmentStrategy,
  getCdnConfig,
  SnapkitConfig,
  SnapkitEnvConfig,
} from '@snapkit-studio/core';

/**
 * Next.js-specific strategy that ONLY uses NEXT_PUBLIC_ variables
 * This strategy always takes precedence in Next.js environment
 */
const nextjsStrategy: EnvironmentStrategy = {
  name: 'nextjs',
  getEnvVar: (name: string) => {
    // Next.js requires explicit environment variable references for build-time replacement
    switch (name) {
      case 'SNAPKIT_ORGANIZATION':
        return process.env.NEXT_PUBLIC_SNAPKIT_ORGANIZATION;
      case 'SNAPKIT_ORGANIZATION_NAME':
        return process.env.NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME;
      case 'SNAPKIT_DEFAULT_QUALITY':
        return process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY;
      case 'SNAPKIT_DEFAULT_OPTIMIZE_FORMAT':
        return process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT;
      case 'IMAGE_CDN_PROVIDER':
        return process.env.NEXT_PUBLIC_IMAGE_CDN_PROVIDER;
      case 'IMAGE_CDN_URL':
        return process.env.NEXT_PUBLIC_IMAGE_CDN_URL;
      default:
        return undefined;
    }
  },
  detect: () => true, // Always use this strategy in Next.js package
};

/**
 * Next.js-specific validation for environment configuration
 * Validates NEXT_PUBLIC_ prefixed environment variables with clear error messages
 */
function validateNextjsEnvConfig(envConfig: SnapkitEnvConfig): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Organization name validation (required)
  if (!envConfig.SNAPKIT_ORGANIZATION_NAME) {
    errors.push(
      'NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME is not set. This environment variable is required for image optimization.',
    );
  }

  // Quality validation (optional)
  if (envConfig.SNAPKIT_DEFAULT_QUALITY !== undefined) {
    const quality = envConfig.SNAPKIT_DEFAULT_QUALITY;
    if (isNaN(quality) || quality < 1 || quality > 100) {
      errors.push(
        'NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY must be a number between 1 and 100',
      );
    }
  }

  // Format validation (optional)
  if (envConfig.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT) {
    const validFormats = ['avif', 'webp', 'auto', 'off'];
    if (!validFormats.includes(envConfig.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT)) {
      errors.push(
        `NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT must be one of: ${validFormats.join(', ')}`,
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
 * Parse environment config with Next.js specific validation
 * Only reads NEXT_PUBLIC_ prefixed environment variables
 */
export function parseEnvConfig(): SnapkitConfig {
  const cdnConfig = getCdnConfig(nextjsStrategy);

  // Get additional env config values using the strategy
  const envConfig: SnapkitEnvConfig = {
    SNAPKIT_ORGANIZATION_NAME: nextjsStrategy.getEnvVar(
      'SNAPKIT_ORGANIZATION_NAME',
    ),
    SNAPKIT_DEFAULT_QUALITY: nextjsStrategy.getEnvVar('SNAPKIT_DEFAULT_QUALITY')
      ? Number(nextjsStrategy.getEnvVar('SNAPKIT_DEFAULT_QUALITY'))
      : undefined,
    SNAPKIT_DEFAULT_OPTIMIZE_FORMAT: nextjsStrategy.getEnvVar(
      'SNAPKIT_DEFAULT_OPTIMIZE_FORMAT',
    ) as 'avif' | 'webp' | 'auto' | undefined,
  };

  // Use Next.js-specific validation
  const { isValid, errors, warnings } = validateNextjsEnvConfig(envConfig);

  if (warnings.length > 0) {
    console.warn(`Next.js environment warnings:\n  ${warnings.join('\n  ')}`);
  }

  if (!isValid) {
    throw new Error(
      `Invalid Next.js environment variables:\n  ${errors.join('\n  ')}\n\n` +
        `Please set the required environment variables in your .env.local file:\n` +
        `  NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME=your-org-name`,
    );
  }

  return {
    cdnConfig,
    defaultQuality: envConfig.SNAPKIT_DEFAULT_QUALITY || 85,
    defaultFormat: envConfig.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT || 'auto',
  };
}

/**
 * Merge environment variables and props to return final configuration
 * Uses strict validation for Next.js environment with NEXT_PUBLIC_ variables only
 */
export function mergeConfigWithEnv(
  propsConfig: Partial<SnapkitConfig>,
): SnapkitConfig {
  const cdnConfig = propsConfig.cdnConfig || getCdnConfig(nextjsStrategy);

  // Get additional env config values using the strategy
  const envConfig: SnapkitEnvConfig = {
    SNAPKIT_ORGANIZATION_NAME: nextjsStrategy.getEnvVar(
      'SNAPKIT_ORGANIZATION_NAME',
    ),
    SNAPKIT_DEFAULT_QUALITY: nextjsStrategy.getEnvVar('SNAPKIT_DEFAULT_QUALITY')
      ? Number(nextjsStrategy.getEnvVar('SNAPKIT_DEFAULT_QUALITY'))
      : undefined,
    SNAPKIT_DEFAULT_OPTIMIZE_FORMAT: nextjsStrategy.getEnvVar(
      'SNAPKIT_DEFAULT_OPTIMIZE_FORMAT',
    ) as 'avif' | 'webp' | 'auto' | undefined,
  };

  const { isValid, errors, warnings } = validateNextjsEnvConfig(envConfig);

  if (warnings.length > 0) {
    console.warn(`Next.js environment warnings:\n  ${warnings.join('\n  ')}`);
  }

  if (!isValid) {
    throw new Error(
      `Invalid Next.js environment variables:\n  ${errors.join('\n  ')}`,
    );
  }

  return {
    cdnConfig,
    defaultQuality:
      propsConfig.defaultQuality ?? envConfig.SNAPKIT_DEFAULT_QUALITY ?? 85,
    defaultFormat:
      propsConfig.defaultFormat ??
      envConfig.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT ??
      'auto',
  };
}

/**
 * Validate environment configuration with Next.js strict mode
 * Only validates NEXT_PUBLIC_ prefixed environment variables
 */
export function validateEnvConfig() {
  const envConfig: SnapkitEnvConfig = {
    SNAPKIT_ORGANIZATION_NAME: nextjsStrategy.getEnvVar(
      'SNAPKIT_ORGANIZATION_NAME',
    ),
    SNAPKIT_DEFAULT_QUALITY: nextjsStrategy.getEnvVar('SNAPKIT_DEFAULT_QUALITY')
      ? Number(nextjsStrategy.getEnvVar('SNAPKIT_DEFAULT_QUALITY'))
      : undefined,
    SNAPKIT_DEFAULT_OPTIMIZE_FORMAT: nextjsStrategy.getEnvVar(
      'SNAPKIT_DEFAULT_OPTIMIZE_FORMAT',
    ) as 'avif' | 'webp' | 'auto' | undefined,
  };
  return validateNextjsEnvConfig(envConfig);
}
