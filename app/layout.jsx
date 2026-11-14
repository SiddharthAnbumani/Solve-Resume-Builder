import { Inter, Montserrat, Tinos, Carlito } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./components/AuthProvider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-mont",
  subsets: ["latin"],
});

// Resume font option (see lib/fonts.js).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Metric-compatible stand-ins for Times New Roman and Calibri, used only
// when the real fonts aren't installed (e.g. Linux, Android).
const tinos = Tinos({
  variable: "--font-tinos",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const carlito = Carlito({
  variable: "--font-carlito",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Solve Resumé",
  applicationName: "Solve Resumé",
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
  // Installed on the home screen (iOS): black status bar / notch area.
  appleWebApp: { capable: true, title: "Solve Resumé", statusBarStyle: "black" },
  description: "Edit your resume in a form and download it as a PDF.",
};

// theme-color tints the browser's top bar (Android Chrome, Safari) black.
// colorScheme keeps overscroll and safe areas from flipping to white.
export const viewport = { themeColor: "#000000", colorScheme: "light" };

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} ${tinos.variable} ${carlito.variable}`}
    >
      <body className="font-montserrat antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
