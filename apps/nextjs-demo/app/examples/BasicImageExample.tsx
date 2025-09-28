import { CodeBlock, ExampleContainer } from '@repo/demo-components';
import { Image } from '@snapkit-studio/nextjs';

export function BasicImageExample() {
  return (
    <ExampleContainer
      title="Basic Image Usage"
      description="Shows the fundamental usage of the Snapkit Image component."
    >
      <div className="space-y-6">
        {/* Basic image */}
        <div>
          <h4 className="mb-3 text-lg font-medium">Basic Image</h4>
          <Image
            src="/landing-page/fox.jpg"
            alt="Fox image"
            width={400}
            height={300}
            className="rounded-lg border"
          />
        </div>

        {/* Code example */}
        <CodeBlock language="tsx">
          {`import { Image } from '@snapkit-studio/nextjs';

function BasicExample() {
  return (
    <Image
      src="/landing-page/fox.jpg"
      alt="Fox image"
      width={400}
      height={300}
      className="rounded-lg border"
    />
  );
}`}
        </CodeBlock>

        {/* Fill mode */}
        <div>
          <h4 className="mb-3 text-lg font-medium">
            Fill Mode (Fill the container)
          </h4>
          <div className="relative h-64 w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src="/landing-page/fox.jpg"
              alt="Fox image - Fill mode"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Image that fills the container
<div className="relative w-full h-64">
  <Image
    src="/landing-page/fox.jpg"
    alt="Fox image - Fill mode"
    fill
    className="object-cover"
  />
</div>`}
        </CodeBlock>

        {/* Various sizes */}
        <div>
          <h4 className="mb-3 text-lg font-medium">Different Sizes</h4>
          <div className="flex flex-wrap gap-4">
            <Image
              src="/landing-page/fox.jpg"
              alt="Small image"
              width={120}
              height={90}
              className="rounded border"
            />
            <Image
              src="/landing-page/fox.jpg"
              alt="Medium image"
              width={200}
              height={150}
              className="rounded border"
            />
            <Image
              src="/landing-page/fox.jpg"
              alt="Large image"
              width={300}
              height={225}
              className="rounded border"
            />
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Images in different sizes
<div className="flex gap-4">
  <Image src="/fox.jpg" alt="Small image" width={120} height={90} />
  <Image src="/fox.jpg" alt="Medium image" width={200} height={150} />
  <Image src="/fox.jpg" alt="Large image" width={300} height={225} />
</div>`}
        </CodeBlock>
      </div>
    </ExampleContainer>
  );
}
