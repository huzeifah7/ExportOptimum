import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="Export Optimum">
      <Image src="/EOLogo.png" alt="EXPORT OPTIMUM" width={60} height={60} />
      <span className="font-subtitle text-3xl text-foreground">Export Optimum</span>
    </div>
  );
}
