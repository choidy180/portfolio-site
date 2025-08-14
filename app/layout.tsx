import AOSProvider from "@/components/AOSProvider";
import ViewportGate from "@/components/viewport/viewport-gate";
import { GlobalStyle } from "@/styles/GlobalStyle";
import 'aos/dist/aos.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <title>민석킴</title>
      <body>
        <ViewportGate minWidth={1400}>
          <AOSProvider>
            <GlobalStyle />
            {children}
          </AOSProvider>
        </ViewportGate>
      </body>
    </html>
  );
}
