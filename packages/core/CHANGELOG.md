# @snapkit-studio/core

## 1.9.2

### Patch Changes

- chore: release stable version 1.9.2

## 1.9.2-rc.2

### Patch Changes

- Test canary dependency resolution improvements

## 1.9.2-rc.1

### Patch Changes

- Improve canary dependency resolution for testing

## 1.9.2-rc.0

### Patch Changes

- 3e7e59b: Fix canary release dependency resolution
  - Improve prepare-release script to handle canary versions correctly
  - Ensure canary packages reference each other with exact versions
  - Fix npm installation issues in test environments

- 531635d: Test canary release process

## 1.9.1

### Patch Changes

- 471cffd: test: verify automated release workflow improvements

  This changeset tests the complete automation of the release workflow including:
  - Git tag creation and push
  - GitHub release generation
  - NPM and GitHub Package Registry deployment
  - Prerelease version filtering

  All packages should be bumped to test the improved CI/CD pipeline.

## 1.9.0

### Patch Changes

- fix(ci): improve GitHub Package Registry publishing to skip prerelease versions
  - Add version filtering to only publish stable releases to GitHub Package Registry
  - Skip prerelease versions (canary, alpha, beta) with clear logging messages
  - Prevent 409 Conflict errors when attempting to republish existing prerelease versions
  - Improve deployment logging with version information and skip reasons
