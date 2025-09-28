import { CodeBlock, ExampleContainer } from '@repo/demo-components';
import { Image } from '@snapkit-studio/nextjs';

export function LazyLoadingExample() {
  return (
    <ExampleContainer
      title="Lazy Loading"
      description="Demonstrates how lazy loading and placeholders improve the image experience."
    >
      <div className="space-y-8">
        {/* Default lazy loading */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Default Lazy Loading</h4>
          <p className="mb-4 text-sm text-gray-600">
            {`By default, \`loading="lazy"\` defers loading until the image nears
            the viewport.`}
          </p>
          <div className="space-y-4">
            <Image
              src="/landing-page/fox.jpg"
              alt="Lazy loaded image 1"
              width={400}
              height={300}
              className="rounded border object-cover"
              loading="lazy"
            />
            <Image
              src="/landing-page/fox.jpg"
              alt="Lazy loaded image 2"
              width={400}
              height={300}
              className="rounded border object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Default lazy loading (implicit)
<Image
  src="/fox.jpg"
  alt="Lazy loaded image"
  width={400}
  height={300}
  loading="lazy" // default, can be omitted
/>`}
        </CodeBlock>

        {/* Eager loading */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Eager Loading</h4>
          <p className="mb-4 text-sm text-gray-600">
            {`Critical images can use \`loading="eager"\` to load immediately.`}
          </p>
          <Image
            src="/landing-page/fox.jpg"
            alt="Eager loaded image"
            width={400}
            height={300}
            className="rounded border object-cover"
            loading="eager"
          />
        </div>

        <CodeBlock language="tsx">
          {`// Eager loading (for critical images)
<Image
  src="/fox.jpg"
  alt="Eager loaded image"
  width={400}
  height={300}
  loading="eager"
/>`}
        </CodeBlock>

        {/* Blur data URL placeholder */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Blur Placeholder</h4>
          <p className="mb-4 text-sm text-gray-600">
            Display a blurred preview while the full image loads for a smoother
            UX.
          </p>
          <Image
            src="/landing-page/fox.jpg"
            alt="Blur placeholder image"
            width={400}
            height={300}
            className="rounded border object-cover"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            placeholder="blur"
          />
        </div>

        <CodeBlock language="tsx">
          {`// Blur placeholder
<Image
  src="/fox.jpg"
  alt="Blur placeholder"
  width={400}
  height={300}
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
  placeholder="blur"
/>`}
        </CodeBlock>

        {/* Solid color placeholders */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Color Placeholders</h4>
          <p className="mb-4 text-sm text-gray-600">
            Use solid backgrounds as simple placeholders.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-sm">Gray placeholder</p>
              <div className="flex min-h-[200px] items-center justify-center rounded border bg-gray-200 p-4">
                <Image
                  src="/landing-page/fox.jpg"
                  alt="Gray placeholder"
                  width={300}
                  height={200}
                  className="rounded object-cover"
                />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm">Blue placeholder</p>
              <div className="flex min-h-[200px] items-center justify-center rounded border bg-blue-100 p-4">
                <Image
                  src="/landing-page/fox.jpg"
                  alt="Blue placeholder"
                  width={300}
                  height={200}
                  className="rounded object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Color placeholder container
<div className="bg-gray-200 p-4 min-h-[200px] flex items-center justify-center">
  <Image
    src="/fox.jpg"
    alt="Placeholder example"
    width={300}
    height={200}
  />
</div>`}
        </CodeBlock>

        {/* Skeleton loading simulation */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Skeleton Loading Effect</h4>
          <p className="mb-4 text-sm text-gray-600">
            A CSS-based skeleton animation to mimic loading states.
          </p>
          <div className="space-y-4">
            {/* Actual image */}
            <div>
              <p className="mb-2 text-sm">Loaded state</p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Loaded image"
                width={400}
                height={300}
                className="rounded border object-cover"
              />
            </div>

            {/* Skeleton simulation */}
            <div>
              <p className="mb-2 text-sm">Skeleton while loading</p>
              <div className="h-[300px] w-[400px] animate-pulse rounded border bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]">
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <svg
                    className="h-12 w-12"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Skeleton loading CSS
<div className="w-[400px] h-[300px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse">
  <div className="w-full h-full flex items-center justify-center text-gray-400">
    {/* Image icon */}
  </div>
</div>`}
        </CodeBlock>

        {/* Long page simulation */}
        <div>
          <h4 className="mb-4 text-lg font-medium">
            Lazy Loading on Long Pages
          </h4>
          <p className="mb-4 text-sm text-gray-600">
            Scroll down to see images load progressively as they near the
            viewport.
          </p>
          <div className="space-y-8">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Image
                  src="/landing-page/fox.jpg"
                  alt={`Lazy loaded image ${index + 1}`}
                  width={200}
                  height={150}
                  className="flex-shrink-0 rounded border object-cover"
                  loading="lazy"
                />
                <div>
                  <h5 className="font-medium">Image {index + 1}</h5>
                  <p className="text-sm text-gray-600">
                    This image loads when it nears the viewport—watch the
                    network tab as you scroll.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Lazy loading within a list
{images.map((image, index) => (
  <div key={index} className="flex items-center gap-4">
    <Image
      src={image.src}
      width={200}
      height={150}
      loading="lazy" // Loads when near the viewport
    />
    <div>
      <h5>{image.title}</h5>
      <p>{image.description}</p>
    </div>
  </div>
))}`}
        </CodeBlock>
      </div>
    </ExampleContainer>
  );
}
