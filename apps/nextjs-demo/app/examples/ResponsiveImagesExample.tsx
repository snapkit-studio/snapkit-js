import { CodeBlock, ExampleContainer } from '@repo/demo-components';
import { Image } from '@snapkit-studio/nextjs';

export function ResponsiveImagesExample() {
  return (
    <ExampleContainer
      title="Responsive Images"
      description="Demonstrates how to deliver optimized images across different screen sizes."
    >
      <div className="space-y-8">
        {/* Basic responsive behavior */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Basic Responsive Image</h4>
          <p className="mb-4 text-sm text-gray-600">
            Let the browser pick the optimal image size automatically.
          </p>
          <Image
            src="/landing-page/fox.jpg"
            alt="Responsive image"
            width={800}
            height={600}
            className="w-full max-w-2xl rounded-lg border object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <CodeBlock language="tsx">
          {`<Image
  src="/landing-page/fox.jpg"
  alt="Responsive image"
  width={800}
  height={600}
  className="w-full max-w-2xl"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>`}
        </CodeBlock>

        {/* Detailed sizes examples */}
        <div>
          <h4 className="mb-4 text-lg font-medium">
            Different sizes Configurations
          </h4>

          {/* Mobile-first */}
          <div className="mb-6">
            <h5 className="mb-2 font-medium">
              Mobile: 100%, Tablet: 50%, Desktop: 33%
            </h5>
            <Image
              src="/landing-page/fox.jpg"
              alt="Mobile-first responsive"
              width={600}
              height={400}
              className="w-full max-w-lg rounded border object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>

          {/* Fixed and percentage mix */}
          <div className="mb-6">
            <h5 className="mb-2 font-medium">
              Mobile: 320px, Tablet: 50%, Desktop: 400px
            </h5>
            <Image
              src="/landing-page/fox.jpg"
              alt="Fixed + percentage mix"
              width={600}
              height={400}
              className="w-full max-w-lg rounded border object-cover"
              sizes="(max-width: 640px) 320px, (max-width: 1024px) 50vw, 400px"
            />
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Example sizes configurations
<Image
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

<Image
  sizes="(max-width: 640px) 320px, (max-width: 1024px) 50vw, 400px"
/>`}
        </CodeBlock>

        {/* Responsive grid layout */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Responsive Grid Layout</h4>
          <p className="mb-4 text-sm text-gray-600">
            Each grid item adapts its size to the viewport.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="aspect-square">
                <Image
                  src="/landing-page/fox.jpg"
                  alt={`Grid image ${index}`}
                  width={400}
                  height={400}
                  className="h-full w-full rounded border object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Responsive grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {images.map((image, index) => (
    <Image
      key={index}
      src={image.src}
      alt={image.alt}
      width={400}
      height={400}
      className="w-full h-full object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  ))}
</div>`}
        </CodeBlock>

        {/* Art direction examples */}
        <div>
          <h4 className="mb-4 text-lg font-medium">
            Art Direction (Different Ratios per Screen)
          </h4>
          <p className="mb-4 text-sm text-gray-600">
            Serve different aspect ratios depending on the viewport.
          </p>
          <div className="space-y-4">
            {/* Landscape for desktop */}
            <div className="hidden lg:block">
              <p className="mb-2 text-sm font-medium">
                Desktop: 16:9 landscape
              </p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Landscape for desktop"
                width={800}
                height={450}
                className="w-full rounded border object-cover"
                sizes="100vw"
                transforms={{ width: 800, height: 450 }}
              />
            </div>

            {/* Square for tablet */}
            <div className="hidden md:block lg:hidden">
              <p className="mb-2 text-sm font-medium">Tablet: Square (1:1)</p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Square for tablet"
                width={600}
                height={600}
                className="mx-auto w-full max-w-md rounded border object-cover"
                sizes="100vw"
                transforms={{ width: 600, height: 600 }}
              />
            </div>

            {/* Portrait for mobile */}
            <div className="block md:hidden">
              <p className="mb-2 text-sm font-medium">Mobile: Portrait (3:4)</p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Portrait for mobile"
                width={300}
                height={400}
                className="mx-auto w-full max-w-xs rounded border object-cover"
                sizes="100vw"
                transforms={{ width: 300, height: 400 }}
              />
            </div>

            {/* Example visible on all screens */}
            <div className="relative block">
              <p className="mb-2 text-sm font-medium">
                All screens: responsive aspect ratio
              </p>
              <div className="aspect-video w-full sm:aspect-[3/4] md:aspect-square lg:aspect-[16/9]">
                <Image
                  src="/landing-page/fox.jpg"
                  alt="All screen responsive"
                  fill
                  className="rounded border object-cover"
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Different aspect ratios per screen (art direction)
<div className="w-full aspect-video lg:aspect-[16/9] md:aspect-square sm:aspect-[3/4]">
  <Image
    src="/landing-page/fox.jpg"
    alt="All screen responsive"
    fill
    className="object-cover"
    sizes="100vw"
  />
</div>

// Or use different image sizes per screen type
<Image
  src="/landing-page/fox.jpg"
  width={800}
  height={450}
  className="hidden lg:block" // desktop only
  transforms={{ width: 800, height: 450 }}
/>

<Image
  src="/landing-page/fox.jpg"
  width={600}
  height={600}
  className="hidden md:block lg:hidden" // tablet only
  transforms={{ width: 600, height: 600 }}
/>`}
        </CodeBlock>
      </div>
    </ExampleContainer>
  );
}
