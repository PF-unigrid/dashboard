// src/hooks/useOptimizedState.ts

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { isEqual } from 'lodash-es';

/**
 * Hook optimizado para estado que solo re-renderiza cuando hay cambios reales
 */
export function useOptimizedState<T>(initialState: T | (() => T)) {
  const [state, setState] = useState(initialState);
  const previousStateRef = useRef(state);

  const setOptimizedState = useCallback((newState: T | ((prev: T) => T)) => {
    setState(prev => {
      const nextState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prev)
        : newState;

      // Solo actualizar si realmente cambió el estado
      if (!isEqual(nextState, previousStateRef.current)) {
        previousStateRef.current = nextState;
        return nextState;
      }

      return prev; // No hay cambios, mantener referencia anterior
    });
  }, []);

  return [state, setOptimizedState] as const;
}

/**
 * Hook para prevenir re-renders innecesarios basado en dependencias
 */
export function useStableMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  const depsRef = useRef<React.DependencyList>();
  const valueRef = useRef<T>();

  // Solo recalcular si las dependencias realmente cambiaron
  const depsChanged = !depsRef.current || 
    depsRef.current.length !== deps.length ||
    depsRef.current.some((dep, index) => !isEqual(dep, deps[index]));

  if (depsChanged) {
    depsRef.current = deps;
    valueRef.current = factory();
  }

  return valueRef.current!;
}

/**
 * Hook para callbacks estables que no causan re-renders
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const callbackRef = useRef<T>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    ((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }) as T,
    deps
  );
}

/**
 * Hook para valores derivados con memoización profunda
 */
export function useDerivedState<T, U>(
  sourceState: T,
  selector: (state: T) => U,
  compareFn?: (prev: U, next: U) => boolean
): U {
  const compare = compareFn || isEqual;
  
  return useMemo(() => {
    return selector(sourceState);
  }, [sourceState, selector, compare]);
}

/**
 * Hook para detectar cambios en objetos complejos
 */
export function useDeepCompareEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList
) {
  const ref = useRef<React.DependencyList>();

  if (!ref.current || !isEqual(ref.current, deps)) {
    ref.current = deps;
  }

  useEffect(effect, ref.current);
}

/**
 * Hook para lazy initialization costosa
 */
export function useLazyRef<T>(initializer: () => T): React.MutableRefObject<T> {
  const ref = useRef<T | null>(null);

  if (ref.current === null) {
    ref.current = initializer();
  }

  return ref as React.MutableRefObject<T>;
}

/**
 * Hook para prevenir memory leaks en componentes desmontados
 */
export function useMountedRef() {
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef;
}

/**
 * Hook para throttling de actualizaciones
 */
export function useThrottledValue<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    
    if (now >= lastExecuted.current + delay) {
      lastExecuted.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay - (now - lastExecuted.current));

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
}

/**
 * Hook para batching de actualizaciones de estado
 */
export function useBatchedState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const pendingUpdatesRef = useRef<((prev: T) => T)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchedSetState = useCallback((updater: T | ((prev: T) => T)) => {
    const updateFn = typeof updater === 'function' 
      ? updater as (prev: T) => T
      : () => updater;

    pendingUpdatesRef.current.push(updateFn);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setState(currentState => {
        let newState = currentState;
        pendingUpdatesRef.current.forEach(update => {
          newState = update(newState);
        });
        pendingUpdatesRef.current = [];
        return newState;
      });
    }, 0);
  }, []);

  return [state, batchedSetState] as const;
}