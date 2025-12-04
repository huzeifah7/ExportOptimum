
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, FileText, Package, Users } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BlogPostByCategoryChart } from "@/components/admin/BlogPostByCategoryChart";

type Product = { id: string; };
type BlogPost = {
    id: string;
    title: string;
    category: string;
    publishDate: Timestamp;
};

const StatCard = ({ title, value, icon, isLoading, description }: { title: string, value: string | number, icon: React.ReactNode, isLoading: boolean, description?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <>
                    <Skeleton className="h-8 w-20" />
                    {description && <Skeleton className="h-4 w-32 mt-1" />}
                </>
            ) : (
                <>
                    <div className="text-2xl font-bold">{value}</div>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                </>
            )}
        </CardContent>
    </Card>
);

export default function DashboardPage() {
    const firestore = useFirestore();

    const productsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, "products");
    }, [firestore]);

    const blogPostsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, "blogPosts");
    }, [firestore]);

    const recentBlogsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, "blogPosts"), orderBy('publishDate', 'desc'), limit(5));
    }, [firestore]);

    const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);
    const { data: blogPosts, isLoading: isLoadingBlogs } = useCollection<BlogPost>(blogPostsQuery);
    const { data: recentBlogPosts, isLoading: isLoadingRecentBlogs } = useCollection<BlogPost>(recentBlogsQuery);

    const formatDate = (timestamp: Timestamp | null) => {
        if (!timestamp) return 'No date';
        return timestamp.toDate().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold font-headline">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Products"
                    value={products?.length || 0}
                    icon={<Package className="h-4 w-4 text-muted-foreground" />}
                    isLoading={isLoadingProducts}
                    description="Number of items in your catalog."
                />
                <StatCard
                    title="Total Blog Posts"
                    value={blogPosts?.length || 0}
                    icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                    isLoading={isLoadingBlogs}
                    description="Total articles published."
                />
                <StatCard
                    title="Emails Received"
                    value="0"
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    isLoading={false}
                    description="From contact form (coming soon)."
                />
                <StatCard
                    title="Sales"
                    value="0"
                    icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
                    isLoading={false}
                    description="eCommerce not yet implemented."
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Blog Posts by Category</CardTitle>
                        <CardDescription>A breakdown of your content focus.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] pr-6">
                        {isLoadingBlogs ? (
                            <Skeleton className="w-full h-full" />
                        ) : (
                            <BlogPostByCategoryChart posts={blogPosts || []} />
                        )}
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>The latest blog posts published.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingRecentBlogs ? (
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        <Skeleton className="h-5 w-48" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {recentBlogPosts?.map(post => (
                                    <li key={post.id} className="flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-medium">{post.title}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{post.category}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{formatDate(post.publishDate)}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                        { !isLoadingRecentBlogs && recentBlogPosts?.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-8">No recent blog posts.</p>
                        )}
                        <Button asChild variant="outline" className="w-full mt-6">
                            <Link href="/admin/blogs">View All Posts</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
