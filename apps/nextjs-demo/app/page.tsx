import { DemoLayout, type NavGroup } from '@repo/demo-components';

import { AdvancedTransformsExample } from './examples/AdvancedTransformsExample';
import { BasicImageExample } from './examples/BasicImageExample';
import { CdnConfigurationExample } from './examples/CdnConfigurationExample';
import { ImageTransformsExample } from './examples/ImageTransformsExample';
import { LazyLoadingExample } from './examples/LazyLoadingExample';
import { PriorityLoadingExample } from './examples/PriorityLoadingExample';
import { ResponsiveImagesExample } from './examples/ResponsiveImagesExample';

const navigation: NavGroup[] = [
  {
    title: 'Basic Features',
    items: [
      { id: 'basic', title: 'Basic Image Usage', href: '#basic' },
      { id: 'transforms', title: 'Image Transforms', href: '#transforms' },
    ],
    defaultOpen: true,
  },
  {
    title: 'Configuration',
    items: [
      { id: 'cdn-config', title: 'CDN Configuration', href: '#cdn-config' },
    ],
  },
  {
    title: 'Responsive & Loading',
    items: [
      { id: 'responsive', title: 'Responsive Images', href: '#responsive' },
      { id: 'lazy-loading', title: 'Lazy Loading', href: '#lazy-loading' },
      {
        id: 'priority-loading',
        title: 'Priority Loading',
        href: '#priority-loading',
      },
    ],
    defaultOpen: false,
  },
  {
    title: 'Advanced Features',
    items: [
      {
        id: 'event-handlers',
        title: 'Event Handlers',
        href: '#event-handlers',
      },
      {
        id: 'advanced-transforms',
        title: 'Advanced Transforms',
        href: '#advanced-transforms',
      },
    ],
    defaultOpen: false,
  },
];

export default function Home() {
  return (
    <DemoLayout
      title="Snapkit Next.js Demo"
      description="Explore the features of Snapkit's Next.js image components rendering and optimizations."
      navigation={navigation}
    >
      <div className="space-y-16">
        <section id="basic">
          <BasicImageExample />
        </section>

        <section id="cdn-config">
          <CdnConfigurationExample />
        </section>

        <section id="transforms">
          <ImageTransformsExample />
        </section>

        <section id="responsive">
          <ResponsiveImagesExample />
        </section>

        <section id="lazy-loading">
          <LazyLoadingExample />
        </section>

        <section id="priority-loading">
          <PriorityLoadingExample />
        </section>

        <section id="advanced-transforms">
          <AdvancedTransformsExample />
        </section>
      </div>
    </DemoLayout>
  );
}
