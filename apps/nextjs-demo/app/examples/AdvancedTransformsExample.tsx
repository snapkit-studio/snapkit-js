'use client';

import { CodeBlock, ExampleContainer } from '@repo/demo-components';
import { Image } from '@snapkit-studio/nextjs';
import { useState } from 'react';

export function AdvancedTransformsExample() {
  const [customTransforms, setCustomTransforms] = useState({
    width: 400,
    height: 300,
    quality: 85,
    blur: 0,
    grayscale: false,
    flop: false,
    flip: false,
  });

  const handleTransformChange = (key: string, value: number | boolean) => {
    setCustomTransforms((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ExampleContainer
      title="Advanced Transformation Effects"
      description="Showcases how to leverage complex, advanced image transformation techniques."
    >
      <div className="space-y-8">
        {/* Quality adjustment */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Quality Optimization</h4>
          <p className="mb-4 text-sm text-gray-600">
            Balance file size and visual fidelity with various quality settings.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {[100, 85, 70, 50].map((quality) => (
              <div key={quality}>
                <p className="mb-2 text-sm font-medium">Quality {quality}%</p>
                <Image
                  src="/landing-page/fox.jpg"
                  alt={`Quality ${quality}%`}
                  width={200}
                  height={150}
                  className="w-full rounded border object-cover"
                  transforms={{ quality }}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {quality >= 85
                    ? 'High quality'
                    : quality >= 70
                      ? 'Medium quality'
                      : 'Low quality'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Optimizing for different quality tiers
<Image transforms={{ quality: 100 }} /> // Highest quality
<Image transforms={{ quality: 85 }} />  // Web standard
<Image transforms={{ quality: 70 }} />  // Mobile standard
<Image transforms={{ quality: 50 }} />  // Low-bandwidth networks`}
        </CodeBlock>

        {/* Dynamic resizing */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Dynamic Resizing</h4>
          <p className="mb-4 text-sm text-gray-600">
            Use transforms to generate multiple sizes from the original image.
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { width: 800, height: 600, label: 'Large image' },
              { width: 400, height: 300, label: 'Medium image' },
              { width: 200, height: 150, label: 'Small image' },
              { width: 100, height: 100, label: 'Thumbnail' },
            ].map((size, index) => (
              <div key={index}>
                <p className="mb-2 text-sm font-medium">{size.label}</p>
                <p className="mb-2 text-xs text-gray-500">
                  {size.width}×{size.height}
                </p>
                <Image
                  src="/landing-page/fox.jpg"
                  alt={size.label}
                  width={size.width}
                  height={size.height}
                  className="w-full rounded border object-cover"
                  transforms={{ width: size.width, height: size.height }}
                />
              </div>
            ))}
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Dynamic resizing
<Image transforms={{ width: 800, height: 600 }} />  // High resolution
<Image transforms={{ width: 400, height: 300 }} />  // Standard
<Image transforms={{ width: 200, height: 150 }} />  // Mobile
<Image transforms={{ width: 100, height: 100 }} />  // Thumbnail`}
        </CodeBlock>

        {/* Composite filter combinations */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Composite Filter Combos</h4>
          <p className="mb-4 text-sm text-gray-600">
            Combine multiple transforms to craft distinctive visual styles.
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {/* Vintage effect */}
            <div>
              <h5 className="mb-2 font-medium">Vintage Effect</h5>
              <Image
                src="/landing-page/fox.jpg"
                alt="Vintage effect"
                width={250}
                height={188}
                className="w-full rounded border object-cover"
                transforms={{
                  grayscale: true,
                  blur: 1,
                  quality: 70,
                }}
              />
              <p className="mt-1 text-xs text-gray-500">
                Grayscale + subtle blur + lower quality
              </p>
            </div>

            {/* Dramatic effect */}
            <div>
              <h5 className="mb-2 font-medium">Dramatic Effect</h5>
              <Image
                src="/landing-page/fox.jpg"
                alt="Dramatic effect"
                width={250}
                height={188}
                className="w-full rounded border object-cover"
                transforms={{
                  blur: 3,
                  quality: 90,
                }}
              />
              <p className="mt-1 text-xs text-gray-500">
                Heavy blur + high quality
              </p>
            </div>

            {/* Mirror effect */}
            <div>
              <h5 className="mb-2 font-medium">Mirror Effect</h5>
              <Image
                src="/landing-page/fox.jpg"
                alt="Mirror effect"
                width={250}
                height={188}
                className="w-full rounded border object-cover"
                transforms={{
                  flip: true,
                  flop: true,
                }}
              />
              <p className="mt-1 text-xs text-gray-500">
                Flip vertically + flip horizontally
              </p>
            </div>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Composite filter effects
// Vintage effect
<Image transforms={{
  grayscale: true,
  blur: 1,
  quality: 70
}} />

// Dramatic effect
<Image transforms={{
  blur: 3,
  quality: 90
}} />

// Mirror effect
<Image transforms={{
  flip: true,
  flop: true
}} />`}
        </CodeBlock>

        {/* Real-time transform controls */}
        <div>
          <h4 className="mb-4 text-lg font-medium">
            Real-time Transform Controls
          </h4>
          <p className="mb-4 text-sm text-gray-600">
            Adjust the sliders to preview how transforms update instantly.
          </p>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Control panel */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Size: {customTransforms.width}×{customTransforms.height}
                </label>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="100"
                    max="600"
                    value={customTransforms.width}
                    onChange={(e) => {
                      const width = Number(e.target.value);
                      const height = Math.round(width * 0.75); // Maintain 4:3 aspect ratio
                      handleTransformChange('width', width);
                      handleTransformChange('height', height);
                    }}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Quality: {customTransforms.quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={customTransforms.quality}
                  onChange={(e) =>
                    handleTransformChange('quality', Number(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Blur: {customTransforms.blur}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={customTransforms.blur}
                  onChange={(e) =>
                    handleTransformChange('blur', Number(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={customTransforms.grayscale}
                    onChange={(e) =>
                      handleTransformChange('grayscale', e.target.checked)
                    }
                  />
                  <span className="text-sm">Grayscale</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={customTransforms.flop}
                    onChange={(e) =>
                      handleTransformChange('flop', e.target.checked)
                    }
                  />
                  <span className="text-sm">Horizontal flip (Flop)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={customTransforms.flip}
                    onChange={(e) =>
                      handleTransformChange('flip', e.target.checked)
                    }
                  />
                  <span className="text-sm">Vertical flip (Flip)</span>
                </label>
              </div>

              <button
                onClick={() =>
                  setCustomTransforms({
                    width: 400,
                    height: 300,
                    quality: 85,
                    blur: 0,
                    grayscale: false,
                    flop: false,
                    flip: false,
                  })
                }
                className="w-full rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                Reset to defaults
              </button>
            </div>

            {/* Preview */}
            <div>
              <h5 className="mb-2 font-medium">Preview</h5>
              <div className="rounded border border-gray-200 bg-gray-50 p-4">
                <Image
                  src="/landing-page/fox.jpg"
                  alt="Real-time transform preview"
                  width={customTransforms.width}
                  height={customTransforms.height}
                  className="mx-auto rounded border object-cover"
                  transforms={customTransforms}
                />
              </div>
              <div className="mt-4 rounded bg-gray-100 p-3 font-mono text-xs">
                <div className="mb-2 font-medium">Current transforms:</div>
                <pre>{JSON.stringify(customTransforms, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Real-time transform controls
const [transforms, setTransforms] = useState({
  width: 400,
  height: 300,
  quality: 85,
  blur: 0,
  grayscale: false,
  flop: false,
  flip: false
});

<Image
  src="/fox.jpg"
  alt="Real-time transform"
  width={transforms.width}
  height={transforms.height}
  transforms={transforms}
/>`}
        </CodeBlock>

        {/* Art gallery simulation */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Art Gallery Effects</h4>
          <p className="mb-4 text-sm text-gray-600">
            Variations of the same image with different artistic treatments.
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: 'Original', transforms: {} },
              { name: 'Classic', transforms: { grayscale: true, quality: 95 } },
              { name: 'Soft', transforms: { blur: 2, quality: 80 } },
              { name: 'Modern', transforms: { flop: true, quality: 90 } },
              { name: 'Minimal', transforms: { grayscale: true, blur: 1 } },
              { name: 'Pop Art', transforms: { flip: true, quality: 100 } },
              { name: 'Abstract', transforms: { blur: 5, grayscale: true } },
              {
                name: 'Vintage',
                transforms: { grayscale: true, blur: 1, quality: 60 },
              },
            ].map((style, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 rounded border border-gray-200 bg-white p-2 shadow-sm">
                  <Image
                    src="/landing-page/fox.jpg"
                    alt={`${style.name} style`}
                    width={150}
                    height={113}
                    className="w-full rounded object-cover"
                    transforms={style.transforms}
                  />
                </div>
                <p className="text-sm font-medium">{style.name}</p>
              </div>
            ))}
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Art gallery effects
const artStyles = [
  { name: 'Original', transforms: {} },
  { name: 'Classic', transforms: { grayscale: true, quality: 95 } },
  { name: 'Soft', transforms: { blur: 2, quality: 80 } },
  { name: 'Modern', transforms: { flop: true, quality: 90 } },
  { name: 'Minimal', transforms: { grayscale: true, blur: 1 } },
  { name: 'Pop Art', transforms: { flip: true, quality: 100 } },
  { name: 'Abstract', transforms: { blur: 5, grayscale: true } },
  { name: 'Vintage', transforms: { grayscale: true, blur: 1, quality: 60 } }
];

{artStyles.map((style, index) => (
  <Image
    key={index}
    src="/fox.jpg"
    alt={\`\${style.name} style\`}
    transforms={style.transforms}
  />
))}`}
        </CodeBlock>

        {/* Performance best practices */}
        <div>
          <h4 className="mb-4 text-lg font-medium">
            Performance Optimization Tips
          </h4>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold text-yellow-600">•</span>
                <span>
                  <strong>Choose fitting quality levels</strong>: 85% for web,
                  70-80% for mobile
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-yellow-600">•</span>
                <span>
                  <strong>Minimize unnecessary transforms</strong>: Apply only
                  what you need to reduce processing time
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-yellow-600">•</span>
                <span>
                  <strong>Leverage caching</strong>: Identical transform
                  combinations are cached by the CDN
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-yellow-600">•</span>
                <span>
                  <strong>Use conditional transforms</strong>: Adjust
                  dynamically based on device or network conditions
                </span>
              </li>
            </ul>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Optimized transforms
// Conditional quality setting
const quality = isSlowNetwork ? 60 : 85;

// Device-specific size adjustment
const size = isMobile ? { width: 300, height: 200 } : { width: 600, height: 400 };

// Apply only the necessary transforms
const transforms = {
  quality,
  ...size,
  ...(needsGrayscale && { grayscale: true }),
  ...(needsBlur && { blur: 2 })
};

<Image transforms={transforms} />`}
        </CodeBlock>
      </div>
    </ExampleContainer>
  );
}
