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
  src="/landing-page/fox.jpg"
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
  src="/landing-page/fox.jpg"
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
  src="/landing-page/fox.jpg"
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
    src="/landing-page/fox.jpg"
    alt="Placeholder example"
    width={300}
    height={200}
  />
</div>`}
        </CodeBlock>
      </div>
    </ExampleContainer>
  );
}
