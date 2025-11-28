import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ManagePartnersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Partners</h1>
        <Button>Add New Partner</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Partner Logos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here you will be able to add, edit, or delete partner logos.</p>
          {/* Partner logos list will go here */}
        </CardContent>
      </Card>
    </div>
  );
}
