import '../global.css';

export const metadata = {
  title: 'Snapkit Next.js Demo',
  description: "Explore the features of Snapkit's Next.js image components.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
