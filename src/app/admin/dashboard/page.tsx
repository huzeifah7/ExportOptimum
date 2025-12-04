import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart, DollarSign, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-10rem)]">
        <div className="flex-grow lg:w-2/3 overflow-y-auto pr-4">
            <h1 className="text-3xl font-bold font-headline mb-8">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Subscriptions
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">
                    +19% from last month
                    </p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                    +201 since last hour
                    </p>
                </CardContent>
                </Card>
            </div>
            <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome, Admin!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>This is your central hub for managing the website. Use the sidebar to navigate through different sections.</p>
                        </CardContent>
                    </Card>
            </div>
        </div>
        <div className="hidden lg:flex lg:w-1/3 flex-col items-center justify-center bg-secondary/30 rounded-lg p-4">
            <div className="w-full max-w-[300px] h-[600px] bg-background shadow-2xl rounded-3xl border-4 border-foreground/80 overflow-hidden relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-foreground/80 rounded-b-xl z-20"></div>
                <iframe
                    src="/"
                    className="w-full h-full border-0"
                    title="Live Preview"
                ></iframe>
            </div>
            <p className="text-muted-foreground text-sm mt-4">Live Site Preview</p>
        </div>
    </div>
  );
}
