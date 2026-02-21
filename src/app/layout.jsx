// Style
import "./globals.css";

// Fonts
import { Rubik } from "next/font/google";

// Fonts Variables
const rubik = Rubik({
  subsets: ["latin"],
  preload: true,
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "GTA V",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={rubik.className}>{children}</body>
    </html>
  );
}