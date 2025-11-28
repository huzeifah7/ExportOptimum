
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

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

  const handleDelete = async (certId: string, certName: string) => {
    if (confirm(`Are you sure you want to delete "${certName}"?`)) {
       if (!firestore) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Could not connect to the database.",
            });
            return;
        }
      const docRef = doc(firestore, "qualityCertifications", certId);
      try {
        await deleteDoc(docRef);
        toast({
          title: "Certification Deleted",
          description: `"${certName}" has been successfully deleted.`,
        });
      } catch (error) {
        console.error("Error deleting document: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not delete certification. Please try again.",
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
          {isLoading && (
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
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {certifications?.map((cert) => (
              <Card key={cert.id} className="overflow-hidden shadow-lg flex flex-col items-center p-4">
                <div className="relative h-24 w-24 mb-4">
                  {cert.imageUrl ? (
                    <Image
                      src={cert.imageUrl}
                      alt={cert.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="bg-secondary h-full w-full flex items-center justify-center rounded-md">
                      <p className="text-muted-foreground text-xs">No Image</p>
                    </div>
                  )}
                </div>
                <CardTitle className="font-headline text-lg text-center">{cert.name}</CardTitle>
                <CardFooter className="mt-auto flex justify-end gap-2 p-0 pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/quality/edit/${cert.id}`}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(cert.id, cert.name)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
