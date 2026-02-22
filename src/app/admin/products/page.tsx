
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  ImageIcon,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

const AvocadoIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2c-3.5 0-6.5 3.5-6.5 7.5 0 5 3 12.5 6.5 12.5s6.5-7.5 6.5-12.5C18.5 5.5 15.5 2 12 2z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

type FirestoreProduct = DocumentData & { id: string };

const ITEMS_PER_PAGE = 10;

export default function ManageProductsPage() {
  const firestore = useFirestore();
  const storage = getStorage();
  const { toast } = useToast();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: allProducts, isLoading } = useCollection<FirestoreProduct>(productsQuery);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FirestoreProduct | null>(null);

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];

    let products = [...allProducts];

    if (searchTerm) {
      products = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      products = products.filter(p => p.category === categoryFilter);
    }

    products.sort((a, b) => {
      const aDate = a.createdAt as Timestamp | undefined;
      const bDate = b.createdAt as Timestamp | undefined;

      switch (sortOption) {
        case 'newest':
          return (bDate?.toMillis() || 0) - (aDate?.toMillis() || 0);
        case 'oldest':
          return (aDate?.toMillis() || 0) - (bDate?.toMillis() || 0);
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        default:
          return 0;
      }
    });

    return products;
  }, [allProducts, searchTerm, categoryFilter, sortOption]);

  const categories = useMemo(() => {
    if (!allProducts) return [];
    const uniqueCategories = new Set(allProducts.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(uniqueCategories)];
  }, [allProducts]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: FirestoreProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (product: FirestoreProduct) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct || !firestore || !storage) return;

    try {
      await deleteDoc(doc(firestore, 'products', selectedProduct.id));

      if (selectedProduct.imageUrl) {
        try {
          const imageStorageRef = storageRef(storage, selectedProduct.imageUrl);
          await deleteObject(imageStorageRef);
        } catch (storageError: any) {
          if (storageError.code !== 'storage/object-not-found') {
            console.warn("Could not delete product image:", storageError);
          }
        }
      }

      toast({
        title: 'Product Deleted',
        description: `"${selectedProduct.name}" has been removed.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: 'destructive',
        title: 'Error Deleting Product',
        description: 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manage Products</h1>
          <p className="text-muted-foreground text-sm">Create, edit, and organize your catalog items.</p>
        </div>
        <Button onClick={handleAddProduct} className="shadow-md">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by name or subtitle..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name-asc">Name: A-Z</SelectItem>
            <SelectItem value="name-desc">Name: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[100px] py-4 text-center">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden lg:table-cell">Category</TableHead>
                <TableHead className="text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-12 w-12 rounded-lg mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right pr-8"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map(product => (
                  <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden border shadow-sm mx-auto">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name || 'Product'} width={56} height={56} className="object-cover h-full w-full" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-base">{product.name || product.id}</p>
                        {product.subtitle && <p className="text-xs text-muted-foreground italic line-clamp-1">{product.subtitle}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize border border-primary/20">
                        {product.category || 'Uncategorized'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)} className="h-9 w-9 p-0 rounded-lg">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(product)} className="h-9 w-9 p-0 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">
                    No products found in your catalog.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t bg-muted/10">
            <div className="text-sm text-muted-foreground font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="rounded-lg">
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="rounded-lg">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        firestore={firestore}
        storage={storage}
        toast={toast}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Delete Product</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to permanently delete <span className="font-bold text-foreground">"{selectedProduct?.name}"</span>? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive hover:bg-destructive/90 rounded-xl">
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: FirestoreProduct | null;
  firestore: any;
  storage: any;
  toast: any;
}

function ProductFormModal({ isOpen, onClose, product, firestore, storage, toast }: ProductFormModalProps) {
  const isEditing = !!product;
  const [formData, setFormData] = useState<Partial<FirestoreProduct>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [enabledPeriod, setEnabledPeriod] = useState(false);
  const [enabledStorage, setEnabledStorage] = useState(false);
  const [enabledSizes, setEnabledSizes] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && product) {
        setFormData(product);
        setImagePreview(product.imageUrl || null);
        setEnabledPeriod(!!product.period);
        setEnabledStorage(!!product.storage);
        setEnabledSizes(!!product.sizes);
      } else {
        setFormData({ name: '', subtitle: '', description: '', category: 'avocado', period: '', storage: '', sizes: '' });
        setImagePreview(null);
        setEnabledPeriod(false);
        setEnabledStorage(false);
        setEnabledSizes(false);
      }
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [isOpen, product, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !storage) return;
    if (!formData.name) {
      toast({ variant: 'destructive', title: 'Missing Info', description: 'Name is required.' });
      return;
    }
    if (!isEditing && !imageFile) {
      toast({ variant: 'destructive', title: 'Image Required', description: 'Please select an image.' });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = product?.imageUrl || '';
      const docId = isEditing ? product.id : doc(collection(firestore, 'products')).id;

      if (imageFile) {
        const imagePath = `products/${docId}/${imageFile.name}`;
        const imageStorageRef = storageRef(storage, imagePath);
        await uploadBytes(imageStorageRef, imageFile);
        imageUrl = await getDownloadURL(imageStorageRef);
      }

      const productData = {
        name: formData.name,
        subtitle: formData.subtitle || '',
        description: formData.description || '',
        category: formData.category || 'avocado',
        period: enabledPeriod ? formData.period || '' : '',
        storage: enabledStorage ? formData.storage || '' : '',
        sizes: enabledSizes ? formData.sizes || '' : '',
        imageUrl,
        slug: (formData.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        updatedAt: serverTimestamp(),
      };

      const docRef = doc(firestore, 'products', docId);
      if (isEditing) {
        await updateDoc(docRef, productData);
      } else {
        await setDoc(docRef, { ...productData, id: docId, createdAt: serverTimestamp() });
      }

      toast({ title: 'Success', description: `Product "${productData.name}" saved.` });
      onClose();
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent valign="center" className="sm:max-w-[1000px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl max-h-[90vh] flex flex-col">
        <div className="bg-primary/5 p-4 md:p-5 border-b border-primary/10 shrink-0">
          <div className="flex items-center gap-2 mb-1 text-primary">
            <Package className="h-5 w-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{isEditing ? 'Update Catalog' : 'New Product'}</span>
          </div>
          <DialogHeader className="p-0 text-left">
            <DialogTitle className="text-2xl font-headline font-black text-foreground">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-grow">
          <div className="p-4 md:p-6">
            <form onSubmit={handleSubmit} id="product-form">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-foreground font-bold text-base border-b pb-1">
                      <Info className="h-4 w-4 text-primary" /> General Info
                    </div>
                    <div className="grid gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Product Title</Label>
                        <Input name="name" value={formData.name || ''} onChange={handleInputChange} placeholder="e.g., Hass Avocado" className="h-10 rounded-xl bg-muted/5 font-semibold" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Subtitle / Catchphrase</Label>
                        <Input name="subtitle" value={formData.subtitle || ''} onChange={handleInputChange} placeholder="e.g., Premium Moroccan Selection" className="h-10 rounded-xl bg-muted/5" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Classification</Label>
                        <Select onValueChange={(v) => handleInputChange({ target: { name: 'category', value: v } } as any)} value={formData.category || ''}>
                          <SelectTrigger className="h-10 rounded-xl bg-muted/5">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="avocado">Avocados</SelectItem>
                            <SelectItem value="berries">Berries</SelectItem>
                            <SelectItem value="citrus">Citrus</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Description</Label>
                        <Textarea name="description" value={formData.description || ''} onChange={handleInputChange} placeholder="Detailed product info..." className="min-h-[100px] rounded-xl bg-muted/5 resize-none" required />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-foreground font-bold text-base border-b pb-1">
                      <ImageIcon className="h-4 w-4 text-primary" /> Imagery
                    </div>
                    <div className="w-full aspect-video border-2 border-dashed border-primary/20 rounded-xl flex items-center justify-center relative bg-primary/[0.02] group overflow-hidden">
                      {imagePreview ? (
                        <>
                          <Image src={imagePreview} alt="Preview" fill className="object-cover p-1" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                            <p className="text-white font-bold text-xs bg-black/20 px-3 py-1.5 rounded-full">Click to Change</p>
                          </div>
                          <button type="button" className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-destructive text-white flex items-center justify-center z-10" onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(product?.imageUrl || null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
                            <X className="h-3.5 w-3.5" />
                          </button>
                          <div className="absolute inset-0 cursor-pointer" onClick={() => fileInputRef.current?.click()} />
                        </>
                      ) : (
                        <div className="text-center cursor-pointer p-4 w-full h-full flex flex-col items-center justify-center" onClick={() => fileInputRef.current?.click()}>
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2"><ImageIcon className="h-5 w-5 text-primary" /></div>
                          <p className="text-sm font-bold">Upload Photo</p>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-foreground font-bold text-base border-b pb-1">
                      <Layers className="h-4 w-4 text-primary" /> Export Features
                    </div>
                    <div className="grid grid-cols-1 gap-3 bg-muted/30 p-4 rounded-xl border">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Checkbox id="enable-period" checked={enabledPeriod} onCheckedChange={(c) => { setEnabledPeriod(!!c); if (!c) setFormData(p => ({ ...p, period: '' })); }} />
                          <Label htmlFor="enable-period" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Periode</Label>
                        </div>
                        <Input name="period" value={formData.period || ''} onChange={handleInputChange} placeholder="Dec - Apr" className="h-9 rounded-xl bg-white" disabled={!enabledPeriod} />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Checkbox id="enable-storage" checked={enabledStorage} onCheckedChange={(c) => { setEnabledStorage(!!c); if (!c) setFormData(p => ({ ...p, storage: '' })); }} />
                          <Label htmlFor="enable-storage" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Storage</Label>
                        </div>
                        <Input name="storage" value={formData.storage || ''} onChange={handleInputChange} placeholder="e.g., 6°C" className="h-9 rounded-xl bg-white" disabled={!enabledStorage} />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Checkbox id="enable-sizes" checked={enabledSizes} onCheckedChange={(c) => { setEnabledSizes(!!c); if (!c) setFormData(p => ({ ...p, sizes: '' })); }} />
                          <Label htmlFor="enable-sizes" className="text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center gap-1">
                            <AvocadoIcon className="h-3 w-3" /> Sizes
                          </Label>
                        </div>
                        <Input name="sizes" value={formData.sizes || ''} onChange={handleInputChange} placeholder="C12 - C28" className="h-9 rounded-xl bg-white" disabled={!enabledSizes} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </ScrollArea>

        <Separator className="bg-primary/10" />

        <DialogFooter className="p-4 md:p-5 flex flex-row items-center justify-between gap-4 shrink-0">
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="rounded-xl px-4 font-bold text-sm">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="product-form" disabled={isSubmitting} className="rounded-xl px-8 h-11 font-black shadow-lg shadow-primary/20 transition-all active:scale-95">
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Working...</> : <><Sparkles className="mr-2 h-4 w-4" /> {isEditing ? 'Save Changes' : 'Create'}</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
