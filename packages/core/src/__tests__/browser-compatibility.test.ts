import { afterEach, describe, expect, it } from 'vitest';

import {
  checkAvifSupport,
  checkWebpSupport,
  estimateFormatSupportFromUA,
  getFormatSupportFromUA,
  parseBrowserInfo,
  type BrowserInfo,
} from '../browser-compatibility';

describe('Browser Compatibility Utils', () => {
  describe('parseBrowserInfo function', () => {
    it('Should parse Chrome browser info', () => {
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';
      const result = parseBrowserInfo(userAgent);

      expect(result.name).toBe('chrome');
      expect(result.version).toBe(90);
      expect(result.platform).toBe('desktop');
      expect(result.iosVersion).toBeUndefined();
    });

    it('Should parse Firefox browser info', () => {
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0';
      const result = parseBrowserInfo(userAgent);

      expect(result.name).toBe('firefox');
      expect(result.version).toBe(88);
      expect(result.platform).toBe('desktop');
      expect(result.iosVersion).toBeUndefined();
    });

    it('Should parse Edge browser info', () => {
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.2277.112';
      const result = parseBrowserInfo(userAgent);

      expect(result.name).toBe('edge');
      expect(result.version).toBe(121);
      expect(result.platform).toBe('desktop');
      expect(result.iosVersion).toBeUndefined();
    });

    it('Should parse Safari browser info', () => {
      const userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15';
      const result = parseBrowserInfo(userAgent);

      expect(result.name).toBe('safari');
      expect(result.version).toBe(15);
      expect(result.platform).toBe('desktop');
      expect(result.iosVersion).toBeUndefined();
    });

    it('Should parse iOS Safari browser info', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
      const result = parseBrowserInfo(userAgent);

      expect(result.name).toBe('safari');
      expect(result.version).toBe(16);
      expect(result.platform).toBe('ios');
      expect(result.iosVersion).toEqual({ major: 16, minor: 4 });
    });

    it('Should parse iOS Chrome browser info', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/90.0.4430.78 Mobile/15E148 Safari/604.1';
      const result = parseBrowserInfo(userAgent);

      expect(result.name).toBe('chrome');
      expect(result.version).toBe(90);
      expect(result.platform).toBe('ios');
      expect(result.iosVersion).toEqual({ major: 16, minor: 3 });
    });

    it('Should handle unknown browser', () => {
      const userAgent = 'Mozilla/5.0 Custom Browser';
      const result = parseBrowserInfo(userAgent);

      expect(result.name).toBe('unknown');
      expect(result.version).toBe(0);
      expect(result.platform).toBe('unknown');
      expect(result.iosVersion).toBeUndefined();
    });
  });

  describe('checkAvifSupport function', () => {
    it('Should support AVIF in Chrome 85+', () => {
      const browserInfo: BrowserInfo = {
        name: 'chrome',
        version: 90,
        platform: 'desktop',
      };

      expect(checkAvifSupport(browserInfo)).toBe(true);
    });

    it('Should not support AVIF in Chrome 84', () => {
      const browserInfo: BrowserInfo = {
        name: 'chrome',
        version: 84,
        platform: 'desktop',
      };

      expect(checkAvifSupport(browserInfo)).toBe(false);
    });

    it('Should support AVIF in Firefox 93+', () => {
      const browserInfo: BrowserInfo = {
        name: 'firefox',
        version: 95,
        platform: 'desktop',
      };

      expect(checkAvifSupport(browserInfo)).toBe(true);
    });

    it('Should not support AVIF in Firefox 92', () => {
      const browserInfo: BrowserInfo = {
        name: 'firefox',
        version: 92,
        platform: 'desktop',
      };

      expect(checkAvifSupport(browserInfo)).toBe(false);
    });

    it('Should support AVIF in Edge 121+', () => {
      const browserInfo: BrowserInfo = {
        name: 'edge',
        version: 121,
        platform: 'desktop',
      };

      expect(checkAvifSupport(browserInfo)).toBe(true);
    });

    it('Should support AVIF in Edge 120', () => {
      const browserInfo: BrowserInfo = {
        name: 'edge',
        version: 120,
        platform: 'desktop',
      };

      expect(checkAvifSupport(browserInfo)).toBe(true);
    });

    it('Should not support AVIF on iOS 16.0-16.3 even with Chrome', () => {
      const browserInfo: BrowserInfo = {
        name: 'chrome',
        version: 90,
        platform: 'ios',
        iosVersion: { major: 16, minor: 3 },
      };

      expect(checkAvifSupport(browserInfo)).toBe(false);
    });

    it('Should support AVIF on iOS 16.4+ Safari', () => {
      const browserInfo: BrowserInfo = {
        name: 'safari',
        version: 16,
        platform: 'ios',
        iosVersion: { major: 16, minor: 4 },
      };

      expect(checkAvifSupport(browserInfo)).toBe(true);
    });

    it('Should support AVIF on iOS 17+', () => {
      const browserInfo: BrowserInfo = {
        name: 'safari',
        version: 17,
        platform: 'ios',
        iosVersion: { major: 17, minor: 0 },
      };

      expect(checkAvifSupport(browserInfo)).toBe(true);
    });
  });

  describe('checkWebpSupport function', () => {
    it('Should support WebP in Chrome 32+', () => {
      const browserInfo: BrowserInfo = {
        name: 'chrome',
        version: 50,
        platform: 'desktop',
      };

      expect(checkWebpSupport(browserInfo)).toBe(true);
    });

    it('Should support WebP in Chrome 31', () => {
      const browserInfo: BrowserInfo = {
        name: 'chrome',
        version: 31,
        platform: 'desktop',
      };

      expect(checkWebpSupport(browserInfo)).toBe(true); // Chrome 23+ supports WebP
    });

    it('Should support WebP in Firefox 65+', () => {
      const browserInfo: BrowserInfo = {
        name: 'firefox',
        version: 88,
        platform: 'desktop',
      };

      expect(checkWebpSupport(browserInfo)).toBe(true);
    });

    it('Should not support WebP in Firefox 64', () => {
      const browserInfo: BrowserInfo = {
        name: 'firefox',
        version: 64,
        platform: 'desktop',
      };

      expect(checkWebpSupport(browserInfo)).toBe(false);
    });

    it('Should not support WebP in Legacy Edge 18', () => {
      const browserInfo: BrowserInfo = {
        name: 'edge',
        version: 18,
        platform: 'desktop',
      };

      expect(checkWebpSupport(browserInfo)).toBe(false); // Legacy EdgeHTML Edge doesn't support WebP properly
    });

    it('Should support WebP in Chromium Edge 79+', () => {
      const browserInfo: BrowserInfo = {
        name: 'edge',
        version: 79,
        platform: 'desktop',
      };

      expect(checkWebpSupport(browserInfo)).toBe(true);
    });

    it('Should support WebP on iOS 14+', () => {
      const browserInfo: BrowserInfo = {
        name: 'safari',
        version: 14,
        platform: 'ios',
        iosVersion: { major: 14, minor: 0 },
      };

      expect(checkWebpSupport(browserInfo)).toBe(true);
    });

    it('Should not support WebP on iOS 13', () => {
      const browserInfo: BrowserInfo = {
        name: 'safari',
        version: 13,
        platform: 'ios',
        iosVersion: { major: 13, minor: 7 },
      };

      expect(checkWebpSupport(browserInfo)).toBe(false);
    });

    it('Should support WebP in Safari 14+', () => {
      const browserInfo: BrowserInfo = {
        name: 'safari',
        version: 15,
        platform: 'desktop',
      };

      expect(checkWebpSupport(browserInfo)).toBe(true);
    });
  });

  describe('getFormatSupportFromUA function', () => {
    it('Should detect AVIF and WebP support in Chrome 90', () => {
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(true);
      expect(result.webp).toBe(true);
    });

    it('Should detect WebP but not AVIF in Chrome 84', () => {
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(true);
    });

    it('Should support WebP in Chrome 31', () => {
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(true); // Chrome 23+ supports WebP
    });

    it('Should detect AVIF and WebP support in Firefox 95', () => {
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(true);
      expect(result.webp).toBe(true);
    });

    it('Should detect WebP but not AVIF in Firefox 88', () => {
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(true);
    });

    it('Should not support WebP in Firefox 64', () => {
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(false);
    });

    it('Should detect AVIF and WebP support in modern Edge', () => {
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.2277.112';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(true);
      expect(result.webp).toBe(true);
    });

    it('Should not detect WebP or AVIF in Legacy Edge 18', () => {
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(false); // Legacy EdgeHTML Edge doesn't support WebP properly
    });

    it('Should detect WebP and AVIF in Chromium Edge 91+', () => {
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(true);
      expect(result.webp).toBe(true);
    });

    it('Should detect WebP support in Safari 15', () => {
      const userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(true);
    });

    it('Should not support WebP in Safari 13', () => {
      const userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Safari/605.1.15';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(false);
    });

    it('Should disable AVIF on iOS 16.0', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false); // iOS 16.0 should disable AVIF
      expect(result.webp).toBe(true); // WebP should still work
    });

    it('Should disable AVIF on iOS 16.1', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false); // iOS 16.1 should disable AVIF
      expect(result.webp).toBe(true);
    });

    it('Should disable AVIF on iOS 16.2', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false); // iOS 16.2 should disable AVIF
      expect(result.webp).toBe(true);
    });

    it('Should disable AVIF on iOS 16.3', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false); // iOS 16.3 should disable AVIF
      expect(result.webp).toBe(true);
    });

    it('Should enable AVIF on iOS 16.4', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(true); // iOS 16.4+ supports AVIF
      expect(result.webp).toBe(true); // iOS 14+ supports WebP
    });

    it('Should enable AVIF on iOS 17.0', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(true); // iOS 17+ supports AVIF
      expect(result.webp).toBe(true); // iOS 14+ supports WebP
    });

    it('Should not support WebP on iOS 13', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Mobile/15E148 Safari/604.1';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false); // iOS 13 doesn't support AVIF
      expect(result.webp).toBe(false); // iOS 13 doesn't support WebP
    });

    it('Should support WebP but not AVIF on iOS 14', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false); // iOS 14 doesn't support AVIF
      expect(result.webp).toBe(true); // iOS 14+ supports WebP
    });

    it('Should disable AVIF on iOS 16.3 with Chrome', () => {
      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/90.0.4430.78 Mobile/15E148 Safari/604.1';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false); // iOS 16.3 should disable AVIF even with Chrome
      expect(result.webp).toBe(true);
    });

    it('Should detect no support in old browsers', () => {
      const userAgent =
        'Mozilla/5.0 (compatible; MSIE 11.0; Windows NT 10.0; WOW64; Trident/7.0)';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(false);
    });

    it('Should handle user agent without version info', () => {
      const userAgent = 'Mozilla/5.0 Custom Browser';
      const result = getFormatSupportFromUA(userAgent);

      expect(result.avif).toBe(false);
      expect(result.webp).toBe(false);
    });
  });

  describe('estimateFormatSupportFromUA function', () => {
    const originalWindow = global.window;
    const originalNavigator = global.navigator;

    afterEach(() => {
      global.window = originalWindow;
      if (originalNavigator) {
        Object.defineProperty(global, 'navigator', {
          value: originalNavigator,
          writable: true,
          configurable: true,
        });
      }
    });

    it('Should return false on server side', () => {
      (global as any).window = undefined;
      (global as any).navigator = undefined;

      const result = estimateFormatSupportFromUA();

      expect(result).toEqual({ avif: false, webp: false });
    });

    it('Should return false when navigator.userAgent is unavailable', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      });

      const result = estimateFormatSupportFromUA();

      expect(result).toEqual({ avif: false, webp: false });
    });

    it('Should detect format support from navigator.userAgent', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        },
        writable: true,
      });

      const result = estimateFormatSupportFromUA();

      expect(result.avif).toBe(true);
      expect(result.webp).toBe(true);
    });
  });
});
