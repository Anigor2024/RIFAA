import type { Product } from '@/types';

export type Point = { x: number; y: number };
export type Placement = { x: number; y: number; width: number; length: number; angle: number };
export interface GarmentMask {
  productId: string;
  outline: [number, number][];
  shoulders: [number, number];
  top: number;
  bottom: number;
}

// These are reviewed, garment-only clipping guides for the existing reference
// photographs, not body segmentation, 3D cloth simulation or size predictions.
export const LOCAL_GARMENTS: GarmentMask[] = [
  { productId: 'm-01', shoulders: [0.34, 0.65], top: 0.225, bottom: 0.925,
    outline: [[0.43,0.18],[0.57,0.18],[0.59,0.23],[0.67,0.25],[0.735,0.59],[0.645,0.615],[0.616,0.405],[0.657,0.924],[0.313,0.924],[0.355,0.40],[0.305,0.605],[0.225,0.575],[0.30,0.25],[0.41,0.23]] },
  { productId: 'm-07', shoulders: [0.31, 0.68], top: 0.315, bottom: 0.875,
    outline: [[0.435,0.265],[0.57,0.265],[0.59,0.30],[0.696,0.335],[0.82,0.81],[0.72,0.858],[0.666,0.51],[0.686,0.874],[0.31,0.874],[0.327,0.51],[0.236,0.86],[0.14,0.825],[0.279,0.34],[0.411,0.30]] },
  { productId: 'w-01', shoulders: [0.405, 0.61], top: 0.355, bottom: 0.913,
    outline: [[0.458,0.335],[0.55,0.335],[0.614,0.37],[0.64,0.465],[0.596,0.526],[0.576,0.49],[0.65,0.91],[0.321,0.91],[0.369,0.602],[0.35,0.53],[0.395,0.394]] },
];
export const DEFAULT_PLACEMENT: Placement = { x: 0.5, y: 0.28, width: 0.34, length: 1, angle: 0 };
export const PHOTO_LIMIT = 8 * 1024 * 1024;
export const PHOTO_PIXEL_LIMIT = 40_000_000;
export const AI_PHOTO_LIMIT = 1_500_000;
export const CONSENT_VERSION = 'rifaa-tryon-2026-10-12';
export function getMask(id: string) { return LOCAL_GARMENTS.find(mask => mask.productId === id); }
export function aiEligible(product: Product) {
  return product.department !== 'kids' && !['shoes', 'accessories'].includes(product.categoryKey);
}
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}
export function calibrateShoulders(first: Point, second: Point): Placement | null {
  const left = first.x < second.x ? first : second;
  const right = first.x < second.x ? second : first;
  const dx = right.x - left.x;
  // Canvas coordinates are normalized against a 3:4 portrait viewport.
  const dy = (right.y - left.y) * 4 / 3;
  const distance = Math.hypot(dx, dy);
  if (distance < 0.08 || distance > 0.8) return null;
  return { x: (left.x + right.x) / 2, y: (left.y + right.y) / 2,
    width: clamp(distance, 0.12, 0.75), length: 1,
    angle: clamp(Math.atan2(dy, dx) * 180 / Math.PI, -25, 25) };
}
export function photoValidation(file: Pick<File, 'type' | 'size'>): 'format' | 'size' | null {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) return 'format';
  if (file.size < 100 || file.size > PHOTO_LIMIT) return 'size';
  return null;
}
