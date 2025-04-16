import React from "react";

export const Index = () => {
  return (
    <div className="relative h-screen w-full border border-neutral-800 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute inset-0"></div>
      </div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-10"></div>

      {/* Navigation */}
      <nav className="h-10 flex justify-end gap-4 items-center Lexend-Regular text-slate-100 text-sm pr-14 text-semibold">
        <a href="#">Installation</a>
        <a href="#docs">Documentation</a>
        <a href="/signup">Sign up</a>
      </nav>

      {/* Main hero content */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
        <span className="flex flex-col Lexend-Bold text-4xl text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200">
            Haven
          </span>
          <span className="text-base w-92 text-slate-100 mt-4 max-w-md">
            Save and share static code snapshots in one command — no history,
            just simplicity.
          </span>
        </span>

        {/* Terminal mockup */}
        <div className="mockup-code bg-neutral-800 max-w-lg mx-auto mt-8 w-full p-1">
          <pre data-prefix="$">
            <code>haven init</code>
          </pre>
          <pre data-prefix=">" className="text-success">
            <code>Snapshot uploaded to: https://haven.dev/p/abc123</code>
          </pre>
        </div>

        {/* CTA Button */}
        <button className="z-10 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-shadow duration-300 ease-in-out mt-8">
          Get Started
        </button>
        {/* Features grid */}
        <div className="flex justify-center gap-8 mt-16">
          {[
            {
              icon: "⚡",
              title: "Instant",
              desc: "No commits, just snapshots",
            },
            { icon: "🔗", title: "Shareable", desc: "URL for every upload" },
            { icon: "📦", title: "Simple", desc: "Zero configuration" },
          ].map((item) => (
            <div key={item.title} className="text-center max-w-xs">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-slate-100">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full py-4 text-center text-xs text-slate-400">
        <p>
          Loved by developers at{" "}
          <span className="font-semibold">Acme, Stark, Wayne Enterprises</span>
        </p>
      </footer>
    </div>
  );
};
