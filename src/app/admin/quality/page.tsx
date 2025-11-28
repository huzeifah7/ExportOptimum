import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ManageQualityPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Quality</h1>
        <Button>Save Changes</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quality Page Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here you will be able to edit the content of the Quality page.</p>
          {/* Quality page form will go here */}
        </CardContent>
      </Card>
    </div>
  );
}
