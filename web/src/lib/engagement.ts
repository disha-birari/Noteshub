import { db } from './firebase';
import { doc, updateDoc, increment, getDoc, setDoc, deleteDoc } from 'firebase/firestore';


/**
 * Increments the view count for a note
 * @param noteId The Firestore document ID of the note
 */
export const incrementView = async (noteId: string) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      views: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
};

/**
 * Increments the download count for a note
 * @param noteId The Firestore document ID of the note
 */
export const incrementDownload = async (noteId: string) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      downloads: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing downloads:', error);
  }
};

/**
 * Toggles a like for a note
 * (Simple version: just increments. For a real app, you'd track WHICH user liked it)
 * @param noteId The Firestore document ID of the note
 */
/**
 * Toggles a like for a note
 */
export const toggleLike = async (noteId: string) => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error('Error toggling like:', error);
  }
};

/**
 * Toggles a bookmark for a note
 */

export const toggleBookmark = async (userId: string, noteId: string, noteData: any) => {
  try {
    const bookmarkRef = doc(db, 'users', userId, 'bookmarks', noteId);
    const docSnap = await getDoc(bookmarkRef);

    if (docSnap.exists()) {
      await deleteDoc(bookmarkRef);
      return false; // Removed
    } else {
      await setDoc(bookmarkRef, {
        ...noteData,
        bookmarkedAt: new Date()
      });
      return true; // Added
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
};

