import { useQuery } from "@tanstack/react-query";

export interface OptimizedPharmacyDashboard {
  prescriptions: {
    pending: any[];
    recent: any[];
    totalPending: number;
  };
  activities: {
    recent: any[];
    byType: Record<string, number>;
    completedToday: number;
  };
  inventory: {
    lowStock: any[];
    recentUpdates: any[];
    totalMedicines: number;
  };
  summary: {
    pendingPrescriptions: number;
    activitiesCompletedToday: number;
    lowStockAlerts: number;
    lastUpdated: string;
  };
}

export function useOptimizedPharmacyDashboard() {
  return useQuery<OptimizedPharmacyDashboard>({
    queryKey: ["/api/pharmacy/dashboard"],
    staleTime: 2 * 60 * 1000, // 2 minutes - pharmacy data updates frequently
    refetchInterval: false, // Disabled auto-refresh, rely on manual refresh or staleTime
  });
}