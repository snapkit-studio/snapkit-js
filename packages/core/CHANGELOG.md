# @snapkit-studio/core

## [Unreleased]

### BREAKING CHANGES

#### Query Parameter Format Update

The URL query parameter format has been updated to align with the image-proxy service structure.

**Old Format:**
```
?w=100&h=100&fit=cover&format=webp&blur=5&grayscale=true
```

**New Format:**
```
?transform=w:100,h:100,fit:cover,format:webp,blur:5,grayscale
```

**Changes:**
- All transform parameters are now wrapped in a single `transform` query parameter
- Parameters use colon (`:`) separator for key-value pairs: `key:value`
- Multiple parameters are joined with commas (`,`): `param1:value1,param2:value2`
- Boolean options (`flip`, `flop`, `grayscale`) appear without values
- Extract region uses hyphen (`-`) separator: `extract:x-y-width-height`

**Impact:**
- ✅ No code changes required - SDK handles URL generation internally
- ✅ TypeScript interfaces unchanged - `ImageTransforms` type remains the same
- ⚠️ URL parsing - If you manually parse generated URLs, update your logic
- ⚠️ CDN caching - URLs will generate new cache keys (gradual migration recommended)

### Added

- **URL-based transformations**: Support for external CDN URLs via `url` query parameter
  - Automatically detects complete URLs (starting with `http://` or `https://`)
  - Routes external URLs through `/image` endpoint with `url` parameter
  - Example: `https://your-org-cdn.snapkit.studio/image?url=https%3A%2F%2Fexternal-cdn.com%2Fimage.jpg&transform=w:800`
  - Enables transforming images from CloudFront, Google Cloud Storage, or any external CDN
  - Works seamlessly with all existing transform options

### Changed

- **url-builder**: Renamed `buildQueryParams()` to `buildTransformString()`
  - Now generates transform string in `key:value,key:value` format
  - Wraps all transforms in a single `transform` query parameter
  - Supports both path-based and URL-based transformations

- **transform format**: Updated parameter separators
  - Key-value pairs now use colon (`:`) instead of equals (`=`)
  - Parameters joined with comma (`,`) instead of ampersand (`&`)

- **boolean parameters**: Simplified boolean handling
  - `flip`, `flop`, `grayscale` now appear without values (e.g., `grayscale` instead of `grayscale=true`)
  - `blur` can be boolean (appears without value) or numeric (appears with value: `blur:5`)

- **extract parameter**: Changed region separator
  - Now uses hyphen separator: `extract:x-y-width-height`
  - Previously used comma separator: `extract=x,y,width,height`

- **buildTransformedUrl**: Enhanced to support both path and URL inputs
  - **Path input**: `/path/image.jpg` → `https://cdn.snapkit.studio/path/image.jpg?transform=...`
  - **URL input**: `https://other-cdn.com/image.jpg` → `https://cdn.snapkit.studio/image?url=...&transform=...`

### Fixed

- All tests updated to reflect new URL format
- Integration tests updated for CDN provider workflows
- Security tests updated with new parameter format

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
