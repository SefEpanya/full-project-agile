import { useEffect, useRef } from 'react';
import { kanbanApi } from '../utils/api';

interface RealtimeSyncOptions {
  kanbanId: string | null;
  onUpdate: (data: any) => void;
  enabled: boolean;
}

/**
 * Hook to sync kanban data in real-time
 * Polls the server every 5 seconds to check for updates
 */
export const useRealtimeSync = ({ kanbanId, onUpdate, enabled }: RealtimeSyncOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<string>('');

  useEffect(() => {
    if (!enabled || !kanbanId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const fetchUpdates = async () => {
      try {
        const data = await kanbanApi.getById(kanbanId);
        
        // Simple change detection - compare stringified data
        const currentData = JSON.stringify(data);
        if (currentData !== lastUpdateRef.current) {
          lastUpdateRef.current = currentData;
          onUpdate(data);
        }
      } catch (error) {
        console.error('Error fetching real-time updates:', error);
      }
    };

    // Initial fetch
    fetchUpdates();

    // Poll every 5 seconds
    intervalRef.current = setInterval(fetchUpdates, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [kanbanId, enabled, onUpdate]);
};
