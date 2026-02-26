'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";

type Certification = {
  id: string;
  name: string;
  imageUrl?: string;
};

export default function ManageQualityPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const certificationsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "qualityCertifications");
  }, [firestore]);

  const { data: certifications, isLoading } = useCollection<Certification>(certificationsQuery);

  const handleDelete = async (cert: Certification) => {
    if (confirm(`Are you sure you want to delete "${cert.name}"?`)) {
       if (!firestore) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Could not connect to the database.",
            });
            return;
        }

      try {
        const docRef = doc(firestore, "qualityCertifications", cert.id);
        deleteDocumentNonBlocking(docRef);

        if (cert.imageUrl) {
            const storage = getStorage();
            try {
                const imgRef = storageRef(storage, cert.imageUrl);
                await deleteObject(imgRef);
            } catch (storageError: any) {
                if (storageError.code !== 'storage/object-not-found') {
                    console.warn("Could not delete certification logo from storage:", storageError);
                }
            }
        }

        toast({
          title: "Certification Deleted",
          description: `"${cert.name}" has been successfully deleted.`,
        });
      } catch (error: any) {
        console.error("Error deleting certification: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Could not delete certification. Please try again.",
        });
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Certifications</h1>
        <Button asChild>
          <Link href="/admin/quality/add">Add New Certification</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="overflow-hidden shadow-lg flex flex-col items-center justify-center p-4">
                  <Skeleton className="h-24 w-24 mb-4" />
                  <Skeleton className="h-6 w-3/4" />
                   <div className="flex gap-2 mt-4">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-24" />
                    </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {certifications?.map((cert) => (
                <Card key={cert.id} className="overflow-hidden shadow-lg flex flex-col items-center p-4">
                    <div className="relative h-24 w-24 mb-4 bg-muted rounded-md p-2">
                    {cert.imageUrl ? (
                        <Image
                        src={cert.imageUrl}
                        alt={cert.name}
                        fill
                        className="object-contain"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                        <p className="text-muted-foreground text-xs">No Image</p>
                        </div>
                    )}
                    </div>
                    <CardTitle className="font-headline text-lg text-center truncate w-full px-2" title={cert.name}>{cert.name}</CardTitle>
                    <CardFooter className="mt-auto flex justify-end gap-2 p-0 pt-4">
                    <Button variant="outline" size="sm" asChild title="Edit">
                        <Link href={`/admin/quality/edit/${cert.id}`}>
                        <Pencil className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(cert)}
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </CardFooter>
                </Card>
                ))}
            </div>
          )}
           {!isLoading && certifications?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No certifications found.</p>
                    <Button variant="link" asChild className="mt-2">
                        <Link href="/admin/quality/add">Add the first one!</Link>
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
