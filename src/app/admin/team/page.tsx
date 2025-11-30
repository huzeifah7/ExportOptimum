
'use client';

import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { getStorage } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Linkedin, Twitter, Trash2, Edit, Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

// Defines the data structure for a team member.
type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedin?: string;
  twitter?: string;
};

// Initial state for the form when adding a new team member.
const initialFormState: Partial<TeamMember> = {
  name: '',
  role: '',
  bio: '',
  linkedin: '',
  twitter: '',
};

export default function ManageTeamPage() {
  const firestore = useFirestore();
  const storage = getStorage();
  const { toast } = useToast();

  const teamMembersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'teamMembers');
  }, [firestore]);

  const { data: teamMembers, isLoading } = useCollection<TeamMember>(teamMembersQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<TeamMember> | null>(null);
  const [formData, setFormData] = useState<Partial<TeamMember>>(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

  // Effect to update form and image preview when 'currentMember' changes (for editing).
  useEffect(() => {
    if (currentMember) {
      setFormData(currentMember);
      if (currentMember.photoUrl) {
        setImagePreview(currentMember.photoUrl);
      }
    } else {
      setFormData(initialFormState);
      setImagePreview(null);
    }
  }, [currentMember]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(currentMember?.photoUrl || null);
    }
  };

  const handleAddClick = () => {
    setCurrentMember(null);
    setFormData(initialFormState);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (member: TeamMember) => {
    setCurrentMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMember(null);
    setImageFile(null);
  };

  // Handles both creating and updating a team member.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !storage) {
      toast({ variant: 'destructive', title: 'Firebase not initialized.' });
      return;
    }

    // Basic validation
    if (!formData.name || !formData.role || !formData.bio) {
      toast({ variant: 'destructive', title: 'Please fill all required fields.' });
      return;
    }
    if (!currentMember && !imageFile) {
        toast({ variant: 'destructive', title: 'Image is required for new members.' });
        return;
    }

    setIsSubmitting(true);

    try {
      const isEditing = !!currentMember?.id;
      let photoUrl = isEditing ? currentMember.photoUrl : '';

      // Define a unique ID for the member.
      // If editing, use the existing ID. If creating, generate a new one.
      const memberId = isEditing ? currentMember.id! : doc(collection(firestore, 'teamMembers')).id;

      // 1. Handle Image Upload
      if (imageFile) {
        // If editing and there's an old image, delete it from storage first.
        if (isEditing && currentMember.photoUrl) {
          try {
            const oldImageRef = ref(storage, currentMember.photoUrl);
            await deleteObject(oldImageRef);
          } catch (error: any) {
             if (error.code !== 'storage/object-not-found') {
                console.warn("Could not delete old image, it may not exist:", error);
             }
          }
        }

        const imagePath = `team/${memberId}/${imageFile.name}`;
        const imageRef = ref(storage, imagePath);
        await uploadBytes(imageRef, imageFile);
        photoUrl = await getDownloadURL(imageRef);
      }

      // 2. Prepare Data for Firestore
      const memberData = {
        ...formData,
        id: memberId, // Ensure the ID is part of the document data
        photoUrl,
        updatedAt: serverTimestamp(),
      };

      // 3. Save to Firestore
      const memberDocRef = doc(firestore, 'teamMembers', memberId);

      if (isEditing) {
        // Update existing member document
        await updateDoc(memberDocRef, { ...memberData });
        toast({ title: 'Team member updated successfully.' });
      } else {
        // Create new member document with a 'createdAt' field
        await setDoc(memberDocRef, {
          ...memberData,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Team member added successfully.' });
      }

      closeModal();
    } catch (error: any) {
      console.error('Error saving team member:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: error.message || "Could not save the team member.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (member: TeamMember) => {
    setMemberToDelete(member);
    setIsDeleteDialogOpen(true);
  };

  // Handles the deletion of a team member.
  const handleDelete = async () => {
    if (!memberToDelete || !firestore || !storage) return;

    setIsSubmitting(true);
    try {
      // Delete Firestore document.
      await deleteDoc(doc(firestore, 'teamMembers', memberToDelete.id));

      // Delete image from Storage.
      if (memberToDelete.photoUrl) {
         try {
            const imageRef = ref(storage, memberToDelete.photoUrl);
            await deleteObject(imageRef);
        } catch (error: any) {
            if (error.code !== 'storage/object-not-found') {
                console.error("Failed to delete image from storage:", error);
                // We don't re-throw, as the main goal (deleting the DB entry) succeeded.
            }
        }
      }

      toast({ title: 'Team member deleted successfully.' });
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete member.',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Team</h1>
        <Button onClick={handleAddClick}>Add Staff</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers?.map((member) => (
            <Card key={member.id} className="flex flex-col">
              <div className="relative w-full h-64">
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardContent className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold font-headline">{member.name}</h3>
                <p className="text-primary font-semibold">{member.role}</p>
                <p className="text-muted-foreground mt-2 text-sm flex-grow">
                  {member.bio}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                </div>
                <div className="border-t mt-4 pt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(member)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(member)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentMember ? 'Edit Staff' : 'Add New Staff'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" value={formData.role} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleInputChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input id="twitter" name="twitter" value={formData.twitter} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo">Photo</Label>
              <Input id="photo" type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <div className="mt-2">
                  <Image src={imagePreview} alt="Preview" width={100} height={100} className="rounded-md object-cover" />
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <p>
                This action will permanently delete{' '}
                <span className="font-semibold">{memberToDelete?.name}</span>.
            </p>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
