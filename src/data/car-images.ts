/** Local car photos in `public/images/cars` (uploaded via admin). */
export const CAR_IMAGE_ASSETS = [
  "/images/cars/car-1761744097096-vy9xd8.png",
  "/images/cars/car-1761744174302-7unq8x.png",
  "/images/cars/car-1761744330165-3r6k83.png",
  "/images/cars/car-1761744504322-pxzpsz.png",
  "/images/cars/car-1761744737746-0wt09k.png",
  "/images/cars/car-1761746450052-c5jlgx.png",
  "/images/cars/car-1761746617860-m54i1h.png",
  "/images/cars/car-1761744427087-g3qtwk.jpg",
  "/images/cars/car-1761746540006-kq61bz.jpg",
  "/images/cars/car-1761678507883-ofp59m.jpg",
  "/images/cars/car-1761678513015-bt50rx.jpg",
  "/images/cars/car-1761678519286-a80xan.jpg",
  "/images/cars/car-1761678808779-ei7vai.jpg",
  "/images/cars/car-1761678815637-009mty.jpg",
  "/images/cars/car-1761678821381-k7l1ig.jpg",
  "/images/cars/car-1761678893809-b11aqy.jpg",
  "/images/cars/car-1761678899813-aw44o5.jpg",
  "/images/cars/car-1761679269457-nmp5mg.jpg",
  "/images/cars/car-1761679314919-apy32x.jpg",
] as const;

export const DEFAULT_CAR_IMAGE = CAR_IMAGE_ASSETS[0];

export function carImageAt(index: number): string {
  return CAR_IMAGE_ASSETS[index % CAR_IMAGE_ASSETS.length];
}
