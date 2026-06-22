import DesktopBanner from "./DesktopBanner";

// Desktop always sees the landing page — the app is mobile/tablet only.
export default function MobileGate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopBanner />
      </div>
      <div className="lg:hidden">{children}</div>
    </>
  );
}
