export const parseImages = (images: any): string[] => {
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === "string") {
    if (images.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {}
    }
    return images.trim() ? [images] : [];
  }
  return [];
};
