
'use client';

import React, { useState, useRef } from 'react';
import {
  collection,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { getStorage } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Trash2, Loader2, UploadCloud, X, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type Partner = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
};

export default function ManagePartnersPage() {
  const firestore = useFirestore();
  const storage = getStorage();
  const { toast } = useToast();

  const partnersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'partners');
  }, [firestore]);

  const { data: partners, isLoading } = useCollection<Partner>(partnersQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);
  
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = (partner: Partner | null = null) => {
    setCurrentPartner(partner);
    if (partner) {
      setName(partner.name);
      setWebsiteUrl(partner.websiteUrl || '');
      setImagePreview(partner.logoUrl);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };
  
  const resetForm = () => {
    setCurrentPartner(null);
    setName('');
    setWebsiteUrl('');
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(currentPartner?.logoUrl || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !storage || !name || (!imageFile && !currentPartner)) {
      toast({ variant: 'destructive', title: 'Name and Logo are required.' });
      return;
    }

    setIsSubmitting(true);

    try {
        const isEditing = !!currentPartner;
        const partnerId = isEditing ? currentPartner.id : doc(collection(firestore, 'partners')).id;
        let logoUrl = currentPartner?.logoUrl || '';

        if (imageFile) {
            const imagePath = `partners/${partnerId}/${imageFile.name}`;
            const imageStorageRef = storageRef(storage, imagePath);
            await uploadBytes(imageStorageRef, imageFile);
            logoUrl = await getDownloadURL(imageStorageRef);
        }

      const partnerData = {
        name,
        logoUrl,
        websiteUrl,
        updatedAt: serverTimestamp(),
      };
      
      const partnerDocRef = doc(firestore, 'partners', partnerId);

      if (isEditing) {
        setDocumentNonBlocking(partnerDocRef, partnerData, { merge: true });
      } else {
        addDocumentNonBlocking(collection(firestore, 'partners'), {
            ...partnerData,
            id: partnerId,
            createdAt: serverTimestamp()
        });
      }
      
      toast({ title: `Partner ${isEditing ? 'Updated' : 'Added'}` });
      closeModal();
    } catch (error: any) {
      console.error('Error saving partner:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: error.message || 'Could not save the partner.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (partner: Partner) => {
    if (!firestore || !storage) return;

    if (!confirm(`Are you sure you want to delete "${partner.name}"?`)) return;

    try {
      const docRef = doc(firestore, 'partners', partner.id);
      deleteDocumentNonBlocking(docRef);

      if (partner.logoUrl) {
        const imageStorageRef = storageRef(storage, partner.logoUrl);
        await deleteObject(imageStorageRef);
      }

      toast({ title: 'Partner deleted successfully.' });
    } catch (error: any) {
      console.error('Error deleting partner:', error);
      toast({
            variant: 'destructive',
            title: 'Failed to delete partner.',
            description: error.message,
        });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Partners</h1>
        <Button onClick={() => openModal(null)}>Add New Partner</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partner Logos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/2] w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {partners?.map((partner) => (
                <Card key={partner.id} className="relative group overflow-hidden">
                    <div className="aspect-[3/2] w-full bg-muted flex items-center justify-center p-4">
                        <Image
                            src={partner.logoUrl}
                            alt={partner.name}
                            width={150}
                            height={100}
                            className="object-contain max-h-full max-w-full"
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openModal(partner)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(partner)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-white text-sm font-bold truncate text-center">{partner.name}</p>
                </Card>
              ))}
            </div>
          )}
           {!isLoading && partners?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No partners found.</p>
                     <Button variant="link" asChild className="mt-2">
                        <span onClick={() => openModal(null)}>Add the first one!</span>
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>

      {/* Add/Edit Partner Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentPartner ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className='space-y-2'>
              <Label htmlFor="partner-name">Partner Name</Label>
              <Input
                id="partner-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Global Grocers"
                required
              />
            </div>
             <div className='space-y-2'>
              <Label htmlFor="partner-website">Website URL (optional)</Label>
              <Input
                id="partner-website"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="partner-logo">Partner Logo</Label>
               <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                <div className="text-center">
                   {imagePreview ? (
                       <div className="relative mx-auto w-48 h-32">
                         <Image src={imagePreview} alt="Preview" fill className="rounded-md object-contain" />
                          <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 bg-background rounded-full h-8 w-8" onClick={() => {
                            setImageFile(null);
                            setImagePreview(currentPartner?.logoUrl || null);
                            if(fileInputRef.current) fileInputRef.current.value = '';
                          }}>
                            <X className="h-4 w-4"/>
                          </Button>
                       </div>
                   ) : (
                    <>
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                            htmlFor="partner-logo-file"
                            className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80"
                            >
                            <span>Upload a file</span>
                            <Input id="partner-logo-file" type="file" className="sr-only" onChange={handleImageChange} required={!currentPartner} ref={fileInputRef} accept="image/png, image/jpeg, image/svg+xml, image/webp" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, SVG, WEBP up to 2MB</p>
                    </>
                   )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting || !name}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
