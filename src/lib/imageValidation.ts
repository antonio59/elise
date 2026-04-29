export function validateImageFile(
  file: File,
  maxSizeMB: number,
): string | null {
  if (!file.type.startsWith("image/")) {
    return "Please select an image file (JPG, PNG, or WebP).";
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Image must be less than ${maxSizeMB}MB`;
  }
  return null;
}
