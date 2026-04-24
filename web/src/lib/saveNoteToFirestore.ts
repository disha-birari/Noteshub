import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Saves a note's metadata to Firestore
 * @param title Title of the note
 * @param subject Subject of the note
 * @param url Public URL of the file (from Supabase)
 * @param userId ID of the user who uploaded the note
 * @param extraMetadata Additional fields like branch, semester, etc.
 */
export const saveNoteToFirestore = async (
  title: string,
  subject: string,
  url: string,
  userId: string,
  extraMetadata: any = {}
) => {
  try {
    const noteData = {
      title,
      subject,
      url,
      uploadedBy: userId,
      createdAt: serverTimestamp(),
      ...extraMetadata,
      branch: extraMetadata.branch?.toLowerCase(), // Normalize for searching
      semester: extraMetadata.semester?.toString(), // Ensure string
      year: extraMetadata.year?.toString() || '1',
      views: 0,
      likes: 0,
      downloads: 0,
      qualityScore: 5.0, // Default quality score
    };

    console.log("Saving note to Firestore:", noteData);

    const docRef = await addDoc(collection(db, 'notes'), noteData);
    
    return docRef.id;

  } catch (error: any) {
    console.error('Error saving note to Firestore:', error.message);
    throw error;
  }
};
