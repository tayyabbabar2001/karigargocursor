export type UserRole = 'customer' | 'worker' | 'admin' | null;

export type Screen = 
  // Customer screens
  | 'customer-splash'
  | 'customer-login'
  | 'customer-dashboard'
  | 'post-task'
  | 'bidding'
  | 'worker-profile-view'
  | 'chat'
  | 'job-tracking'
  | 'live-tracking'
  | 'payment'
  | 'rating-review'
  | 'customer-profile'
  | 'customer-my-jobs'
  // Worker screens
  | 'worker-login'
  | 'available-jobs'
  | 'job-detail'
  | 'bid-submission'
  | 'ongoing-jobs'
  | 'worker-live-tracking'
  | 'earnings-history'
  | 'worker-profile'
  | 'worker-review'
  | 'worker-messages'
  // Admin screens
  | 'admin-dashboard'
  | 'user-management'
  | 'job-management'
  | 'payment-report'
  | 'feedback-dispute'
  // Shared screens
  | 'personal-info'
  | 'edit-name'
  | 'edit-email'
  | 'edit-phone'
  | 'edit-address'
  | 'change-password'
  | 'language-selection'
  | 'help-support';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  date: string;
  time: string;
  image?: string;
  status: 'pending' | 'in-progress' | 'completed';
  customerId: string;
  customerName: string;
  workerId?: string;
  workerName?: string;
  bids?: Bid[];
}

export interface Bid {
  id: string;
  workerId: string;
  workerName: string;
  workerPhoto: string;
  skill: string;
  bidPrice: number;
  rating: number;
  distance: string;
  verified: boolean;
  completionTime?: string;
  message?: string;
}

export interface Worker {
  id: string;
  name: string;
  photo: string;
  skills: string[];
  rating: number;
  totalJobs: number;
  verified: boolean;
  distance: string;
  jobHistory: { title: string; rating: number; date: string }[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isCustomer: boolean;
}

export interface AppContextType {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  currentTask: Task | null;
  setCurrentTask: (task: Task | null) => void;
  selectedWorker: Worker | null;
  setSelectedWorker: (worker: Worker | null) => void;
  selectedBid: Bid | null;
  setSelectedBid: (bid: Bid | null) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

