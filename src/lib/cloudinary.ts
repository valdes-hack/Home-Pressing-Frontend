/**
 * Utilitaire d'upload direct d'images vers Cloudinary (constats contradictoires RG16, vêtements, justificatifs).
 * Utilise l'upload non signé (unsigned preset) pour une intégration 100% sécurisée côté client.
 */

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'pressing_unsigned';

  if (!cloudName) {
    console.warn('[Cloudinary] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME non configuré. Mode simulation local actif.');
    return URL.createObjectURL(file);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Échec de l\'envoi vers Cloudinary');
  }

  const result: CloudinaryUploadResult = await response.json();
  return result.secure_url;
}
