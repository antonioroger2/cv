import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { Project, ContactFormData } from '@/lib/types';

// Projects CRUD using Firestore
export const getProjects = (callback: (projects: Project[]) => void, forceRefresh = false) => {
  const cacheKey = 'projects_cache';
  const cacheExpiryKey = 'projects_cache_expiry';
  const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours 

  // Check cache if not forcing refresh
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(cacheKey);
      const expiry = localStorage.getItem(cacheExpiryKey);
      
      if (cached && expiry && Date.now() < parseInt(expiry)) {
        const projects = JSON.parse(cached);
        callback(projects);
        return () => {}; 
      }
    } catch (error) {
      console.warn('Error reading projects cache:', error);
    }
  }

  const projectsRef = collection(db, 'projects');
  const q = query(projectsRef, orderBy('order', 'desc'), orderBy('lastUpdated', 'desc'));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Project[];
    
    // Cache the projects
    try {
      localStorage.setItem(cacheKey, JSON.stringify(projects));
      localStorage.setItem(cacheExpiryKey, (Date.now() + CACHE_DURATION).toString());
    } catch (error) {
      console.warn('Error caching projects:', error);
    }
    
    callback(projects);
  });

  return unsubscribe;
};

export const addProject = async (project: Omit<Project, 'id' | 'lastUpdated'>) => {
  const docRef = await addDoc(collection(db, 'projects'), {
    ...project,
    lastUpdated: serverTimestamp(), // Use Firestore server time for consistency
  });
  return docRef.id;
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
  const projectRef = doc(db, 'projects', id);
  await updateDoc(projectRef, {
    ...updates,
    lastUpdated: serverTimestamp(),
  });
};

export const deleteProject = async (id: string) => {
  const projectRef = doc(db, 'projects', id);
  await deleteDoc(projectRef);
};

// --- Contact Form Submissions ---

export const submitContactForm = async (formData: Omit<ContactFormData, 'timestamp'>) => {
  const docRef = await addDoc(collection(db, 'contactSubmissions'), {
    ...formData,
    timestamp: serverTimestamp(),
  });
  return docRef.id;
};

export const getContactSubmissions = (callback: (submissions: ContactFormData[]) => void) => {
  const submissionsRef = collection(db, 'contactSubmissions');
  const q = query(submissionsRef, orderBy('timestamp', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const submissions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as ContactFormData[];
    callback(submissions);
  });
};

export const getProject = async (id: string): Promise<Project | null> => {
  const projectRef = doc(db, 'projects', id);
  const docSnap = await getDoc(projectRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Project;
  }
  
  return null;
};

