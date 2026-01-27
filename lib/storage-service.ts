import { createSupabaseServer } from '@/lib/supabase/server';

export class StorageService {
  /**
   * Upload a file to a Supabase storage bucket.
   * @param supabase The Supabase client instance.
   * @param file The file object to upload.
   * @param bucket The name of the storage bucket.
   * @param path The path (including filename) where the file should be saved in the bucket.
   * @returns The public URL of the uploaded file.
   */
  static async upload(
    supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
    file: File,
    bucket: string,
    path: string
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return publicUrl;
  }

  /**
   * Delete a file from a Supabase storage bucket using its public URL.
   * @param supabase The Supabase client instance.
   * @param url The public URL of the file to delete.
   * @param bucket The name of the storage bucket.
   */
  static async delete(
    supabase: Awaited<ReturnType<typeof createSupabaseServer>>,
    url: string,
    bucket: string
  ): Promise<void> {
    const parts = url.split(`${bucket}/`);
    if (parts.length > 1) {
      const path = parts[parts.length - 1];
      await supabase.storage.from(bucket).remove([path]);
    }
  }
}
