import AOSProvider from "@/components/AOSProvider";
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
                <AOSProvider>
                    <GlobalStyle />
                    {children}
                </AOSProvider>
            </body>
        </html>
    );
}
