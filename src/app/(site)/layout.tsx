import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PresenceHeartbeat from "@/components/PresenceHeartbeat";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PresenceHeartbeat />
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
