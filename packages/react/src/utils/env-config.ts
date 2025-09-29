/**
 * Re-export from core package for backward compatibility
 *
 * This file is maintained to preserve API compatibility with existing projects
 * that import environment configuration utilities from @snapkit-studio/react.
 * The actual implementation is now centralized in @snapkit-studio/core.
 */
export {
  detectEnvironment,
  getEnvironmentDebugInfo,
  universalStrategy,
} from '@snapkit-studio/core';

import {
  getCdnConfig,
  SnapkitConfig,
} from '@snapkit-studio/core';

/**
 * Legacy function for backward compatibility
 * Now uses the new CDN configuration system
 */
export function mergeConfigWithEnv(
  propsConfig: Partial<SnapkitConfig>,
): SnapkitConfig {
  const cdnConfig = getCdnConfig();

  return {
    cdnConfig,
    defaultQuality: propsConfig.defaultQuality || 85,
    defaultFormat: propsConfig.defaultFormat || 'auto',
  };
}
