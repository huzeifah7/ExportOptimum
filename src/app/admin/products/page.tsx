import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ManageProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Products</h1>
        <Button>Add New Product</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here you will be able to add, edit, or delete products.</p>
          {/* Products table will go here */}
        </CardContent>
      </Card>
    </div>
  );
}
