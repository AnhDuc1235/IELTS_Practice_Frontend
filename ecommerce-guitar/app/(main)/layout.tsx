import { Suspense } from "react";
import SiteHeader from "./_components/SiteHeader";
import StayInTouchGate from "./_components/StayInTouchGate";
import SiteFooter from "./_components/SiteFooter";
import BackToTop from "./_components/back-to-top";
import { AuthProvider } from "./_context/AuthProvider";
import GoogleOAuthCallbackHandler from "./_components/GoogleOAuthCallbackHandler";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <GoogleOAuthCallbackHandler />
      </Suspense>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <StayInTouchGate />
        <SiteFooter />
        <BackToTop />
      </div>
    </AuthProvider>
  );
}
