import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatPopup from "@/components/chat/ChatPopup";
import ChatListener from "@/components/chat/ChatListener";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "VaraNow — Bangladesh Property Marketplace",
  description: "Find and list properties across Bangladesh",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-200">
        <Header />
        <main className="flex-1 pt-[73px]">{children}</main>
        <Footer />
        <ChatListener userId={user?.id} />
        <ChatPopup currentUserId={user?.id} />
      </body>
    </html>
  );
}
