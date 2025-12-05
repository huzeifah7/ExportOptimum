
'use client';

import React from 'react';
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

// --- DUMMY DATA ---

const statCardsData = [
  {
    title: 'Products',
    value: '1,250',
    trend: '+15.2%',
    trendDirection: 'up' as const,
    icon: Package,
  },
  {
    title: 'Blog Posts',
    value: '82',
    trend: '+5.1%',
    trendDirection: 'up' as const,
    icon: FileText,
  },
  {
    title: 'Last Messages',
    value: '12',
    trend: '24h',
    trendDirection: 'neutral' as const,
    icon: MessageSquare,
  },
  {
    title: 'Website Views',
    value: '12,890',
    trend: '-2.1%',
    trendDirection: 'down' as const,
    icon: Eye,
  },
    {
    title: 'Actuality',
    value: 'Summer Sale',
    trend: 'Active',
    trendDirection: 'neutral' as const,
    icon: Megaphone,
  },
  {
    title: 'Social Traffic',
    value: '4,567',
    trend: '+33.8%',
    trendDirection: 'up' as const,
    icon: Users,
  },
];

const lineChartData = [
  { name: 'Jan', views: 4000 },
  { name: 'Feb', views: 3000 },
  { name: 'Mar', views: 5000 },
  { name: 'Apr', views: 4500 },
  { name: 'May', views: 6000 },
  { name: 'Jun', views: 5500 },
  { name: 'Jul', views: 7000 },
];

const barChartData = [
  { name: 'Avocado', sales: 4000 },
  { name: 'Citrus', sales: 3000 },
  { name: 'Berries', sales: 2000 },
  { name: 'Vegetables', sales: 2780 },
  { name: 'Herbs', sales: 1890 },
];

const pieChartData = [
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
}) => (
  <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
    <Card className="rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <TrendIndicator direction={trendDirection} value={trend} />
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

const BarChartCard: React.FC = () => (
  <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
     <Card className="h-full rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle>Product Performance</CardTitle>
        <CardDescription>Sales by category this month</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full p-2">
        <ResponsiveContainer>
          <BarChart data={barChartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
              }}
              cursor={{ fill: 'hsl(var(--secondary))' }}
            />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </motion.div>
);

const DonutChartCard: React.FC = () => (
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
              data={pieChartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
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


// --- MAIN DASHBOARD COMPONENT ---

export default function DashboardPage() {
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
      </motion.div>

      {/* Charts */}
       <motion.div 
         className="grid grid-cols-1 lg:grid-cols-3 gap-6"
         variants={containerVariants}
         initial="hidden"
         animate="visible"
       >
        <LineChartCard />
        <BarChartCard />
      </motion.div>
      <motion.div 
         className="grid grid-cols-1 lg:grid-cols-3 gap-6"
         variants={containerVariants}
         initial="hidden"
         animate="visible"
       >
        <DonutChartCard />
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <Card className="h-full rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-lg">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <p className="text-muted-foreground">Activity feed coming soon...</p>
                </CardContent>
            </Card>
        </motion.div>
      </motion.div>

    </div>
  );
}
