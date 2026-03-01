import { firestoreDb, collection, addDoc, getDocs, query, where } from '@/lib/firebase';
import { Entry, EntryData } from '@/types/entries';

const ENTRIES_COLLECTION = 'entries';

/**
 * Create a new entry
 */
export async function createEntry(data: EntryData): Promise<string> {
  const docRef = await addDoc(collection(firestoreDb, ENTRIES_COLLECTION), {
    ...data,
    createdAt: new Date(),
  });
  return docRef.id;
}

/**
 * Get entries by user ID
 */
export async function getEntriesByUser(userId: string): Promise<Entry[]> {
  const q = query(
    collection(firestoreDb, ENTRIES_COLLECTION),
    where('userId', '==', userId)
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Entry[];
}
