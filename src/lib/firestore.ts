import {
  firestoreDb,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
  orderBy,
  limit,
} from '@/lib/firebase';
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
 * Get entries by user ID with optional limit
 */
export async function getEntriesByUser(userId: string, limitCount?: number): Promise<Entry[]> {
  let q = query(collection(firestoreDb, ENTRIES_COLLECTION), where('userId', '==', userId));

  // Sort by createdAt descending (newest first)
  q = query(q, orderBy('createdAt', 'desc'));

  if (limitCount) {
    q = query(q, limit(limitCount));
  }

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    // Convert Firestore Timestamp to JavaScript Date
    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();

    return {
      id: doc.id,
      ...data,
      createdAt,
    } as Entry;
  });
}

/**
 * Update an existing entry
 */
export async function updateEntry(entryId: string, data: Partial<EntryData>): Promise<void> {
  const entryRef = doc(firestoreDb, ENTRIES_COLLECTION, entryId);
  await setDoc(entryRef, data, { merge: true });
}

/**
 * Delete an entry
 */
export async function deleteEntry(entryId: string): Promise<void> {
  const entryRef = doc(firestoreDb, ENTRIES_COLLECTION, entryId);
  await deleteDoc(entryRef);
}
