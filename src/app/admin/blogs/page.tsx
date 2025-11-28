import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ManageBlogsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Blogs</h1>
        <Button>Add New Blog Post</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here you will be able to add, edit, or delete blog posts.</p>
          {/* Blog posts table will go here */}
        </CardContent>
      </Card>
    </div>
  );
}
