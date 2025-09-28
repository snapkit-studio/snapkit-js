'use client';

import { CodeBlock, ExampleContainer } from '@repo/demo-components';
import { Image } from '@snapkit-studio/nextjs';
import { useState } from 'react';

export function EventHandlersExample() {
  const [loadStatus, setLoadStatus] = useState<string>('Preparing...');
  const [errorStatus, setErrorStatus] = useState<string>('No errors');
  const [clickCount, setClickCount] = useState(0);
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (event: string) => {
    setEvents((prev) => [
      ...prev.slice(-4),
      `${new Date().toLocaleTimeString()}: ${event}`,
    ]);
  };

  const handleLoad = () => {
    setLoadStatus('✅ Loaded successfully');
    addEvent('Image loaded successfully');
  };

  const handleError = () => {
    setErrorStatus('❌ Load failed');
    addEvent('Image failed to load');
  };

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
    addEvent('Image clicked');
  };

  const resetStates = () => {
    setLoadStatus('Preparing...');
    setErrorStatus('No errors');
    setClickCount(0);
    setEvents([]);
  };

  return (
    <ExampleContainer
      title="Event Handlers"
      description="Shows how to handle image load, error, and user interaction events."
    >
      <div className="space-y-8">
        {/* Event status monitor */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Event Monitor</h4>
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded border border-blue-200 bg-blue-50 p-3">
              <span className="text-sm font-medium">Load status:</span>
              <div className="text-lg">{loadStatus}</div>
            </div>
            <div className="rounded border border-red-200 bg-red-50 p-3">
              <span className="text-sm font-medium">Error status:</span>
              <div className="text-lg">{errorStatus}</div>
            </div>
            <div className="rounded border border-green-200 bg-green-50 p-3">
              <span className="text-sm font-medium">Click count:</span>
              <div className="text-lg">{clickCount}x</div>
            </div>
          </div>
          <div className="rounded border border-gray-200 bg-gray-50 p-3">
            <span className="text-sm font-medium">Recent events:</span>
            <div className="mt-2 space-y-1">
              {events.length > 0 ? (
                events.map((event, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {event}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-400">No events yet</div>
              )}
            </div>
          </div>
          <button
            onClick={resetStates}
            className="mt-2 rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
          >
            Reset state
          </button>
        </div>

        {/* onLoad event */}
        <div>
          <h4 className="mb-4 text-lg font-medium">onLoad Event</h4>
          <p className="mb-4 text-sm text-gray-600">
            The onLoad event triggers after the image finishes loading.
          </p>
          <Image
            src="/landing-page/fox.jpg"
            alt="Load event demo"
            width={400}
            height={300}
            className="cursor-pointer rounded border transition-opacity hover:opacity-80"
            onLoad={handleLoad}
            onClick={handleClick}
          />
        </div>

        <CodeBlock language="tsx">
          {`const handleLoad = () => {
  console.log('Image finished loading');
  setLoadStatus('Loaded successfully');
};

<Image
  src="/fox.jpg"
  alt="Load event demo"
  width={400}
  height={300}
  onLoad={handleLoad}
/>`}
        </CodeBlock>

        {/* onError event */}
        <div>
          <h4 className="mb-4 text-lg font-medium">onError Event</h4>
          <p className="mb-4 text-sm text-gray-600">
            Trigger an error by pointing to a non-existent image.
          </p>
          <Image
            src="/non-existent-image.jpg"
            alt="Error event demo"
            width={400}
            height={300}
            className="rounded border bg-gray-100"
            onError={handleError}
          />
          <p className="mt-2 text-xs text-gray-500">
            The image above intentionally uses an invalid path so you can
            observe the error handler.
          </p>
        </div>

        <CodeBlock language="tsx">
          {`const handleError = () => {
  console.log('Image failed to load');
  setErrorStatus('Load failed');
};

<Image
  src="/non-existent-image.jpg"
  alt="Error event demo"
  width={400}
  height={300}
  onError={handleError}
/>`}
        </CodeBlock>

        {/* Managing loading state */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Manage Loading State</h4>
          <p className="mb-4 text-sm text-gray-600">
            Combine onLoad and onError to control loading state.
          </p>
          <LoadingStateImage />
        </div>

        <CodeBlock language="tsx">
          {`function LoadingStateImage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center h-64 bg-red-50 border border-red-200">
          <span className="text-red-600">Unable to load the image</span>
        </div>
      )}
      <Image
        src="/fox.jpg"
        alt="Manage loading state"
        width={400}
        height={300}
        onLoad={handleLoad}
        onError={handleError}
        className={loading || error ? 'invisible' : 'visible'}
      />
    </div>
  );
}`}
        </CodeBlock>

        {/* User interaction events */}
        <div>
          <h4 className="mb-4 text-lg font-medium">User Interaction Events</h4>
          <p className="mb-4 text-sm text-gray-600">
            Handle user interactions such as click and hover.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Clickable image */}
            <div>
              <h5 className="mb-2 font-medium">Clickable Image</h5>
              <Image
                src="/landing-page/fox.jpg"
                alt="Clickable image"
                width={300}
                height={200}
                className="cursor-pointer rounded border transition-transform hover:scale-105"
                onClick={handleClick}
              />
              <p className="mt-2 text-sm text-gray-600">
                Try clicking the image!
              </p>
            </div>

            {/* Hover effect */}
            <div>
              <h5 className="mb-2 font-medium">Hover Effect</h5>
              <Image
                src="/landing-page/fox.jpg"
                alt="Hover effect image"
                width={300}
                height={200}
                className="rounded border transition-all duration-300 hover:opacity-75 hover:grayscale"
                transforms={{ blur: 0 }}
              />
              <p className="mt-2 text-sm text-gray-600">
                Hover over the image!
              </p>
            </div>
          </div>
        </div>

        <CodeBlock language="tsx">
          {`// Click event
<Image
  onClick={(e) => {
    console.log('Image clicked', e);
    setClickCount(prev => prev + 1);
  }}
  className="cursor-pointer hover:scale-105 transition-transform"
/>

// Hover effect (CSS)
<Image
  className="hover:opacity-75 hover:grayscale transition-all duration-300"
/>`}
        </CodeBlock>

        {/* Form integration */}
        <div>
          <h4 className="mb-4 text-lg font-medium">Form Integration</h4>
          <p className="mb-4 text-sm text-gray-600">
            Useful for image selection or preview features.
          </p>
          <ImageSelectionForm />
        </div>

        <CodeBlock language="tsx">
          {`function ImageSelectionForm() {
  const [selectedImage, setSelectedImage] = useState('');

  const images = ['/fox.jpg', '/cat.jpg', '/dog.jpg'];

  return (
    <form>
      <div className="grid grid-cols-3 gap-4">
        {images.map((src, index) => (
          <label key={index} className="cursor-pointer">
            <input
              type="radio"
              name="image"
              value={src}
              onChange={(e) => setSelectedImage(e.target.value)}
              className="sr-only"
            />
            <Image
              src={src}
              width={150}
              height={100}
            />
          </label>
        ))}
      </div>
    </form>
  );
}`}
        </CodeBlock>
      </div>
    </ExampleContainer>
  );
}

// Loading state management component
function LoadingStateImage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const reload = () => {
    setLoading(true);
    setError(false);
    // Force reload the image
    const timestamp = Date.now();
    const img = document.querySelector('#reload-image') as HTMLImageElement;
    if (img) {
      img.src = `/landing-page/fox.jpg?t=${timestamp}`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative h-[300px] w-[400px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded border bg-gray-100">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center rounded border border-red-200 bg-red-50">
            <div className="text-center">
              <span className="block text-red-600">
                Unable to load the image
              </span>
              <button
                onClick={reload}
                className="mt-2 rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
              >
                Try again
              </button>
            </div>
          </div>
        )}
        <Image
          id="reload-image"
          src="/landing-page/fox.jpg"
          alt="Manage loading state"
          width={400}
          height={300}
          className={`rounded border ${loading || error ? 'invisible' : 'visible'}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
      <button
        onClick={reload}
        className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
      >
        Reload image
      </button>
    </div>
  );
}

// Image selection form component
function ImageSelectionForm() {
  const [selectedImage, setSelectedImage] = useState('');

  const images = [
    { src: '/landing-page/fox.jpg', name: 'Fox' },
    { src: '/landing-page/fox.jpg', name: 'Cat (same image)' },
    { src: '/landing-page/fox.jpg', name: 'Dog (same image)' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <label key={index} className="cursor-pointer">
            <input
              type="radio"
              name="image"
              value={image.src}
              onChange={(e) => setSelectedImage(e.target.value)}
              className="sr-only"
            />
            <Image
              src={image.src}
              alt={image.name}
              width={150}
              height={100}
              className={`w-full rounded border-2 transition-all ${
                selectedImage === image.src
                  ? 'scale-105 border-blue-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            />
            <p className="mt-2 text-center text-sm">{image.name}</p>
          </label>
        ))}
      </div>
      {selectedImage && (
        <div className="rounded border border-green-200 bg-green-50 p-3">
          <span className="text-green-800">
            Selected image: {selectedImage}
          </span>
        </div>
      )}
    </div>
  );
}
