import { Ship, Users, Globe } from 'lucide-react';

const stats = [
  { icon: <Ship className="w-8 h-8 text-primary" />, value: '10,000+', label: 'Tons of yearly export' },
  { icon: <Users className="w-8 h-8 text-primary" />, value: '500+', label: 'Employees' },
  { icon: <Globe className="w-8 h-8 text-primary" />, value: '50+', label: 'Major Customers' },
];

export default function KeyFigures() {
  return (
    <div className="relative z-10 -mt-16 mb-16">
        <div className="container mx-auto px-4">
            <div className="w-full max-w-5xl mx-auto bg-background/80 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center justify-center p-4">
                        {stat.icon}
                        <div className='mt-2 text-center'>
                            <p className="text-2xl md:text-4xl font-bold font-headline text-foreground">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    </div>
  );
}
