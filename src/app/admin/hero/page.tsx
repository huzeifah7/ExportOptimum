import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ManageHeroPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Hero Section</h1>
        <Button>Update Hero</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here you will be able to edit the content of the hero section.</p>
          {/* Hero section form will go here */}
        </CardContent>
      </Card>
    </div>
  );
}
