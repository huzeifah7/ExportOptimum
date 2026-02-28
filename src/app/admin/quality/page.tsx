'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pencil, Trash2, PlusCircle, Award } from "lucide-react";
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
  description?: string;
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
    if (confirm(`Are you sure you want to delete "${cert.name}"? This will remove it from the Quality page.`)) {
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
        
        // Non-blocking Firestore delete
        deleteDocumentNonBlocking(docRef);

        // Cleanup Storage if image exists
        if (cert.imageUrl) {
            const storage = getStorage();
            try {
                // If it's a URL from Storage, it might contain the path
                // For simplicity in this MVP, we try to extract or handle common path patterns
                // Best practice is storing the path in the document
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
          description: `"${cert.name}" has been successfully removed.`,
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manage Certifications</h1>
          <p className="text-muted-foreground text-sm">Update the logos and certifications shown on the Quality page.</p>
        </div>
        <Button asChild className="rounded-xl shadow-md">
          <Link href="/admin/quality/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Certification
          </Link>
        </Button>
      </div>

      <Card className="rounded-2xl border-border/50 overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/10 border-b">
          <CardTitle className="text-lg font-headline flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Current Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden border-border/40 flex flex-col items-center p-6 space-y-4">
                  <Skeleton className="h-24 w-24 rounded-2xl" />
                  <Skeleton className="h-6 w-3/4 rounded-full" />
                   <div className="flex gap-2 mt-2">
                        <Skeleton className="h-9 w-12 rounded-lg" />
                        <Skeleton className="h-9 w-12 rounded-lg" />
                    </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {certifications?.map((cert) => (
                <Card key={cert.id} className="group overflow-hidden border-border/40 hover:border-primary/20 hover:shadow-lg transition-all duration-300 flex flex-col items-center p-6 bg-gradient-to-br from-white to-gray-50/30">
                    <div className="relative h-28 w-28 mb-4 bg-white rounded-2xl p-3 shadow-inner border border-border/20 transition-transform duration-500 group-hover:scale-105">
                    {cert.imageUrl ? (
                        <Image
                        src={cert.imageUrl}
                        alt={cert.name}
                        fill
                        className="object-contain p-2"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Award className="h-10 w-10 text-muted-foreground/20" />
                        </div>
                    )}
                    </div>
                    <div className="text-center space-y-1 mb-6 flex-grow">
                      <CardTitle className="font-headline text-lg truncate w-full px-2" title={cert.name}>
                        {cert.name}
                      </CardTitle>
                      {cert.description && (
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold line-clamp-1">
                          {cert.description}
                        </p>
                      )}
                    </div>
                    <CardFooter className="mt-auto flex justify-center gap-2 p-0 pt-4 border-t w-full border-border/50">
                      <Button variant="outline" size="sm" asChild className="rounded-lg h-9 w-9 p-0" title="Edit">
                          <Link href={`/admin/quality/edit/${cert.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                      </Button>
                      <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(cert)}
                          className="rounded-lg h-9 w-9 p-0"
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
                <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/5">
                    <div className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Award className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold">No certifications found</h3>
                    <p className="text-muted-foreground mt-2 mb-6">Add your first certification to showcase your standards.</p>
                    <Button variant="default" asChild className="rounded-xl px-8 shadow-md">
                        <Link href="/admin/quality/add">Add Certification</Link>
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}