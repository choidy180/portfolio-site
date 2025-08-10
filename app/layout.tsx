import { GlobalStyle } from "@/styles/GlobalStyle";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <title>민석킴</title>
            <body>
                <GlobalStyle />
                {children}
            </body>
        </html>
    );
}
