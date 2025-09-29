import {
  DEFAULT_FILL_WIDTH,
  MAX_IMAGE_QUALITY,
  MAX_IMAGE_WIDTH,
  MIN_IMAGE_QUALITY,
} from './constants';
import { DprDetectionOptions, getOptimalDprValues } from './dpr-detection';
import {
  adjustQualityForConnection,
  generateResponsiveWidths,
  parseImageSizes,
} from './responsive';
import { ImageTransforms, SnapkitConfig } from './types';
import { SnapkitUrlBuilder } from './url-builder';
import { UrlBuilderFactory } from './url-builder-factory';

/**
 * All data required for image rendering
 */
export interface ImageRenderData {
  /** Optimized main image URL */
  url: string;
  /** Responsive srcSet string */
  srcSet: string;
  /** Calculated image size */
  size: { width?: number; height?: number };
  /** Applied final transforms */
  transforms: ImageTransforms;
  /** Quality adjusted based on network conditions */
  adjustedQuality: number;
}

/**
 * Image engine input parameters
 */
export interface ImageEngineParams {
  src: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  transforms?: ImageTransforms;
  adjustQualityByNetwork?: boolean;
  /** DPR detection options for smart srcSet generation */
  dprOptions?: DprDetectionOptions;
}

/**
 * Input parameter validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Framework-independent image optimization engine
 *
 * Provides two main features:
 * 1. Configuration-based image optimization URL generation
 * 2. Responsive srcSet generation (based on DPR/sizes)
 */
export class SnapkitImageEngine {
  private urlBuilder: SnapkitUrlBuilder;
  private config: SnapkitConfig;

  constructor(config: SnapkitConfig) {
    this.validateConfig(config);
    this.config = config;
    this.urlBuilder = UrlBuilderFactory.getInstance(config.cdnConfig);
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: SnapkitConfig): void {
    if (!config.cdnConfig) {
      throw new Error('cdnConfig is required in SnapkitConfig');
    }

    // Validate CDN config
    if (
      config.cdnConfig.provider === 'snapkit' &&
      !config.cdnConfig.organizationName
    ) {
      throw new Error(
        'organizationName is required when using snapkit provider',
      );
    }

    if (config.cdnConfig.provider === 'custom' && !config.cdnConfig.baseUrl) {
      throw new Error('baseUrl is required when using custom provider');
    }

    if (config.defaultQuality !== undefined) {
      if (
        typeof config.defaultQuality !== 'number' ||
        config.defaultQuality < MIN_IMAGE_QUALITY ||
        config.defaultQuality > MAX_IMAGE_QUALITY
      ) {
        throw new Error(
          `defaultQuality must be a number between ${MIN_IMAGE_QUALITY} and ${MAX_IMAGE_QUALITY}`,
        );
      }
    }

    const validFormats = ['jpeg', 'jpg', 'png', 'webp', 'avif', 'auto'];
    if (config.defaultFormat && !validFormats.includes(config.defaultFormat)) {
      throw new Error(
        `defaultFormat must be one of: ${validFormats.join(', ')}`,
      );
    }
  }

  /**
   * Validate input parameters
   */
  public validateParams(params: ImageEngineParams): ValidationResult {
    const errors: string[] = [];

    // Validate src
    if (!params.src || typeof params.src !== 'string') {
      errors.push('src must be a non-empty string');
    }

    // Validate width
    if (params.width !== undefined) {
      if (
        typeof params.width !== 'number' ||
        params.width <= 0 ||
        !isFinite(params.width)
      ) {
        errors.push('width must be a positive number');
      }
    }

    // Validate height
    if (params.height !== undefined) {
      if (
        typeof params.height !== 'number' ||
        params.height <= 0 ||
        !isFinite(params.height)
      ) {
        errors.push('height must be a positive number');
      }
    }

    // Validate quality
    if (params.quality !== undefined) {
      if (
        typeof params.quality !== 'number' ||
        params.quality < MIN_IMAGE_QUALITY ||
        params.quality > MAX_IMAGE_QUALITY ||
        !isFinite(params.quality)
      ) {
        errors.push(
          `quality must be a number between ${MIN_IMAGE_QUALITY} and ${MAX_IMAGE_QUALITY}`,
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate image size
   */
  private calculateImageSize(params: ImageEngineParams): {
    width?: number;
    height?: number;
  } {
    if (params.fill) {
      return {
        width: DEFAULT_FILL_WIDTH, // Default responsive width for fill mode
        height: undefined,
      };
    }
    return {
      width: params.width,
      height: params.height,
    };
  }

  /**
   * Create final transforms
   */
  private createFinalTransforms(
    params: ImageEngineParams,
    adjustedQuality: number,
    imageSize: { width?: number; height?: number },
  ): ImageTransforms {
    return {
      ...params.transforms,
      width: imageSize.width,
      height: imageSize.height,
      quality: params.quality ?? adjustedQuality,
      format: params.transforms?.format || this.config.defaultFormat || 'auto',
    };
  }

  /**
   * Generate srcSet (core logic)
   */
  private generateSrcSet(
    params: ImageEngineParams,
    imageSize: { width?: number; height?: number },
    finalTransforms: ImageTransforms,
  ): string {
    if (!imageSize.width) return '';

    if (params.fill) {
      // Fill mode: responsive width-based srcSet
      const responsiveWidths = generateResponsiveWidths(imageSize.width);
      return this.urlBuilder.buildSrcSet(
        params.src,
        responsiveWidths,
        finalTransforms,
      );
    }

    if (params.sizes) {
      // When sizes prop is provided: optimization based on parsed sizes
      const parsedSizes = parseImageSizes(params.sizes);

      if (parsedSizes.length > 0) {
        const allWidths = parsedSizes.flatMap((size) =>
          generateResponsiveWidths(size, {
            multipliers: [1, 1.5, 2], // DPR variations
            minWidth: 200,
            maxWidth: MAX_IMAGE_WIDTH,
          }),
        );

        const uniqueWidths = [...new Set(allWidths)].sort((a, b) => a - b);
        return this.urlBuilder.buildSrcSet(
          params.src,
          uniqueWidths,
          finalTransforms,
        );
      } else {
        // Use default responsive widths when sizes parsing fails
        const responsiveWidths = generateResponsiveWidths(imageSize.width);
        return this.urlBuilder.buildSrcSet(
          params.src,
          responsiveWidths,
          finalTransforms,
        );
      }
    } else {
      // DPR-based srcSet (Next.js Image style)
      // Use smart DPR detection to determine optimal DPR values
      const optimalDprs = getOptimalDprValues(params.dprOptions);

      return this.urlBuilder.buildDprSrcSet(
        params.src,
        imageSize.width,
        imageSize.height,
        finalTransforms,
        optimalDprs, // Smart DPR values based on device
      );
    }
  }

  /**
   * Generate image rendering data (main API)
   */
  public generateImageData(params: ImageEngineParams): ImageRenderData {
    // Parameter validation
    const validation = this.validateParams(params);
    if (!validation.isValid) {
      throw new Error(`Invalid parameters: ${validation.errors.join(', ')}`);
    }

    // Network-based quality adjustment
    const baseQuality = params.quality || this.config.defaultQuality;
    const adjustedQuality =
      params.adjustQualityByNetwork === true
        ? adjustQualityForConnection(baseQuality)
        : baseQuality;

    // Calculate image size
    const imageSize = this.calculateImageSize(params);

    // Generate final transforms
    const finalTransforms = this.createFinalTransforms(
      params,
      adjustedQuality,
      imageSize,
    );

    // Generate main image URL
    const url = this.urlBuilder.buildTransformedUrl(
      params.src,
      finalTransforms,
    );

    // Generate srcSet
    const srcSet = this.generateSrcSet(params, imageSize, finalTransforms);

    return {
      url,
      srcSet,
      size: imageSize,
      transforms: finalTransforms,
      adjustedQuality,
    };
  }

  /**
   * Create Next.js compatible loader function
   */
  public createNextJsLoader() {
    return ({
      src,
      width,
      quality,
    }: {
      src: string;
      width?: number;
      quality?: number;
    }) => {
      const imageData = this.generateImageData({
        src,
        width,
        quality,
        adjustQualityByNetwork: false, // Disable network adjustment in Next.js
      });
      return imageData.url;
    };
  }

  /**
   * Return current configuration
   */
  public getConfig(): SnapkitConfig {
    return { ...this.config };
  }

  /**
   * Direct access to URL builder (advanced usage)
   */
  public getUrlBuilder(): SnapkitUrlBuilder {
    return this.urlBuilder;
  }
}
