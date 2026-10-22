import { Camera } from '../types';

/**
 * Automatically detects outfits with combined sizes (e.g. "S, L" or "M, XL")
 * and splits them into distinct items (1 outfit per size), ensuring each has its
 * own clean tag code (e.g. "VN Đ01-S", "VN Đ01-L") and independent status/availability.
 */
export function normalizeOutfitsBySize(cams: Camera[]): { normalized: Camera[]; splitCount: number } {
  let splitCount = 0;
  const result: Camera[] = [];

  for (const cam of cams) {
    if (cam.size && cam.size.includes(',')) {
      const sizes = cam.size.split(',').map(s => s.trim()).filter(Boolean);
      if (sizes.length > 1) {
        splitCount++;
        const rawSerial = (cam.serialNumber || 'VC-01').trim();
        const cleanBase = rawSerial.replace(/-+(XS|S|M|L|XL|XXL|3XL|4XL|FS|Freesize)$/i, '').trim().replace(/-+$/, '') || 'VC-01';
        const cleanName = cam.name.replace(/\s*\((Size\s+[^)]+|Freesize|FS)\)\s*$/i, '').trim() || cam.name;

        sizes.forEach((sz, idx) => {
          const sizeCode = sz === 'Freesize' ? 'FS' : sz;
          result.push({
            ...cam,
            id: idx === 0 ? cam.id : `${cam.id}-sz-${sz.toLowerCase()}`,
            name: `${cleanName} (${sz === 'Freesize' ? 'Freesize' : `Size ${sz}`})`,
            serialNumber: `${cleanBase}-${sizeCode}`,
            size: sz,
            availableSizes: [sz]
          });
        });
        continue;
      }
    }
    result.push(cam);
  }

  return { normalized: result, splitCount };
}
