import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Upload file to Firebase Storage
 * @param uri - Local file URI
 * @param path - Storage path (e.g., 'profile-pictures/userId.jpg')
 * @param onProgress - Optional progress callback
 * @returns Download URL
 */
export const uploadFile = async (
  uri: string,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Convert URI to Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create storage reference
    const storageRef = ref(storage, path);

    // Upload file
    const uploadTask: UploadTask = uploadBytesResumable(storageRef, blob);

    // Return a promise that resolves with download URL
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress tracking
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          reject(new Error(error.message || 'Upload failed'));
        },
        async () => {
          // Upload complete, get download URL
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error: any) {
            reject(new Error(error.message || 'Failed to get download URL'));
          }
        }
      );
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload file');
  }
};

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (
  uri: string,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const timestamp = Date.now();
  const path = `profile-pictures/${userId}_${timestamp}.jpg`;
  return uploadFile(uri, path, onProgress);
};

/**
 * Upload CNIC front image
 */
export const uploadCNICFront = async (
  uri: string,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const timestamp = Date.now();
  const path = `cnic/${userId}_front_${timestamp}.jpg`;
  return uploadFile(uri, path, onProgress);
};

/**
 * Upload CNIC back image
 */
export const uploadCNICBack = async (
  uri: string,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const timestamp = Date.now();
  const path = `cnic/${userId}_back_${timestamp}.jpg`;
  return uploadFile(uri, path, onProgress);
};

/**
 * Upload job-related image
 */
export const uploadJobImage = async (
  uri: string,
  jobId: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const timestamp = Date.now();
  const path = `jobs/${jobId}_${timestamp}.jpg`;
  return uploadFile(uri, path, onProgress);
};

