
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  ArrowDownRight,
  ArrowUpRight,
  Package,
  FileText,
  MessageSquare,
  Eye,
  Megaphone,
  Users,
  Activity,
  Handshake,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp, orderBy, limit } from 'firebase/firestore';
import { BlogPostByCategoryChart } from '@/components/admin/BlogPostByCategoryChart';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

// --- TYPES & INTERFACES ---

type TrendDirection = 'up' | 'down' | 'neutral';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendDirection: TrendDirection;
  icon: React.ElementType;
  isLoading?: boolean;
}

// --- ANIMATION VARIANTS ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

// --- REUSABLE COMPONENTS ---

const TrendIndicator: React.FC<{ direction: TrendDirection; value: string }> = ({
  direction,
  value,
}) => {
  const color =
    direction === 'up'
      ? 'text-emerald-500'
      : direction === 'down'
      ? 'text-red-500'
      : 'text-gray-500';
  const Icon =
    direction === 'up'
      ? ArrowUpRight
      : direction === 'down'
      ? ArrowDownRight
      : null;

  return (
    <div className={cn('flex items-center text-sm font-medium', color)}>
      {Icon && <Icon className="mr-1 h-4 w-4" />}
      {value}
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  trendDirection,
  icon: Icon,
  isLoading,
}) => (
  <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
    <Card className="rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-lg h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-xl bg-primary/5">
            <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-1" />
            </div>
        ) : (
            <>
                <div className="text-3xl font-black tracking-tighter font-headline">{value}</div>
                <TrendIndicator direction={trendDirection} value={trend} />
            </>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const MessageVolumeChart: React.FC<{messages: any[], isLoading: boolean}> = ({messages, isLoading}) => {
    const data = useMemo(() => {
        if (!messages) return [];
        const last7Days = Array.from({length: 7}).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return {
                date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                timestamp: d.setHours(0,0,0,0),
                count: 0
            };
        }).reverse();

        messages.forEach(msg => {
            const msgDate = (msg.createdAt as Timestamp)?.toDate();
            if (msgDate) {
                const msgDay = new Date(msgDate).setHours(0,0,0,0);
                const dayMatch = last7Days.find(d => d.timestamp === msgDay);
                if (dayMatch) dayMatch.count++;
            }
        });

        return last7Days;
    }, [messages]);

    return (
        <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline">Inquiry Volume</CardTitle>
                <CardDescription>Messages received over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full p-2">
                {isLoading ? <Skeleton className="h-full w-full" /> : (
                    <ResponsiveContainer>
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                        <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.75rem',
                        }}
                        cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />
                        <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCount)" name="Messages" />
                    </AreaChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
            </Card>
        </motion.div>
    );
};

const ActivityFeed: React.FC<{products: any[], posts: any[], isLoading: boolean}> = ({products, posts, isLoading}) => {
    const combinedActivity = useMemo(() => {
        const activity = [
            ...products.map(p => ({ ...p, type: 'product', date: p.createdAt })),
            ...posts.map(p => ({ ...p, type: 'post', date: p.publishDate }))
        ];
        return activity.sort((a, b) => {
            const dateA = (a.date as Timestamp)?.toMillis() || 0;
            const dateB = (b.date as Timestamp)?.toMillis() || 0;
            return dateB - dateA;
        }).slice(0, 6);
    }, [products, posts]);

    return (
        <motion.div variants={itemVariants}>
            <Card className="h-full rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Recent Updates</CardTitle>
                    <CardDescription>Latest changes to products and blogs</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {isLoading ? Array.from({length: 4}).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="space-y-2">
                               <Skeleton className="h-4 w-32" />
                               <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    )) : combinedActivity.map((item, idx) => (
                        <div key={item.id + idx} className="flex items-center gap-4 group">
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {item.imageUrl ? (
                                    <Image src={item.imageUrl} alt={item.name || item.title} fill className="object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-primary/5">
                                        {item.type === 'product' ? <Package className="h-4 w-4 text-primary" /> : <FileText className="h-4 w-4 text-primary" />}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{item.name || item.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter px-1.5 py-0">
                                        {item.type}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-2 w-2" />
                                        {(item.date as Timestamp)?.toDate().toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {!isLoading && combinedActivity.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                            <Activity className="h-8 w-8 text-muted-foreground/30 mb-2" />
                            <p className="text-sm text-muted-foreground">No recent activity detected.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};


// --- MAIN DASHBOARD COMPONENT ---

export default function DashboardPage() {
  const firestore = useFirestore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  // --- Firestore Queries ---
  const productsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  const blogPostsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'blogPosts') : null, [firestore]);
  const teamQuery = useMemoFirebase(() => firestore ? collection(firestore, 'teamMembers') : null, [firestore]);
  const partnersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'partners') : null, [firestore]);
  const messagesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'messages') : null, [firestore]);
  
  const twentyFourHoursAgo = useMemo(() => {
      const d = new Date();
      d.setHours(d.getHours() - 24);
      return Timestamp.fromDate(d);
  }, []);

  const recentMessagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'messages'), where('createdAt', '>=', twentyFourHoursAgo));
  }, [firestore, twentyFourHoursAgo]);

  const recentActivityProductsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'products'), orderBy('createdAt', 'desc'), limit(5)) : null, 
  [firestore]);

  // --- Data Fetching ---
  const { data: products, isLoading: isLoadingProducts } = useCollection(productsQuery);
  const { data: blogPosts, isLoading: isLoadingBlogPosts } = useCollection(blogPostsQuery);
  const { data: team, isLoading: isLoadingTeam } = useCollection(teamQuery);
  const { data: partners, isLoading: isLoadingPartners } = useCollection(partnersQuery);
  const { data: allMessages, isLoading: isLoadingMessages } = useCollection(messagesQuery);
  const { data: recentMessages, isLoading: isLoadingRecentMessages } = useCollection(recentMessagesQuery);
  const { data: recentProducts, isLoading: isLoadingRecentProducts } = useCollection(recentActivityProductsQuery);

  const statCardsData = [
    {
        title: 'Catalog',
        value: products?.length.toString() ?? '0',
        trend: '+2 New',
        trendDirection: 'up' as const,
        icon: Package,
        isLoading: isLoadingProducts,
    },
    {
        title: 'Articles',
        value: blogPosts?.length.toString() ?? '0',
        trend: 'Live',
        trendDirection: 'neutral' as const,
        icon: FileText,
        isLoading: isLoadingBlogPosts,
    },
    {
        title: 'Team Size',
        value: team?.length.toString() ?? '0',
        trend: 'Optimized',
        trendDirection: 'up' as const,
        icon: Users,
        isLoading: isLoadingTeam,
    },
    {
        title: 'Global Partners',
        value: partners?.length.toString() ?? '0',
        trend: 'Trusted',
        trendDirection: 'up' as const,
        icon: Handshake,
        isLoading: isLoadingPartners,
    },
    {
        title: 'Total Inquiries',
        value: allMessages?.length.toString() ?? '0',
        trend: 'History',
        trendDirection: 'neutral' as const,
        icon: Activity,
        isLoading: isLoadingMessages,
    },
    {
        title: 'New Inquiries',
        value: recentMessages?.length.toString() ?? '0',
        trend: 'Last 24h',
        trendDirection: 'up' as const,
        icon: MessageSquare,
        isLoading: isLoadingRecentMessages,
    },
  ];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-background">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-black tracking-tight font-headline">Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">System Real-Time Monitoring</span>
            </div>
        </div>
      </div>
      
      {/* Stat Cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statCardsData.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </motion.div>

      {/* Charts Row 1 */}
       <motion.div 
         className="grid grid-cols-1 lg:grid-cols-3 gap-6"
         variants={containerVariants}
         initial="hidden"
         animate="visible"
       >
        <MessageVolumeChart messages={allMessages || []} isLoading={isLoadingMessages} />
        <Card className="h-full rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline">Content Distribution</CardTitle>
                <CardDescription>Blog posts by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full p-2">
                {isLoadingBlogPosts ? <Skeleton className="h-full w-full" /> : (
                    <BlogPostByCategoryChart posts={blogPosts || []} />
                )}
            </CardContent>
        </Card>
      </motion.div>

      {/* Activity Feed */}
      <motion.div 
         className="grid grid-cols-1 lg:grid-cols-3 gap-6"
         variants={containerVariants}
         initial="hidden"
         animate="visible"
       >
        <div className="lg:col-span-2">
            <ActivityFeed 
                products={products || []} 
                posts={blogPosts || []} 
                isLoading={isLoadingProducts || isLoadingBlogPosts} 
            />
        </div>
        
        <Card className="rounded-2xl border-border/60 shadow-sm bg-primary/5 flex flex-col justify-center p-8 overflow-hidden relative group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl transition-all group-hover:scale-150" />
            <div className="relative z-10">
                <Megaphone className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-black font-headline mb-2">Internal Update</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Harvest season for Hass Avocados is approaching peak. Ensure product inventory is updated for European partners.
                </p>
                <Badge className="mt-4 bg-primary text-white">Action Required</Badge>
            </div>
        </Card>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.3);
        }
      `}</style>
    </div>
  );
}
