import { supabase } from './supabase';
import { saveNoteToFirestore } from './saveNoteToFirestore';



/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param metadata Metadata for the note (title, branch, semester, etc.)
 * @param bucket The name of the bucket (default: 'notes')
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async (
  file: File, 
  metadata: { 
    title: string; 
    branch: string; 
    semester: string; 
    userId: string;
    subject?: string;
    description?: string;
  },
  bucket: string = 'notes'
) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${metadata.userId}/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // 1. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // 2. Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    // 3. Save metadata to Firestore using the utility
    const docId = await saveNoteToFirestore(
      metadata.title,
      metadata.subject || 'General',
      publicUrl,
      metadata.userId,
      {
        branch: metadata.branch,
        semester: metadata.semester,
        description: metadata.description,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        filePath: filePath
      }
    );

    return { publicUrl, docId };

  } catch (error: any) {
    console.error('Error handling upload:', error.message);
    throw error;
  }
};


/**
 * Lists all files in a bucket folder
 * @param path The path inside the bucket
 * @param bucket The name of the bucket
 */
export const listFiles = async (path: string = '', bucket: string = 'notes') => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path);
    
  if (error) {
    throw error;
  }
  
  return data;
};
