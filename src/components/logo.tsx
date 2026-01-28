import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex -left-24 gap-2" aria-label="Export Optimum">
      <Image src="/EOLogo.png" alt="EXPORT OPTIMUM" width={60} height={60} className='-left-24'/>
      <span className="font-subtitle items-center text-6xl pl-2 text-[#719507] text-bold ">Export Optimum</span>
    </div>
  );
}
