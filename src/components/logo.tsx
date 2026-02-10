import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2" aria-label="Export Optimum">
      <Image src="/EOLogo.png" alt="EXPORT OPTIMUM" width={60} height={60} />
      <span className="font-subtitle items-center text-6xl pl-2 text-[#719507] text-bold hidden md:inline">Export Optimum</span>
    </div>
  );
}
