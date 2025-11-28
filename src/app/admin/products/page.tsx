
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";

type Product = {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  imageHint?: string;
  slug: string;
};

export default function ManageProductsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "products");
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const handleDelete = (productId: string, productName: string) => {
    if (confirm(`Are you sure you want to delete "${productName}"?`)) {
      if (!firestore) {
          toast({
              variant: "destructive",
              title: "Error",
              description: "Database connection not found.",
          });
          return;
      }
      const docRef = doc(firestore, "products", productId);
      deleteDocumentNonBlocking(docRef);
      toast({
        title: "Product Deleted",
        description: `"${productName}" has been successfully deleted.`,
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Products</h1>
        <Button asChild>
          <Link href="/admin/products/add">Add New Product</Link>
        </Button>
      </div>
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden shadow-lg flex flex-col">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardFooter className="mt-auto flex justify-end gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <Card key={product.id} className="overflow-hidden shadow-lg flex flex-col">
            <div className="relative h-48 w-full">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  data-ai-hint={product.imageHint || 'produce'}
                />
              ) : (
                <div className="bg-secondary h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No Image</p>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="font-headline text-xl">{product.name}</CardTitle>
              <Badge variant="secondary" className="w-fit">{product.category}</Badge>
            </CardHeader>
            <CardFooter className="mt-auto flex justify-end gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/products/edit/${product.id}`}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(product.id, product.name)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {!isLoading && products?.length === 0 && (
            <Card>
                <CardContent className="text-center py-12 text-muted-foreground">
                    <p>No products found.</p>
                    <Button variant="link" asChild className="mt-2">
                        <Link href="/admin/products/add">Add the first product!</Link>
                    </Button>
                </CardContent>
            </Card>
      )}
    </div>
  );
}
