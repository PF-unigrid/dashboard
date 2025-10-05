// src/hooks/useAsync.ts

import { useEffect, useCallback, useReducer } from 'react';
import type { Result } from '../types/domain/common.types';
import { isSuccess } from '../utils/result.utils';

/**
 * Estado para operaciones asíncronas
 */
interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isIdle: boolean;
  lastExecuted: Date | null;
}

type AsyncAction<T> =
  | { type: 'IDLE' }
  | { type: 'PENDING' }
  | { type: 'RESOLVED'; data: T }
  | { type: 'REJECTED'; error: Error };

/**
 * Reducer para manejar estados asíncronos
 */
const asyncReducer = <T>(state: AsyncState<T>, action: AsyncAction<T>): AsyncState<T> => {
  switch (action.type) {
    case 'IDLE':
      return {
        data: null,
        error: null,
        isLoading: false,
        isIdle: true,
        lastExecuted: null,
      };
    
    case 'PENDING':
      return {
        ...state,
        error: null,
        isLoading: true,
        isIdle: false,
      };
    
    case 'RESOLVED':
      return {
        data: action.data,
        error: null,
        isLoading: false,
        isIdle: false,
        lastExecuted: new Date(),
      };
    
    case 'REJECTED':
      return {
        data: null,
        error: action.error,
        isLoading: false,
        isIdle: false,
        lastExecuted: new Date(),
      };
    
    default:
      return state;
  }
};

/**
 * Hook para manejar operaciones asíncronas con estado robusto
 */
export function useAsync<T, P extends any[] = []>(
  asyncFunction: (...params: P) => Promise<Result<T>>,
  immediate = false
) {
  const initialState: AsyncState<T> = {
    data: null,
    error: null,
    isLoading: false,
    isIdle: true,
    lastExecuted: null,
  };

  const [state, dispatch] = useReducer(asyncReducer<T>, initialState);

  const execute = useCallback(async (...params: P) => {
    dispatch({ type: 'PENDING' });
    
    try {
      const result = await asyncFunction(...params);
      
      if (isSuccess(result)) {
        dispatch({ type: 'RESOLVED', data: result.data });
        return result.data;
      } else {
        dispatch({ type: 'REJECTED', error: result.error });
        throw result.error;
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      dispatch({ type: 'REJECTED', error: errorObj });
      throw errorObj;
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    dispatch({ type: 'IDLE' });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as P));
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
    // Utilidades de estado
    isSuccess: state.data !== null && !state.error,
    isError: state.error !== null,
    hasExecuted: state.lastExecuted !== null,
  };
}

/**
 * Hook simplificado para fetch de datos
 */
export function useFetch<T>(
  fetchFunction: () => Promise<Result<T>>,
  dependencies: React.DependencyList = [],
  options: {
    immediate?: boolean;
    refetchInterval?: number;
  } = {}
) {
  const { immediate = true, refetchInterval } = options;
  const asyncState = useAsync(fetchFunction, immediate);

  // Auto-refetch
  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      const interval = setInterval(() => {
        asyncState.execute();
      }, refetchInterval);

      return () => clearInterval(interval);
    }
  }, [asyncState.execute, refetchInterval]);

  // Re-execute cuando cambien las dependencias
  useEffect(() => {
    if (!immediate && dependencies.length > 0) {
      asyncState.execute();
    }
  }, dependencies);

  return {
    ...asyncState,
    refetch: asyncState.execute,
  };
}

/**
 * Hook para debouncing de operaciones asíncronas
 */
export function useDebouncedAsync<T, P extends any[] = []>(
  asyncFunction: (...params: P) => Promise<Result<T>>,
  delay = 300
) {
  const asyncState = useAsync(asyncFunction);
  
  const debouncedExecute = useCallback(
    debounce(asyncState.execute, delay),
    [asyncState.execute, delay]
  );

  return {
    ...asyncState,
    execute: debouncedExecute,
  };
}

/**
 * Utilidad de debounce
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}