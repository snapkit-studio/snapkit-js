import { ExampleContainer } from '@repo/demo-components';
import { getCdnConfig } from '@snapkit-studio/core';
import { Image } from '@snapkit-studio/react';
import { useState } from 'react';

const description = `
This example demonstrates how the CDN provider configuration works.
The current configuration is automatically detected from environment variables.
You can switch between Snapkit CDN and custom CDN providers like CloudFront, Google Cloud Storage, or Cloudflare.
`;

const code = `import { Image } from '@snapkit-studio/react';
import { getCdnConfig } from '@snapkit-studio/core';

// Environment variables (in .env):
// VITE_IMAGE_CDN_PROVIDER=snapkit
// VITE_SNAPKIT_ORGANIZATION=your-org

// Or for custom CDN:
// VITE_IMAGE_CDN_PROVIDER=custom
// VITE_IMAGE_CDN_URL=https://d123.cloudfront.net

function CdnExample() {
  return (
    <Image
      src="/landing-page/fox.jpg"
      alt="CDN Example"
      width={400}
      height={300}
      quality={90}
    />
  );
}`;

export function CdnConfigurationExample() {
  const [showConfig, setShowConfig] = useState(false);

  // Get current CDN configuration
  const cdnConfig = getCdnConfig();

  const configInfo = {
    provider: cdnConfig.provider,
    baseUrl:
      cdnConfig.provider === 'snapkit'
        ? `https://${cdnConfig.organizationName}-cdn.snapkit.studio`
        : cdnConfig.baseUrl,
    environmentVariables:
      cdnConfig.provider === 'snapkit'
        ? [
            'VITE_IMAGE_CDN_PROVIDER=snapkit',
            `VITE_SNAPKIT_ORGANIZATION=${cdnConfig.organizationName}`,
          ]
        : [
            'VITE_IMAGE_CDN_PROVIDER=custom',
            `VITE_IMAGE_CDN_URL=${cdnConfig.baseUrl}`,
          ],
  };

  return (
    <ExampleContainer
      id="cdn-config"
      title="CDN Configuration"
      description={description}
      code={code}
    >
      <div className="space-y-6">
        {/* Current Configuration Display */}
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <h4 className="mb-2 font-medium text-blue-900 dark:text-blue-100">
            Current CDN Configuration
          </h4>
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-medium">Provider:</span>
              <span className="ml-2 rounded bg-blue-100 px-2 py-1 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                {configInfo.provider}
              </span>
            </div>
            <div>
              <span className="font-medium">Base URL:</span>
              <span className="ml-2 font-mono text-blue-600 dark:text-blue-300">
                {configInfo.baseUrl}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            {showConfig ? 'Hide' : 'Show'} Environment Variables
          </button>

          {showConfig && (
            <div className="mt-3 rounded bg-gray-100 p-3 font-mono text-sm dark:bg-gray-800">
              {configInfo.environmentVariables.map((envVar, index) => (
                <div key={index} className="text-gray-700 dark:text-gray-300">
                  {envVar}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Example Images */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-medium">Standard Quality (85%)</h4>
            <Image
              src="/landing-page/fox.jpg"
              alt="CDN Example - Standard"
              width={400}
              height={300}
              quality={85}
              className="rounded-lg shadow-md"
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">High Quality (95%)</h4>
            <Image
              src="/landing-page/fox.jpg"
              alt="CDN Example - High Quality"
              width={400}
              height={300}
              quality={95}
              className="rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* CDN Provider Comparison */}
        <div className="grid grid-cols-1 gap-4 text-sm lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h5 className="mb-2 font-medium text-purple-600 dark:text-purple-400">
              🚀 Snapkit CDN
            </h5>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Automatic optimization</li>
              <li>• Smart format delivery</li>
              <li>• Global edge caching</li>
              <li>• Zero configuration</li>
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h5 className="mb-2 font-medium text-orange-600 dark:text-orange-400">
              ☁️ CloudFront CDN
            </h5>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• AWS integration</li>
              <li>• Custom cache policies</li>
              <li>• Enterprise features</li>
              <li>• Existing infrastructure</li>
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h5 className="mb-2 font-medium text-blue-600 dark:text-blue-400">
              📦 Google Cloud Storage
            </h5>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• GCP integration</li>
              <li>• Cost-effective storage</li>
              <li>• Custom domains</li>
              <li>• Global distribution</li>
            </ul>
          </div>
        </div>
      </div>
    </ExampleContainer>
  );
}
