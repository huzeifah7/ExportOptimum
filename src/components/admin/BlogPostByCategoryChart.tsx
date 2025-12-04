
'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo } from 'react';

type BlogPost = {
    category: string;
};

type BlogPostByCategoryChartProps = {
    posts: BlogPost[];
};

export function BlogPostByCategoryChart({ posts }: BlogPostByCategoryChartProps) {
    const data = useMemo(() => {
        const categoryCounts = posts.reduce((acc, post) => {
            const category = post.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categoryCounts).map(([name, total]) => ({
            name,
            total,
        }));
    }, [posts]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--secondary))' }}
                    contentStyle={{
                        background: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Bar
                    dataKey="total"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name="Posts"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
