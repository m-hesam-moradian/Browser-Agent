import './globals.css';

export const metadata = {
  title: 'Browser Automation Interface',
  description: 'Control your Puppeteer AI Studio sessions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
