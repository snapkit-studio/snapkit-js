# @snapkit-studio/nextjs

## 1.7.3

### Patch Changes

- chore: release stable version 1.9.2
- Updated dependencies
  - @snapkit-studio/core@1.9.2
  - @snapkit-studio/react@1.7.3

## 1.7.3-rc.2

### Patch Changes

- Test canary dependency resolution improvements
- Updated dependencies
  - @snapkit-studio/core@1.9.2-rc.2
  - @snapkit-studio/react@1.7.3-rc.2

## 1.7.3-rc.1

### Patch Changes

- Improve canary dependency resolution for testing
- Updated dependencies
  - @snapkit-studio/core@1.9.2-rc.1
  - @snapkit-studio/react@1.7.3-rc.1

## 1.7.3-rc.0

### Patch Changes

- 3e7e59b: Fix canary release dependency resolution
  - Improve prepare-release script to handle canary versions correctly
  - Ensure canary packages reference each other with exact versions
  - Fix npm installation issues in test environments

- 531635d: Test canary release process
- Updated dependencies [3e7e59b]
- Updated dependencies [531635d]
  - @snapkit-studio/core@1.9.2-rc.0
  - @snapkit-studio/react@1.7.3-rc.0

## 1.7.2

### Patch Changes

- ad0579e: feat(nextjs): enhance Next.js loader compatibility and performance
  - Improve compatibility with Next.js 14+ image optimization
  - Add support for additional image formats in loader
  - Optimize loader performance for large image sets
  - Enhanced integration with Next.js built-in image component
  - Test selective package release process

  This changeset tests independent Next.js package updating workflow.

## 1.7.1

### Patch Changes

- 471cffd: test: verify automated release workflow improvements

  This changeset tests the complete automation of the release workflow including:
  - Git tag creation and push
  - GitHub release generation
  - NPM and GitHub Package Registry deployment
  - Prerelease version filtering

  All packages should be bumped to test the improved CI/CD pipeline.

## 1.7.0

### Patch Changes

- fix(ci): improve GitHub Package Registry publishing to skip prerelease versions
  - Add version filtering to only publish stable releases to GitHub Package Registry
  - Skip prerelease versions (canary, alpha, beta) with clear logging messages
  - Prevent 409 Conflict errors when attempting to republish existing prerelease versions
  - Improve deployment logging with version information and skip reasons
