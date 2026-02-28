'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pencil, Trash2, PlusCircle, Award, Loader2, UploadCloud, X } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type Certification = {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
};

export default function ManageQualityPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const storage = getStorage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCert, setCurrentCert] = useState<Certification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const certificationsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "qualityCertifications");
  }, [firestore]);

  const { data: certifications, isLoading } = useCollection<Certification>(certificationsQuery);

  const openModal = (cert: Certification | null = null) => {
    setCurrentCert(cert);
    if (cert) {
      setName(cert.name);
      setDescription(cert.description || '');
      setImagePreview(cert.imageUrl || null);
    } else {
      setName('');
      setDescription('');
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCert(null);
    setIsSubmitting(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !name) return;

    setIsSubmitting(true);

    try {
      const isEditing = !!currentCert;
      const certId = isEditing ? currentCert.id : doc(collection(firestore, 'qualityCertifications')).id;
      let finalImageUrl = currentCert?.imageUrl || '';

      if (imageFile) {
        const path = `certifications/${certId}/${imageFile.name}`;
        const imgRef = storageRef(storage, path);
        await uploadBytes(imgRef, imageFile);
        finalImageUrl = await getDownloadURL(imgRef);
      }

      const certData = {
        id: certId,
        name: name,
        imageUrl: finalImageUrl,
        description: description,
        updatedAt: serverTimestamp(),
        ...(isEditing ? {} : { createdAt: serverTimestamp() })
      };

      const certDocRef = doc(firestore, 'qualityCertifications', certId);
      
      setDoc(certDocRef, certData, { merge: true })
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: certDocRef.path,
            operation: isEditing ? 'update' : 'create',
            requestResourceData: certData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: `Certification ${isEditing ? 'Updated' : 'Added'}`,
        description: `${name} has been successfully saved.`,
      });

      closeModal();
    } catch (error: any) {
      console.error("Error saving certification:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save certification.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cert: Certification) => {
    if (confirm(`Are you sure you want to delete "${cert.name}"? This will remove it from the Quality page.`)) {
      if (!firestore) return;

      try {
        const docRef = doc(firestore, "qualityCertifications", cert.id);
        deleteDocumentNonBlocking(docRef);

        if (cert.imageUrl) {
          try {
            const imgRef = storageRef(storage, cert.imageUrl);
            await deleteObject(imgRef);
          } catch (e) {}
        }

        toast({
          title: "Certification Deleted",
          description: `"${cert.name}" has been removed.`,
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Could not delete certification.",
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
        <Button onClick={() => openModal(null)} className="rounded-xl shadow-md">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Certification
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
                      <Button variant="outline" size="sm" onClick={() => openModal(cert)} className="rounded-lg h-9 w-9 p-0" title="Edit">
                        <Pencil className="h-4 w-4" />
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
                    <Button variant="default" onClick={() => openModal(null)} className="rounded-xl px-8 shadow-md">
                        Add Certification
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden">
          <div className="bg-primary/5 p-6 border-b border-primary/10">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline font-black">
                {currentCert ? 'Edit Certification' : 'Add New Certification'}
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cert-name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Name</Label>
                <Input 
                  id="cert-name" 
                  placeholder="e.g., Global G.A.P." 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="rounded-xl h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cert-desc" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description (Optional)</Label>
                <Textarea 
                  id="cert-desc" 
                  placeholder="Briefly describe the significance..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  className="rounded-xl min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Logo Image</Label>
                <div className="mt-2 flex justify-center rounded-2xl border-2 border-dashed border-muted px-6 py-8 transition-colors hover:border-primary/30 group bg-muted/5">
                  <div className="text-center w-full">
                    {imagePreview ? (
                      <div className="relative mx-auto w-32 h-32 bg-white rounded-2xl p-2 shadow-sm border">
                        <Image src={imagePreview} alt="Preview" fill className="object-contain p-2" />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          type="button"
                          className="absolute -top-2 -right-2 rounded-full h-7 w-7 shadow-lg" 
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(currentCert?.imageUrl || null);
                            if(fileInputRef.current) fileInputRef.current.value = '';
                          }}
                        >
                          <X className="h-3.5 w-3.5"/>
                        </Button>
                      </div>
                    ) : (
                      <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                        <div className="mx-auto h-12 w-12 bg-primary/5 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <UploadCloud className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-xs leading-6 text-gray-600">
                          <span className="font-bold text-primary">Click to upload</span>
                          <p className="text-muted-foreground mt-1">PNG, JPG or SVG up to 5MB</p>
                        </div>
                        <Input 
                          id="cert-image" 
                          type="file" 
                          className="hidden" 
                          onChange={handleImageChange} 
                          ref={fileInputRef} 
                          accept="image/*" 
                          disabled={isSubmitting}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t gap-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost" onClick={closeModal} disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting || !name || (!imagePreview && !imageFile)} className="rounded-xl px-8 shadow-md">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
