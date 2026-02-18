
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
  DialogDescription,
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

// Flexible type for Firestore documents
type FirestoreProduct = DocumentData & { id: string };

const ITEMS_PER_PAGE = 10;

// --- Main Page Component ---
export default function ManageProductsPage() {
  const firestore = useFirestore();
  const storage = getStorage();
  const { toast } = useToast();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: allProducts, isLoading } = useCollection<FirestoreProduct>(productsQuery);

  const [filteredProducts, setFilteredProducts] = useState<FirestoreProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FirestoreProduct | null>(null);

  // --- Data Filtering and Sorting ---
  const categories = useMemo(() => {
    if (!allProducts) return [];
    const uniqueCategories = new Set(allProducts.map(p => p.category).filter(Boolean));
    return ['all', ...Array.from(uniqueCategories)];
  }, [allProducts]);

  useEffect(() => {
    if (!allProducts) return;

    let products = [...allProducts];

    // Search
    if (searchTerm) {
      products = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      products = products.filter(p => p.category === categoryFilter);
    }

    // Sort
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

    setFilteredProducts(products);
    setCurrentPage(1); // Reset to first page on filter change
  }, [allProducts, searchTerm, categoryFilter, sortOption]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  // --- Handlers for Modals and Actions ---
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
      // Delete Firestore document
      await deleteDoc(doc(firestore, 'products', selectedProduct.id));

      // If there's an image, delete it from Storage
      if (selectedProduct.imageUrl) {
        try {
          const imageStorageRef = storageRef(storage, selectedProduct.imageUrl);
          await deleteObject(imageStorageRef);
        } catch (storageError: any) {
          // If file doesn't exist, we don't need to throw an error
          if (storageError.code !== 'storage/object-not-found') {
            console.warn("Could not delete product image from storage:", storageError);
          }
        }
      }

      toast({
        title: 'Product Deleted',
        description: `"${selectedProduct.name || selectedProduct.id}" has been removed.`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: 'destructive',
        title: 'Error Deleting Product',
        description: 'An unexpected error occurred. Please try again.',
      });
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manage Products</h1>
          <p className="text-muted-foreground text-sm">Create, edit, and organize your catalog items.</p>
        </div>
        <Button onClick={handleAddProduct} className="shadow-md">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
                placeholder="Search by name..."
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

      {/* Products Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <Table>
            <TableHeader className="bg-muted/30">
                <TableRow>
                <TableHead className="w-[100px] py-4">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden lg:table-cell">Category</TableHead>
                <TableHead className="text-right pr-8">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                    <TableCell><Skeleton className="h-12 w-12 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right pr-8"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                ))
                ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map(product => (
                    <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                        <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center overflow-hidden border shadow-sm">
                        {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name || 'Product'} width={56} height={56} className="object-cover h-full w-full" />
                        ) : (
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                        )}
                        </div>
                    </TableCell>
                    <TableCell className="font-semibold text-base">{product.name || product.id}</TableCell>
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="rounded-lg"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="rounded-lg"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
             </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        firestore={firestore}
        storage={storage}
        toast={toast}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Delete Product</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This action <span className="font-bold text-destructive">cannot be undone</span>. 
              Are you sure you want to permanently delete <span className="font-bold text-foreground italic">"{selectedProduct?.name || selectedProduct?.id}"</span> and all its media?
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
    </motion.div>
  );
}

// --- Product Form Modal Component ---

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

  // Export Features Checkboxes
  const [enabledPeriod, setEnabledPeriod] = useState(false);
  const [enabledStorage, setEnabledStorage] = useState(false);
  const [enabledSizes, setEnabledSizes] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, product, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
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

  const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !storage) return;

    if (!formData.name) {
        toast({ variant: 'destructive', title: 'Missing Info', description: 'Please provide a name for the product.' });
        return;
    }
    if (!isEditing && !imageFile) {
        toast({ variant: 'destructive', title: 'Image Required', description: 'Every product needs a high-quality image.' });
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

      const slug = slugify(formData.name);

      const productData = {
        name: formData.name,
        subtitle: formData.subtitle || '',
        description: formData.description || '',
        category: formData.category || 'avocado',
        period: enabledPeriod ? formData.period || '' : '',
        storage: enabledStorage ? formData.storage || '' : '',
        sizes: enabledSizes ? formData.sizes || '' : '',
        imageUrl,
        slug,
        imageHint: `${(formData.category || '').toLowerCase()} ${formData.name.toLowerCase().split(' ')[0]}`,
        updatedAt: serverTimestamp(),
      };

      const docRef = doc(firestore, 'products', docId);
      
      if (isEditing) {
        await updateDoc(docRef, productData);
      } else {
        await setDoc(docRef, {
            ...productData,
            id: docId,
            createdAt: serverTimestamp()
        });
      }

      toast({
        title: `Success`,
        description: `"${productData.name}" has been ${isEditing ? 'updated' : 'added'}.`,
      });
      onClose();

    } catch (error: any) {
      console.error('Failed to save product:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: error.message || 'An unexpected error occurred while saving.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl max-h-[90vh] flex flex-col">
        <div className="bg-primary/5 p-4 md:p-5 border-b border-primary/10 shrink-0">
          <DialogHeader className="p-0">
            <div className="flex items-center gap-2 mb-1 text-primary">
              <Package className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{isEditing ? 'Catalog Revision' : 'New Catalog Item'}</span>
            </div>
            <DialogTitle className="text-2xl font-headline font-black text-foreground">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-grow">
          <form onSubmit={handleSubmit} id="product-form" className="p-4 md:p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* LEFT COLUMN: BASIC INFO */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-foreground font-bold text-base border-b pb-1">
                    <Info className="h-4 w-4 text-primary" />
                    General Information
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Product Title</Label>
                      <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} placeholder="e.g., Premium Hass Avocado" className="h-10 border-muted-foreground/20 focus:border-primary/50 rounded-xl bg-muted/5 font-semibold text-base" required />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="subtitle" className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Catchphrase / Subtitle</Label>
                      <Input id="subtitle" name="subtitle" value={formData.subtitle || ''} onChange={handleInputChange} placeholder="e.g., The Finest Quality" className="h-10 border-muted-foreground/20 focus:border-primary/50 rounded-xl bg-muted/5 font-semibold text-base" />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Classification</Label>
                      <Select onValueChange={handleSelectChange} value={formData.category || ''}>
                          <SelectTrigger id="category" className="h-10 rounded-xl bg-muted/5 border-muted-foreground/20">
                              <SelectValue placeholder="Choose Category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                              <SelectItem value="avocado" className="rounded-lg">Avocado Varieties</SelectItem>
                              <SelectItem value="berries" className="rounded-lg">Fresh Berries</SelectItem>
                              <SelectItem value="citrus" className="rounded-lg">Citrus Fruits</SelectItem>
                              <SelectItem value="other" className="rounded-lg">Other Produce</SelectItem>
                          </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Description</Label>
                      <Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} placeholder="Write a compelling description..." className="min-h-[100px] rounded-xl bg-muted/5 border-muted-foreground/20 resize-none focus:border-primary/50 p-3 leading-relaxed text-sm" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* RIGHT COLUMN: VISUALS & FEATURES */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-foreground font-bold text-base border-b pb-1">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Product Imagery
                  </div>
                  
                  <div className="w-full aspect-video border-2 border-dashed border-primary/20 rounded-xl flex items-center justify-center relative bg-primary/[0.02] group transition-all hover:bg-primary/[0.04] hover:border-primary/40 overflow-hidden">
                      {imagePreview ? (
                          <>
                              <Image src={imagePreview} alt="Product preview" fill className="object-cover p-1" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                 <p className="text-white font-bold text-xs bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">Click to Replace</p>
                              </div>
                              <button
                                  type="button"
                                  className="absolute top-2 right-2 h-7 w-7 rounded-lg shadow-lg z-10 bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      setImageFile(null);
                                      setImagePreview(null);
                                      if (fileInputRef.current) fileInputRef.current.value = '';
                                  }}
                              >
                                  <X className="h-3.5 w-3.5" />
                              </button>
                              <div 
                                className="absolute inset-0 cursor-pointer" 
                                onClick={() => fileInputRef.current?.click()} 
                              />
                          </>
                      ) : (
                          <div
                              className="text-center cursor-pointer p-4 w-full h-full flex flex-col items-center justify-center"
                              onClick={() => fileInputRef.current?.click()}
                          >
                              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                                  <ImageIcon className="h-5 w-5 text-primary" />
                              </div>
                              <p className="text-sm font-bold text-foreground">Select Image</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">High-resolution JPG or PNG</p>
                          </div>
                      )}
                      <Input
                          ref={fileInputRef}
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                      />
                  </div>
                </div>

                {/* FEATURES SECTION */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-foreground font-bold text-base border-b pb-1">
                    <Layers className="h-4 w-4 text-primary" />
                    Export Features
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 bg-muted/30 p-4 rounded-xl border border-muted-foreground/10 shadow-inner">
                      {/* Period Feature */}
                      <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                              <Checkbox 
                                  id="enable-period" 
                                  checked={enabledPeriod} 
                                  onCheckedChange={(checked) => {
                                      setEnabledPeriod(!!checked);
                                      if(!checked) setFormData(prev => ({...prev, period: ''}));
                                  }} 
                              />
                              <Label htmlFor="enable-period" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer">Periode</Label>
                          </div>
                          <Input id="period" name="period" value={formData.period || ''} onChange={handleInputChange} placeholder="e.g. December to April" className="h-9 rounded-xl bg-white border-muted-foreground/20 text-sm disabled:opacity-50 disabled:bg-gray-100" disabled={!enabledPeriod} />
                      </div>

                      {/* Storage Feature */}
                      <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                              <Checkbox 
                                  id="enable-storage" 
                                  checked={enabledStorage} 
                                  onCheckedChange={(checked) => {
                                      setEnabledStorage(!!checked);
                                      if(!checked) setFormData(prev => ({...prev, storage: ''}));
                                  }} 
                              />
                              <Label htmlFor="enable-storage" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer">Storage Temp</Label>
                          </div>
                          <Input id="storage" name="storage" value={formData.storage || ''} onChange={handleInputChange} placeholder="e.g. 6°C" className="h-9 rounded-xl bg-white border-muted-foreground/20 text-sm disabled:opacity-50 disabled:bg-gray-100" disabled={!enabledStorage} />
                      </div>

                      {/* Sizes Feature */}
                      <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                              <Checkbox 
                                  id="enable-sizes" 
                                  checked={enabledSizes} 
                                  onCheckedChange={(checked) => {
                                      setEnabledSizes(!!checked);
                                      if(!checked) setFormData(prev => ({...prev, sizes: ''}));
                                  }} 
                              />
                              <Label htmlFor="enable-sizes" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground cursor-pointer">Available Sizes</Label>
                          </div>
                          <Input id="sizes" name="sizes" value={formData.sizes || ''} onChange={handleInputChange} placeholder="e.g. C12 - C28" className="h-9 rounded-xl bg-white border-muted-foreground/20 text-sm disabled:opacity-50 disabled:bg-gray-100" disabled={!enabledSizes} />
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        <Separator className="bg-primary/10" />

        <DialogFooter className="p-4 md:p-5 flex flex-row items-center justify-between gap-4 shrink-0">
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="rounded-xl px-4 font-bold hover:bg-muted text-sm">Cancel</Button>
          </DialogClose>
          <Button 
            type="submit" 
            form="product-form" 
            disabled={isSubmitting} 
            className="rounded-xl px-8 h-11 font-black text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {isEditing ? 'Save Changes' : 'Create Product'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
