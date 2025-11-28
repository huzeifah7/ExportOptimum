import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ManageKeyFiguresPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Key Figures</h1>
        <Button>Update Figures</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Key Figures</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here you will be able to edit the key figures displayed on the homepage.</p>
          {/* Key figures form will go here */}
        </CardContent>
      </Card>
    </div>
  );
}
