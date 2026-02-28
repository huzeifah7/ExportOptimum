
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
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
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Linkedin, MessageCircle, Trash2, Edit, Loader2, UserCheck, ShieldCheck, Crown, Briefcase } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Badge } from '@/components/ui/badge';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedin?: string;
  whatsapp?: string;
  isManager?: boolean;
  isCEO?: boolean;
  isDirector?: boolean;
  department: "Buying" | "Administrative" | "RH" | "Production" | "Quality" | "Other";
};

const initialFormState: Partial<TeamMember> = {
  name: '',
  role: '',
  bio: '',
  linkedin: '',
  whatsapp: '',
  photoUrl: '',
  isManager: false,
  isCEO: false,
  isDirector: false,
  department: 'Other',
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentMember) {
      setFormData(currentMember);
      setImagePreview(currentMember.photoUrl || null);
    } else {
      setFormData(initialFormState);
      setImagePreview(null);
    }
  }, [currentMember]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => {
        const next = { ...prev, [name]: checked };
        // If CEO or Director is checked, they are automatically Managers
        if ((name === 'isCEO' || name === 'isDirector') && checked) {
            next.isManager = true;
        }
        return next;
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value as any }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ variant: 'destructive', title: 'File too large', description: 'Please select an image smaller than 5MB.' });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClick = () => {
    setCurrentMember(null);
    setFormData(initialFormState);
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsModalOpen(true);
  };

  const handleEditClick = (member: TeamMember) => {
    setCurrentMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMember(null);
    setSelectedFile(null);
  };

  const uploadStaffImage = async (file: File, memberId: string): Promise<string> => {
    if (!storage) throw new Error("Storage not initialized");
    const imageRef = storageRef(storage, `team/${memberId}/${file.name}`);
    const snapshot = await uploadBytes(imageRef, file);
    return getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Database not initialized.' });
      return;
    }
    
    if (!formData.name || !formData.role || !formData.bio || !formData.department) {
      toast({ variant: 'destructive', title: 'Please fill all required fields.' });
      return;
    }

    if (!currentMember && !selectedFile) {
        toast({ variant: 'destructive', title: 'Image Required', description: 'Please select an image for the new staff member.' });
        return;
    }

    setIsSubmitting(true);

    try {
      const isEditing = !!currentMember?.id;
      const memberId = isEditing ? currentMember.id! : doc(collection(firestore, 'teamMembers')).id;
      let photoUrl = formData.photoUrl || '';

      if (selectedFile) {
        photoUrl = await uploadStaffImage(selectedFile, memberId);
      }

      const memberData = {
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        photoUrl: photoUrl,
        linkedin: formData.linkedin || '',
        whatsapp: formData.whatsapp || '',
        isManager: formData.isManager || false,
        isCEO: formData.isCEO || false,
        isDirector: formData.isDirector || false,
        department: formData.department,
      };

      const memberDocRef = doc(firestore, 'teamMembers', memberId);
      const dataToSave = isEditing 
        ? { ...memberData, updatedAt: serverTimestamp() }
        : { ...memberData, id: memberId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };

      setDoc(memberDocRef, dataToSave, { merge: true })
        .catch(async (serverError) => {
          const permissionError = new FirestorePermissionError({
            path: memberDocRef.path,
            operation: 'write',
            requestResourceData: dataToSave,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({ title: isEditing ? 'Team member updated' : 'Team member added' });
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

  const handleDelete = async () => {
    if (!memberToDelete || !firestore) return;

    setIsSubmitting(true);
    try {
      const docRef = doc(firestore, 'teamMembers', memberToDelete.id);
      deleteDocumentNonBlocking(docRef);

      if (memberToDelete.photoUrl && storage) {
        try {
          const imageRef = storageRef(storage, memberToDelete.photoUrl);
          await deleteObject(imageRef);
        } catch (storageError: any) {
          if (storageError.code !== 'storage/object-not-found') {
            console.warn("Could not delete image from storage:", storageError);
          }
        }
      }

      toast({ title: 'Team member deleted successfully.' });
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete member.',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
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
            <Card key={member.id} className="flex flex-col relative overflow-hidden group">
              <div className="relative w-full h-64">
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {member.isCEO && (
                        <Badge className="bg-primary text-white shadow-lg">
                            <Crown className="w-3 h-3 mr-1" /> CEO
                        </Badge>
                    )}
                    {member.isDirector && (
                        <Badge className="bg-amber-500 text-white shadow-lg">
                            <Briefcase className="w-3 h-3 mr-1" /> Director
                        </Badge>
                    )}
                    {member.isManager && !member.isCEO && !member.isDirector && (
                        <Badge className="bg-blue-500 text-white shadow-lg">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Manager
                        </Badge>
                    )}
                </div>
              </div>
              <CardContent className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold font-headline">{member.name}</h3>
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{member.department}</Badge>
                </div>
                <p className="text-primary font-semibold text-sm">{member.role}</p>
                <p className="text-muted-foreground mt-2 text-sm flex-grow line-clamp-3">
                  {member.bio}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                  {member.whatsapp && (
                    <a href={`https://wa.me/${member.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5 text-muted-foreground hover:text-primary" />
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentMember ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={handleSelectChange} value={formData.department}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buying">Buying</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Quality">Quality</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 bg-muted/50 p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="isCEO" 
                        checked={formData.isCEO} 
                        onCheckedChange={(checked) => handleCheckboxChange('isCEO', !!checked)}
                    />
                    <Label htmlFor="isCEO" className="text-sm font-bold leading-none cursor-pointer flex items-center gap-2">
                        <Crown className="w-4 h-4 text-primary" /> CEO
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="isDirector" 
                        checked={formData.isDirector} 
                        onCheckedChange={(checked) => handleCheckboxChange('isDirector', !!checked)}
                    />
                    <Label htmlFor="isDirector" className="text-sm font-bold leading-none cursor-pointer flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-amber-500" /> Director
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="isManager" 
                        checked={formData.isManager} 
                        onCheckedChange={(checked) => handleCheckboxChange('isManager', !!checked)}
                    />
                    <Label htmlFor="isManager" className="text-sm font-bold leading-none cursor-pointer flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-500" /> Department Manager
                    </Label>
                </div>
                <p className="text-[10px] text-muted-foreground italic mt-1">
                    CEOs and Directors are featured at the top of the team page. Managers are featured in the leadership grid.
                </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Job Title / Role</Label>
              <Input id="role" name="role" value={formData.role} onChange={handleInputChange} required placeholder="e.g., Export Manager" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} required className="min-h-[100px]" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="e.g., 212600000000" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Profile Photo</Label>
              <Input id="photo" type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="cursor-pointer" />
              {imagePreview && (
                <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
              <DialogClose asChild>
                <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Save Staff Member'}
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
                <span className="font-semibold text-foreground">{memberToDelete?.name}</span> and remove them from the team.
            </p>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete Forever
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
