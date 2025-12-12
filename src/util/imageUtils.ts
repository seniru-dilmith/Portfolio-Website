
import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file and converts it to a JPEG Blob (or File).
 * @param file The original file from the input.
 * @returns A promise that resolves to the compressed/converted File.
 */
export async function compressAndConvertToJpg(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,          // adjust max size as desired (e.g., 1MB)
    maxWidthOrHeight: 1920, // max width/height
    useWebWorker: true,
    fileType: 'image/jpeg',
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // browser-image-compression returns a Blob/File. 
    // Ensure we keep a meaningful name, swapping extension to .jpg
    const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
    
    // If the library returns a Blob, we might need to cast/wrap it as a File for some APIs, 
    // but usually it mimics File well enough. Let's explicitly return a File object to be safe.
    return new File([compressedFile], newName, { type: 'image/jpeg' });
  } catch (error) {
    console.error('Image compression failed:', error);
    throw error; // Let the caller handle the fallback or error
  }
}
