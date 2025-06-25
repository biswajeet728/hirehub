import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Nunito_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HireHUB - Job Portal",
  description:
    "HireHUB is a modern job portal designed to connect job seekers with employers seamlessly. Explore job listings, post vacancies, and manage applications effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <main>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "bg-slate-800 text-white",
              style: {
                borderRadius: "8px",
                padding: "10px",
                fontSize: "14px",
              },
            }}
          />
        </main>
      </body>
    </html>
  );
}
