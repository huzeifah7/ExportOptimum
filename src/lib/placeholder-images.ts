
import * as data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  type?: 'image' | 'video';
  videoUrl?: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = (data as any).placeholderImages;
