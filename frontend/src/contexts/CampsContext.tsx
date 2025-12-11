// frontend/src/contexts/CampsContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export type Camp = {
  id: number;
  name: string;
  description?: string;
  location?: string;
  start_time: string;
  total_slots: number;
  allocated_slots?: number;
  created_at?: string;
};

type CampsContextType = {
  camps: Camp[];
  loading: boolean;
  error?: string | null;
  refresh: () => Promise<void>;
  getCampById: (id: number) => Camp | undefined;
};

const CampsContext = createContext<CampsContextType | undefined>(undefined);

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000/api";

export const CampsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCamps = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Camp[]>(`${API_BASE}/camps`);
      setCamps(res.data);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch camps");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    await fetchCamps();
  };

  const getCampById = (id: number) => camps.find((c) => c.id === id);

  return (
    <CampsContext.Provider
      value={{ camps, loading, error, refresh, getCampById }}
    >
      {children}
    </CampsContext.Provider>
  );
};

export const useCamps = (): CampsContextType => {
  const ctx = useContext(CampsContext);
  if (!ctx) throw new Error("useCamps must be used inside CampsProvider");
  return ctx;
};
