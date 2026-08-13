import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/ThemeProvider";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AWS Route 53 Clone",
  description: "A clone of the AWS Route 53 console",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-[#0f1b2a] text-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Header />
          <div className="flex flex-1 h-[calc(100vh-57px)]">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}