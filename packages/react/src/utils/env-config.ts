/**
 * Re-export from core package for backward compatibility
 *
 * This file is maintained to preserve API compatibility with existing projects
 * that import environment configuration utilities from @snapkit-studio/react.
 * The actual implementation is now centralized in @snapkit-studio/core.
 */
export {
  mergeConfigWithEnv,
  getEnvConfig,
  validateEnvConfig,
  detectEnvironment,
  getEnvironmentDebugInfo,
  universalStrategy,
} from '@snapkit-studio/core';
