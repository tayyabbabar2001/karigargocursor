import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppContextType, Screen, UserRole, Task, Worker, Bid } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('customer-splash');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const context: AppContextType = {
    screen,
    setScreen,
    userRole,
    setUserRole,
    currentUser,
    setCurrentUser,
    currentTask,
    setCurrentTask,
    selectedWorker,
    setSelectedWorker,
    selectedBid,
    setSelectedBid,
    tasks,
    setTasks,
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

