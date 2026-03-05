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
          <GiftTracker />
      </AppProvider>
  );
}
