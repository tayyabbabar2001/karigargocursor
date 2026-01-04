import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  setDoc,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Task, Bid, Message } from '../types';

// ==================== JOBS/TASKS ====================

export interface JobData extends Omit<Task, 'date'> {
  date: string | Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  customerProfilePicture?: string;
}

/**
 * Create a new job/task
 */
export const createJob = async (jobData: Omit<JobData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const jobDoc = {
      ...jobData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'jobs'), jobDoc);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create job');
  }
};

/**
 * Get job by ID
 */
export const getJob = async (jobId: string): Promise<JobData | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'jobs', jobId));
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as JobData;
    }
    
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get job');
  }
};

/**
 * Get jobs by customer ID
 */
export const getJobsByCustomer = async (customerId: string): Promise<JobData[]> => {
  try {
    const q = query(
      collection(db, 'jobs'),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as JobData[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get customer jobs');
  }
};

/**
 * Get available jobs for workers (pending status)
 */
export const getAvailableJobs = async (skills?: string[]): Promise<JobData[]> => {
  try {
    let q = query(
      collection(db, 'jobs'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    let jobs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as JobData[];

    // Filter by skills if provided
    if (skills && skills.length > 0) {
      jobs = jobs.filter(job => skills.includes(job.category));
    }

    return jobs;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get available jobs');
  }
};

/**
 * Get jobs by worker ID
 */
export const getJobsByWorker = async (workerId: string): Promise<JobData[]> => {
  try {
    const q = query(
      collection(db, 'jobs'),
      where('workerId', '==', workerId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as JobData[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get worker jobs');
  }
};

/**
 * Update job status
 */
export const updateJobStatus = async (
  jobId: string,
  status: 'pending' | 'in-progress' | 'completed',
  workerId?: string
): Promise<void> => {
  try {
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (workerId) {
      updateData.workerId = workerId;
    }

    await updateDoc(doc(db, 'jobs', jobId), updateData);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update job status');
  }
};

// ==================== BIDS ====================

export interface BidData extends Bid {
  jobId: string;
  createdAt?: Timestamp;
  workerProfilePicture?: string;
}

/**
 * Create a bid for a job
 */
export const createBid = async (bidData: Omit<BidData, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const bidDoc = {
      ...bidData,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'bids'), bidDoc);
    
    // Also add bid to job's bids array (or subcollection)
    await updateDoc(doc(db, 'jobs', bidData.jobId), {
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create bid');
  }
};

/**
 * Get bids for a job
 */
export const getBidsByJob = async (jobId: string): Promise<BidData[]> => {
  try {
    const q = query(
      collection(db, 'bids'),
      where('jobId', '==', jobId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as BidData[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get bids');
  }
};

/**
 * Get bids by worker ID
 */
export const getBidsByWorker = async (workerId: string): Promise<BidData[]> => {
  try {
    const q = query(
      collection(db, 'bids'),
      where('workerId', '==', workerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as BidData[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get worker bids');
  }
};

/**
 * Accept a bid (update job with worker and status)
 */
export const acceptBid = async (jobId: string, bidId: string, workerId: string): Promise<void> => {
  try {
    // Update job
    await updateDoc(doc(db, 'jobs', jobId), {
      workerId,
      status: 'in-progress',
      updatedAt: serverTimestamp(),
    });

    // Update bid status
    await updateDoc(doc(db, 'bids', bidId), {
      accepted: true,
      acceptedAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to accept bid');
  }
};

// ==================== MESSAGES/CHAT ====================

export interface MessageData extends Message {
  jobId: string;
  createdAt?: Timestamp;
  read?: boolean;
  readAt?: Timestamp;
}

/**
 * Send a message
 */
export const sendMessage = async (messageData: Omit<MessageData, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const messageDoc = {
      ...messageData,
      read: false,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'messages'), messageDoc);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send message');
  }
};

/**
 * Get messages for a job/chat
 */
export const getMessages = async (jobId: string): Promise<MessageData[]> => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('jobId', '==', jobId),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as MessageData[];
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get messages');
  }
};

/**
 * Subscribe to real-time messages
 */
export const subscribeToMessages = (
  jobId: string,
  callback: (messages: MessageData[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'messages'),
    where('jobId', '==', jobId),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as MessageData[];
    callback(messages);
  });
};

/**
 * Mark message as read
 */
export const markMessageAsRead = async (messageId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'messages', messageId), {
      read: true,
      readAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to mark message as read');
  }
};

// ==================== USER UPDATES ====================

/**
 * Update user data
 */
export const updateUserData = async (userId: string, data: Partial<JobData>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update user data');
  }
};

// ==================== LOCATION TRACKING ====================

export interface LocationData {
  userId: string;
  jobId?: string;
  latitude: number;
  longitude: number;
  timestamp: Timestamp;
}

/**
 * Update worker location
 */
export const updateWorkerLocation = async (
  userId: string,
  latitude: number,
  longitude: number,
  jobId?: string
): Promise<void> => {
  try {
    const locationData: LocationData = {
      userId,
      jobId,
      latitude,
      longitude,
      timestamp: Timestamp.now(),
    };

    await setDoc(doc(db, 'locations', userId), locationData);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update location');
  }
};

/**
 * Get worker location
 */
export const getWorkerLocation = async (userId: string): Promise<LocationData | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'locations', userId));
    
    if (docSnap.exists()) {
      return docSnap.data() as LocationData;
    }
    
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get location');
  }
};

/**
 * Subscribe to worker location updates
 */
export const subscribeToWorkerLocation = (
  userId: string,
  callback: (location: LocationData | null) => void
): (() => void) => {
  return onSnapshot(doc(db, 'locations', userId), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as LocationData);
    } else {
      callback(null);
    }
  });
};

