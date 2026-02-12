
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Trash2, Loader2, UploadCloud, X } from 'lucide-react';
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
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type SustainabilityImage = {
  id: string;
  src: string;
  alt: string;
};

export default function ManageSustainabilityPage() {
  const firestore = useFirestore();
  const storage = getStorage();
  const { toast } = useToast();

  const galleryQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'sustainabilityGallery');
  }, [firestore]);

  const { data: images, isLoading } = useCollection<SustainabilityImage>(galleryQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };
  
  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setAltText('');
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleAddClick = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !storage || !imageFile) {
      toast({ variant: 'destructive', title: 'Image file is required.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const galleryCollection = collection(firestore, 'sustainabilityGallery');
      const newImageRef = doc(galleryCollection);
      const newImageId = newImageRef.id;

      const imagePath = `sustainability/${newImageId}/${imageFile.name}`;
      const imageStorageRef = storageRef(storage, imagePath);
      await uploadBytes(imageStorageRef, imageFile);
      const downloadUrl = await getDownloadURL(imageStorageRef);

      const newImageData = {
        src: downloadUrl,
        alt: altText || 'Sustainability Gallery Image',
        createdAt: serverTimestamp(),
      };
      
      setDocumentNonBlocking(newImageRef, newImageData, {});
      
      toast({ title: 'Image added to gallery.' });
      closeModal();
    } catch (error: any) {
      console.error('Error adding image:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: error.message || 'Could not add the image.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (image: SustainabilityImage) => {
    if (!firestore || !storage) return;

    if (!confirm(`Are you sure you want to delete this image?`)) return;

    try {
      // Delete Firestore document
      const docRef = doc(firestore, 'sustainabilityGallery', image.id);
      deleteDocumentNonBlocking(docRef);

      // Delete image from Storage
      const imageStorageRef = storageRef(storage, image.src);
      await deleteObject(imageStorageRef);

      toast({ title: 'Image deleted successfully.' });
    } catch (error: any) {
      console.error('Error deleting image:', error);
      if (error.code === 'storage/object-not-found') {
          // If the image doesn't exist in storage, we can still consider the deletion successful from a data perspective
          toast({ title: 'Image data deleted. File was not found in storage.' });
      } else {
        toast({
            variant: 'destructive',
            title: 'Failed to delete image.',
            description: error.message,
        });
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Sustainability Gallery</h1>
        <Button onClick={handleAddClick}>Add Image</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images?.map((image) => (
                <div key={image.id} className="relative group aspect-square">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(image)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
           {!isLoading && images?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No images in the gallery yet.</p>
                </div>
            )}
        </CardContent>
      </Card>

      {/* Add Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Gallery Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="image-alt">Alt Text (optional)</Label>
              <Input
                id="image-alt"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="A short description of the image"
              />
            </div>
            <div>
              <Label htmlFor="image-file-upload">Image File</Label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                <div className="text-center">
                   {imagePreview ? (
                       <div className="relative mx-auto w-48 h-48">
                         <Image src={imagePreview} alt="Preview" fill className="rounded-md object-cover" />
                          <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 bg-background rounded-full h-8 w-8" onClick={resetForm}>
                            <X className="h-4 w-4"/>
                          </Button>
                       </div>
                   ) : (
                    <>
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                            htmlFor="image-file-upload"
                            className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                            >
                            <span>Upload a file</span>
                            <Input id="image-file-upload" type="file" className="sr-only" onChange={handleImageChange} required ref={fileInputRef} accept="image/*" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </>
                   )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting || !imageFile}>
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
