import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { ScriptProvider } from "@/context/ScriptContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShadowTalk | Master Speaking",
  description: "Improve your pronunciation through shadowing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              <ScriptProvider>
                {children}
              </ScriptProvider>
            </main>
          </AuthProvider>
          {/* Simple Footer */}
          <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-100 bg-white">
            © 2025 ShadowTalk - Practice Makes Perfect
          </footer>
        </div>
      </body>
    </html>
  );
}