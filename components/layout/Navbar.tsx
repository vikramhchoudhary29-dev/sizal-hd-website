import Button from '@/components/ui/Button';
import { siteConfig } from '@/lib/site';

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full px-4 py-4 md:px-6">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-[24px] border border-white/70 bg-white/75 px-5 shadow-2xl shadow-blue-950/10 backdrop-blur-2xl md:h-20 md:px-7">
        <a href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-400 to-emerald-400 text-sm font-black text-white shadow-lg shadow-blue-500/25">
            SH
          </span>
          <span className="bg-gradient-to-r from-blue-700 via-cyan-500 to-emerald-500 bg-clip-text text-xl font-black tracking-[-0.04em] text-transparent md:text-2xl">
            SIZAL HD
          </span>
        </a>

        <div className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex">
          {siteConfig.nav.slice(1).map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-blue-600">
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button href="#dealer" className="hidden px-6 py-3 md:inline-flex">
            Become Dealer
          </Button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-950 lg:hidden">
            <span className="text-xl leading-none">≡</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
