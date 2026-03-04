"use client";

import dynamic from "next/dynamic";
import {AppProvider} from "@/context/AppContext";

const GiftTracker = dynamic(
    () => import("@/components/GiftTracker").then(m => m.GiftTracker),
    { ssr: false }
);

export default function Home() {
  return (
      <AppProvider>
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <GiftTracker />
        </div>
      </AppProvider>
  );
}
