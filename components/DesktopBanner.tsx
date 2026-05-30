import Image from "next/image";

export default function DesktopBanner() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.45,
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-12 py-6">
        <Image
          src="/proply-logo.png"
          alt="Proptally"
          width={140}
          height={36}
          className="object-contain"
          priority
        />
        <div className="flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-slate-500">
          <span>For Real Estate Brokers</span>
          <a
            href="#"
            className="flex items-center gap-2 rounded border border-slate-800 px-4 py-2 text-slate-800 transition hover:bg-slate-800 hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download App
          </a>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex min-h-[calc(100vh-88px)] items-center">
        {/* Left */}
        <div className="flex flex-1 flex-col justify-center px-12 py-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#FF4405]">
            India&apos;s Smartest Broker App
          </p>

          <h1 className="mb-8 font-extrabold uppercase leading-none tracking-tight text-slate-200">
            <span className="block text-[clamp(3rem,6vw,5.5rem)]">
              Find Property
            </span>
            <span className="block text-[clamp(3rem,6vw,5.5rem)] text-slate-400">
              Inventory
            </span>
            <span className="block text-[clamp(3rem,6vw,5.5rem)] text-[#FF4405]">
              In Seconds.
            </span>
          </h1>

          <p className="mb-10 max-w-sm text-sm leading-relaxed text-slate-500">
            Proptally is a{" "}
            <strong className="text-slate-700">
              mobile app built exclusively for real estate brokers
            </strong>{" "}
            — helping you search residential &amp; commercial inventory in your
            vicinity with <strong className="text-slate-700">smart multi-filters</strong>. No
            WhatsApp chaos. Just results.
          </p>

          {/* App store buttons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm transition hover:shadow-md"
            >
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Download on the</div>
                <div className="text-sm font-semibold text-slate-800">App Store</div>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm transition hover:shadow-md"
            >
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                <path d="M3.18 23.76c.3.17.65.19.98.06l12.76-7.37-2.78-2.79-10.96 10.1z" fill="#EA4335"/>
                <path d="M22.54 10.26l-2.88-1.67-3.13 3.13 3.13 3.13 2.9-1.67a1.65 1.65 0 000-2.92z" fill="#FBBC04"/>
                <path d="M2.16.24A1.64 1.64 0 000 1.72v20.56c0 .7.42 1.3 1.03 1.57L13.3 12 2.16.24z" fill="#4285F4"/>
                <path d="M16.92 12L3.18.24c-.34-.14-.7-.13-1 .03L14.14 12l2.78-2.78 2.78 2.78-2.78 2.78L3.18 23.73c.3.16.65.17.98.04L16.92 12z" fill="#34A853"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Get it on</div>
                <div className="text-sm font-semibold text-slate-800">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* Right — visual panel */}
        <div className="flex flex-1 items-center justify-center px-12 py-16">
          <div className="relative flex items-center justify-center">
            {/* Main phone card */}
            <div className="relative z-10 w-64 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_40px_120px_rgba(0,0,0,0.18)]">
              {/* Phone status bar */}
              <div className="flex items-center justify-between bg-white px-6 pt-5 pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF4405]" />
                  <span className="text-xs font-bold text-slate-800 tracking-tight">
                    PROP<span className="text-[#FF4405]">TALLY</span>
                  </span>
                </div>
                <div className="h-3 w-3 rounded-full bg-[#FF4405]" />
              </div>

              {/* Search bar mock */}
              <div className="px-4 py-2">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                  <svg className="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
                  </svg>
                  <span className="text-[10px] text-slate-400">Search locality...</span>
                </div>
              </div>

              {/* Filter pills */}
              <div className="flex gap-2 px-4 pb-2">
                <span className="rounded-full border border-[#FF4405] px-3 py-1 text-[10px] font-medium text-[#FF4405]">Residential</span>
                <span className="rounded-full border border-slate-300 px-3 py-1 text-[10px] font-medium text-slate-500">3 BHK</span>
              </div>

              {/* Property cards */}
              <div className="space-y-2 px-4 pb-4">
                {[
                  { name: "3BHK · Sushant Lok 1", price: "₹1.1 Cr" },
                  { name: "3BHK · South City 1", price: "₹95 L" },
                  { name: "2BHK · Golf Course Ext", price: "₹78 L" },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-semibold text-slate-700">{p.name}</span>
                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-[8px] font-bold text-green-700">
                        Ready
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-[#FF4405]" />
                      <span className="text-[10px] font-bold text-[#FF4405]">{p.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total count bar */}
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                <span className="text-[10px] text-slate-400">Total matches</span>
                <span className="text-base font-bold text-slate-800">27</span>
              </div>
            </div>

            {/* Floating location chip */}
            <div className="absolute -left-10 top-16 z-20 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-lg">
              <div className="h-3 w-3 rounded-full bg-[#FF4405]" />
              <span className="text-xs font-semibold text-slate-700">Sushant Lok 1</span>
            </div>

            {/* Floating match chip */}
            <div className="absolute -bottom-4 -left-8 z-20 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-lg">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-slate-700">31 matches found</span>
            </div>

            {/* Second phone card (behind) */}
            <div className="absolute -right-16 top-8 z-0 w-52 overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.10)] opacity-80">
              <div className="px-4 pt-4 pb-2">
                <span className="text-[10px] font-semibold text-slate-500">Commercial + Residential</span>
              </div>
              <div className="space-y-2 px-4 pb-4">
                {["Sector 48 · Gurgaon", "DLF Phase 3", "Vatika City"].map((loc) => (
                  <div key={loc} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                    <span className="text-[10px] font-medium text-slate-600">{loc}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 px-4 py-2">
                <span className="text-[10px] font-bold text-[#FF4405]">⚡ 5+ Smart Filters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-slate-100 px-12 py-4">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-slate-300">
          <span>Proptally.com</span>
          <div className="flex gap-6">
            <span>#ourbrokerswin</span>
            <span>#proptally</span>
            <span>#searchlikeanexpert</span>
          </div>
        </div>
      </div>
    </div>
  );
}
