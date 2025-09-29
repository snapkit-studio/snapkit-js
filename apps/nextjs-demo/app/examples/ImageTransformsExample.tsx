import { CodeBlock, ExampleContainer } from '@repo/demo-components';
import { Image } from '@snapkit-studio/nextjs';

export function ImageTransformsExample() {
  return (
    <ExampleContainer
      title="Image Transform Effects"
      description="Demonstrates how to apply a variety of image transforms."
    >
      <div className="space-y-8">
        {/* Basic transforms */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Basic Transform Effects</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {/* Original */}
            <div>
              <p className="mb-2 text-sm font-medium">Original</p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Original image"
                width={200}
                height={150}
                className="rounded border object-cover"
              />
            </div>

            {/* Grayscale */}
            <div>
              <p className="mb-2 text-sm font-medium">Grayscale</p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Grayscale image"
                width={200}
                height={150}
                className="rounded border object-cover"
                transforms={{ grayscale: true }}
              />
            </div>

            {/* Blur */}
            <div>
              <p className="mb-2 text-sm font-medium">Blur Effect</p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Blurred image"
                width={200}
                height={150}
                className="rounded border object-cover"
                transforms={{ blur: 5 }}
              />
            </div>

            {/* Horizontal flip */}
            <div>
              <p className="mb-2 text-sm font-medium">Horizontal Flip (Flop)</p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Horizontally flipped image"
                width={200}
                height={150}
                className="rounded border object-cover"
                transforms={{ flop: true }}
              />
            </div>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Basic transform effects
<Image
  src="/landing-page/fox.jpg"
  alt="Grayscale image"
  width={200}
  height={150}
  transforms={{ grayscale: true }}
/>

<Image
  src="/landing-page/fox.jpg"
  alt="Blurred image"
  transforms={{ blur: 5 }}
/>

<Image
  src="/landing-page/fox.jpg"
  alt="Horizontal flip"
  transforms={{ flop: true }}
/>`}
        </CodeBlock>

        {/* Flip effects */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Flip Effects</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div>
              <p className="mb-2 text-sm font-medium">Original</p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Original"
                width={200}
                height={150}
                className="rounded border object-cover"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Vertical Flip (Flip)</p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Vertically flipped"
                width={200}
                height={150}
                className="rounded border object-cover"
                transforms={{ flip: true }}
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">
                Horizontal + Vertical Flip
              </p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Both flips"
                width={200}
                height={150}
                className="rounded border object-cover"
                transforms={{ flip: true, flop: true }}
              />
            </div>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Flip effects
<Image transforms={{ flip: true }} />      // Vertical flip
<Image transforms={{ flop: true }} />      // Horizontal flip
<Image transforms={{ flip: true, flop: true }} />  // Both
`}
        </CodeBlock>

        {/* Composite effects */}
        <div>
          <h4 className="mb-4 text-lg font-medium">
            Composite Transform Effects
          </h4>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <p className="mb-2 text-sm font-medium">Grayscale + Blur</p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Grayscale + blur"
                width={200}
                height={150}
                className="rounded border object-cover"
                transforms={{
                  grayscale: true,
                  blur: 3,
                }}
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">
                Horizontal + Vertical Flip + Grayscale
              </p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Composite effect"
                width={200}
                height={150}
                className="rounded border object-cover"
                transforms={{
                  flip: true,
                  flop: true,
                  grayscale: true,
                }}
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Full Effect Combo</p>
              <Image
                src="/landing-page/fox.jpg"
                alt="Full effect"
                width={200}
                height={150}
                className="rounded border object-cover"
                quality={70}
                transforms={{
                  grayscale: true,
                  blur: 2,
                  flop: true,
                }}
              />
            </div>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Composite transform effects
<Image
  src="/landing-page/fox.jpg"
  transforms={{
    grayscale: true,
    blur: 3
  }}
/>

<Image
  transforms={{
    flip: true,
    flop: true,
    grayscale: true
  }}
/>

<Image
  quality={70}
  transforms={{
    grayscale: true,
    blur: 2,
    flop: true,
  }}
/>`}
        </CodeBlock>
      </div>
    </ExampleContainer>
  );
}
