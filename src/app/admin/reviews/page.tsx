import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ManageReviewsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Client Reviews</h1>
        <Button>Add New Review</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Client Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here you will be able to add, edit, or delete client reviews.</p>
          {/* Client reviews list will go here */}
        </CardContent>
      </Card>
    </div>
  );
}
