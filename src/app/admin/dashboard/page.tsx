
'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, Timestamp, orderBy, limit } from 'firebase/firestore';
import { BlogPostByCategoryChart } from '@/components/admin/BlogPostByCategoryChart';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

// --- DUMMY DATA (for components not connected to live data) ---

const lineChartData = [
  { name: 'Jan', views: 4000 },
  { name: 'Feb', views: 3000 },
  { name: 'Mar', views: 5000 },
  { name: 'Apr', views: 4500 },
  { name: 'May', views: 6000 },
  { name: 'Jun', views: 5500 },
  { name: 'Jul', views: 7000 },
];

const initialPieChartData = [
  { name: 'Facebook', value: 400 },
  { name: 'Instagram', value: 300 },
  { name: 'LinkedIn', value: 300 },
  { name: 'Twitter', value: 200 },
];

const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
    <Card className="rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-1" />
            </>
        ) : (
            <>
                <div className="text-3xl font-bold">{value}</div>
                <TrendIndicator direction={trendDirection} value={trend} />
            </>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const LineChartCard: React.FC = () => (
  <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="lg:col-span-2">
    <Card className="h-full rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle>Website Views</CardTitle>
        <CardDescription>Views over the last 7 months</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full p-2">
        <ResponsiveContainer>
          <AreaChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
              }}
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorViews)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </motion.div>
);

const BarChartCard: React.FC<{posts: any[], isLoading: boolean}> = ({posts, isLoading}) => (
  <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
     <Card className="h-full rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle>Content Performance</CardTitle>
        <CardDescription>Number of blog posts by category</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full p-2">
        {isLoading ? (
            <div className="flex items-center justify-center h-full">
                <Skeleton className="h-full w-full" />
            </div>
        ) : (
            <BlogPostByCategoryChart posts={posts} />
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const DonutChartCard: React.FC<{ socialData: { name: string, value: number }[] }> = ({ socialData }) => (
  <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="lg:col-span-2">
    <Card className="h-full rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle>Social Traffic Sources</CardTitle>
        <CardDescription>Breakdown of visitors from social media</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full p-2">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={socialData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {socialData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
              }}
            />
            <Legend iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </motion.div>
);

const RecentActivity: React.FC<{products: any[], isLoading: boolean}> = ({products, isLoading}) => (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
        <Card className="h-full rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-lg">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest products added to the catalog</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] space-y-4 overflow-y-auto">
                {isLoading && Array.from({length: 3}).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-32" />
                           <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                ))}
                {!isLoading && products.map(product => (
                    <div key={product.id} className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                            {product.imageUrl && <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />}
                        </div>
                        <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                        </div>
                    </div>
                ))}
                {!isLoading && products.length === 0 && <p className="text-muted-foreground">No recent product activity.</p>}
            </CardContent>
        </Card>
    </motion.div>
);


// --- MAIN DASHBOARD COMPONENT ---

export default function DashboardPage() {
  const firestore = useFirestore();
  const [isClient, setIsClient] = useState(false);

  // State for simulated live data
  const [websiteViews, setWebsiteViews] = useState(12890);
  const [socialTraffic, setSocialTraffic] = useState(4567);
  const [socialData, setSocialData] = useState(initialPieChartData);

  // --- Firestore Queries ---
  const productsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'products') : null, [firestore]);
  const blogPostsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'blogPosts') : null, [firestore]);
  const messagesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return query(collection(firestore, 'messages'), where('createdAt', '>=', Timestamp.fromDate(twentyFourHoursAgo)));
  }, [firestore]);
  const recentProductsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'products'), orderBy('createdAt', 'desc'), limit(5)) : null, [firestore]);

  // --- Data Fetching ---
  const { data: products, isLoading: isLoadingProducts } = useCollection(productsQuery);
  const { data: blogPosts, isLoading: isLoadingBlogPosts } = useCollection(blogPostsQuery);
  const { data: recentMessages, isLoading: isLoadingMessages } = useCollection(messagesQuery);
  const { data: recentProducts, isLoading: isLoadingRecentProducts } = useCollection(recentProductsQuery);

  // --- Live Data Simulation Effect ---
  useEffect(() => {
    setIsClient(true);
    const viewInterval = setInterval(() => {
        setWebsiteViews(v => v + Math.floor(Math.random() * 5) - 1);
    }, 3000);

    const socialInterval = setInterval(() => {
        setSocialTraffic(v => v + Math.floor(Math.random() * 3));
        setSocialData(prevData => prevData.map(d => ({
            ...d,
            value: Math.max(50, d.value + Math.floor(Math.random() * 20) - 10)
        })));
    }, 5000);

    return () => {
        clearInterval(viewInterval);
        clearInterval(socialInterval);
    };
  }, []);

  // --- Static Data ---
  const statCardsData = [
    {
        title: 'Products',
        value: products?.length.toString() ?? '0',
        trend: '+15.2%',
        trendDirection: 'up' as const,
        icon: Package,
        isLoading: isLoadingProducts,
    },
    {
        title: 'Blog Posts',
        value: blogPosts?.length.toString() ?? '0',
        trend: '+5.1%',
        trendDirection: 'up' as const,
        icon: FileText,
        isLoading: isLoadingBlogPosts,
    },
    {
        title: 'Last Messages',
        value: recentMessages?.length.toString() ?? '0',
        trend: '24h',
        trendDirection: 'neutral' as const,
        icon: MessageSquare,
        isLoading: isLoadingMessages,
    },
  ];

  const dynamicStatCards = [
     {
        title: 'Website Views',
        value: websiteViews.toLocaleString(),
        trend: '-2.1%',
        trendDirection: 'down' as const,
        icon: Eye,
        isLoading: false,
    },
    {
        title: 'Actuality',
        value: 'Summer Sale',
        trend: 'Active',
        trendDirection: 'neutral' as const,
        icon: Megaphone,
        isLoading: false,
    },
    {
        title: 'Social Traffic',
        value: socialTraffic.toLocaleString(),
        trend: '+33.8%',
        trendDirection: 'up' as const,
        icon: Users,
        isLoading: false,
    },
  ];

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-background">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
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
        {isClient && dynamicStatCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </motion.div>

      {/* Charts */}
       <motion.div 
         className="grid grid-cols-1 lg:grid-cols-3 gap-6"
         variants={containerVariants}
         initial="hidden"
         animate="visible"
       >
        <LineChartCard />
        <BarChartCard posts={blogPosts || []} isLoading={isLoadingBlogPosts} />
      </motion.div>
      <motion.div 
         className="grid grid-cols-1 lg:grid-cols-3 gap-6"
         variants={containerVariants}
         initial="hidden"
         animate="visible"
       >
        {isClient && <DonutChartCard socialData={socialData} />}
        <RecentActivity products={recentProducts || []} isLoading={isLoadingRecentProducts} />
      </motion.div>

    </div>
  );
}
