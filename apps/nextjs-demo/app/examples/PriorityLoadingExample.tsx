import { CodeBlock, ExampleContainer } from '@repo/demo-components';
import { Image } from '@snapkit-studio/nextjs';

export function PriorityLoadingExample() {
  return (
    <ExampleContainer
      title="Priority Loading"
      description="Shows how to prioritize important images to improve user experience."
    >
      <div className="space-y-8">
        {/* Hero image - highest priority */}
        <div>
          <h4 className="mb-4 text-lg font-medium">
            Hero Image (Highest Priority)
          </h4>
          <p className="mb-4 text-sm text-gray-600">
            Top-of-page hero images load instantly when `priority=true`.
          </p>
          <Image
            src="/landing-page/fox.jpg"
            alt="Hero image"
            width={800}
            height={400}
            priority={true}
            className="w-full rounded-lg border object-cover"
            sizes="100vw"
          />
          <div className="mt-2 rounded border border-green-200 bg-green-50 p-3 text-sm">
            <strong>priority=true</strong>: downloads immediately with the page
            load.
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Hero image - highest priority
<Image
  src="/landing-page/fox.jpg"
  alt="Hero image"
  width={800}
  height={400}
  priority={true}  // load immediately
  className="w-full"
  sizes="100vw"
/>`}
        </CodeBlock>

        {/* Important content images */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Important Content Images</h4>
          <p className="mb-4 text-sm text-gray-600">
            {`Set above-the-fold images to \`loading="eager"\`.`}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Image
                src="/landing-page/fox.jpg"
                alt="Important image 1"
                width={400}
                height={300}
                loading="eager"
                className="w-full rounded border object-cover"
              />
              <p className="mt-2 text-sm text-gray-600">
                loading=&quot;eager&quot;
              </p>
            </div>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Above-the-fold images
<Image
  src="/landing-page/fox.jpg"
  alt="Important image"
  width={400}
  height={300}
  loading="eager"  // load immediately (lower than priority)
/>`}
        </CodeBlock>

        {/* Standard content images */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Standard Content Images</h4>
          <p className="mb-4 text-sm text-gray-600">
            Use default lazy loading for below-the-fold images.
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index}>
                <Image
                  src="/landing-page/fox.jpg"
                  alt={`Standard image ${index + 1}`}
                  width={300}
                  height={200}
                  loading="lazy"
                  className="w-full rounded border object-cover"
                />
                <p className="mt-1 text-xs text-gray-500">lazy loading</p>
              </div>
            ))}
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Standard content images
<Image
  src="/landing-page/fox.jpg"
  alt="Standard image"
  width={300}
  height={200}
  loading="lazy"  // default - loads near the viewport
/>`}
        </CodeBlock>

        {/* Preloading strategies */}
        <div>
          <h4 className="mb-4 text-lg font-medium">
            Preloading Strategies Compared
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Priority
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Attribute
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    When to use
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Load timing
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-red-600">
                    Highest
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <code className="rounded bg-gray-100 px-1">
                      priority=true
                    </code>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Hero/LCP images
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    With initial page load
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-orange-600">
                    High
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <code className="rounded bg-gray-100 px-1">
                      loading=&quot;eager&quot;
                    </code>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Above-the-fold images
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Immediate load
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-blue-600">
                    Standard
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <code className="rounded bg-gray-100 px-1">
                      loading=&quot;lazy&quot;
                    </code>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Below-the-fold images
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Near viewport
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Priority-based loading strategy
// 1. Highest priority - LCP image
<Image priority={true} />

// 2. High priority - Above the fold
<Image loading="eager" />

// 3. Standard priority - Below the fold (default)
<Image loading="lazy" />`}
        </CodeBlock>

        {/* Conditional priority */}
        <div>
          <h4 className="mb-4 text-lg font-medium">
            Conditional Priority Settings
          </h4>
          <p className="mb-4 text-sm text-gray-600">
            Adjust priority dynamically based on screen size or position.
          </p>
          <div className="space-y-4">
            {/* Priority on desktop only */}
            <div>
              <h5 className="mb-2 font-medium">Priority only on desktop</h5>
              <Image
                src="/landing-page/fox.jpg"
                alt="Desktop priority example"
                width={600}
                height={300}
                priority={true} // example: true only on desktop
                className="w-full rounded border object-cover"
              />
            </div>

            {/* First image gets priority */}
            <div>
              <h5 className="mb-2 font-medium">
                Only the first image prioritized
              </h5>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, index) => (
                  <Image
                    key={index}
                    src="/landing-page/fox.jpg"
                    alt={`Conditional image ${index + 1}`}
                    width={300}
                    height={200}
                    priority={index === 0} // only the first is priority
                    className="w-full rounded border object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Conditional priority
{images.map((image, index) => (
  <Image
    key={index}
    src={image.src}
    alt={image.alt}
    priority={index === 0}  // priority only for the first
    loading={index < 3 ? "eager" : "lazy"}  // first 3 eager
  />
))}

// Media query-based priority
const isDesktop = useMediaQuery('(min-width: 1024px)');
<Image
  priority={isDesktop}  // priority on desktop only
/>`}
        </CodeBlock>

        {/* Performance tips */}
        <div>
          <h4 className="mb-4 text-lg font-medium">
            Performance Optimization Tips
          </h4>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">•</span>
                <span>
                  <strong>Reserve priority for LCP images only</strong>: limit
                  to 1-2 per page
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">•</span>
                <span>
                  <strong>Use eager for above-the-fold media</strong>: content
                  visible right away
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">•</span>
                <span>
                  <strong>Prefer lazy for everything else</strong>: avoid
                  unnecessary bandwidth usage
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">•</span>
                <span>
                  <strong>Tune the `sizes` attribute</strong>: optimize for
                  responsive layouts
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">•</span>
                <span>
                  <strong>Use WebP/AVIF formats</strong>: reduce file size
                </span>
              </li>
            </ul>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Performance best practices
// ✅ Good example
<Image priority={true} />           // Only one LCP image
<Image loading="eager" />           // 2-3 above-the-fold images
<Image loading="lazy" />            // Everything else

// ❌ Bad example
<Image priority={true} />           // Overusing priority
<Image priority={true} />
<Image priority={true} />
<Image priority={true} />`}
        </CodeBlock>
      </div>
    </ExampleContainer>
  );
}
