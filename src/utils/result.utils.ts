// src/utils/result.utils.ts

import type { Result, Success, Failure } from '../types/domain/common.types';

/**
 * Utilidades para trabajar con el tipo Result<T, E>
 * Implementa el patrón Result para manejo de errores sin excepciones
 */

/**
 * Crea un resultado exitoso
 */
export const success = <T>(data: T): Success<T> => ({
  success: true,
  data
});

/**
 * Crea un resultado fallido
 */
export const failure = <E = Error>(error: E): Failure<E> => ({
  success: false,
  error
});

/**
 * Verifica si el resultado es exitoso
 */
export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> => {
  return result.success === true;
};

/**
 * Verifica si el resultado es fallido
 */
export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> => {
  return result.success === false;
};

/**
 * Extrae el valor de un resultado exitoso, lanza error si falló
 */
export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (isSuccess(result)) {
    return result.data;
  }
  throw new Error(`Attempted to unwrap failed result: ${result.error}`);
};

/**
 * Extrae el valor de un resultado exitoso, retorna valor por defecto si falló
 */
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  return isSuccess(result) ? result.data : defaultValue;
};

/**
 * Mapea el valor de un resultado exitoso
 */
export const mapResult = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> => {
  return isSuccess(result) ? success(fn(result.data)) : result;
};

/**
 * Mapea el error de un resultado fallido
 */
export const mapError = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> => {
  return isFailure(result) ? failure(fn(result.error)) : result;
};

/**
 * Encadena operaciones que pueden fallar
 */
export const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> => {
  return isSuccess(result) ? fn(result.data) : result;
};

/**
 * Envuelve una función que puede lanzar excepciones en un Result
 */
export const tryCatch = <T>(fn: () => T): Result<T, Error> => {
  try {
    return success(fn());
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
};

/**
 * Versión async de tryCatch
 */
export const asyncTryCatch = async <T>(fn: () => Promise<T>): Promise<Result<T, Error>> => {
  try {
    const data = await fn();
    return success(data);
  } catch (error) {
    return failure(error instanceof Error ? error : new Error(String(error)));
  }
};

/**
 * Combina múltiples resultados en uno solo
 * Si todos son exitosos, retorna array con todos los valores
 * Si alguno falla, retorna el primer error
 */
export const combineResults = <T, E>(results: Result<T, E>[]): Result<T[], E> => {
  const values: T[] = [];
  
  for (const result of results) {
    if (isFailure(result)) {
      return result;
    }
    values.push(result.data);
  }
  
  return success(values);
};

/**
 * Aplica una función a cada elemento de un array, retornando Result<U[], E>
 */
export const mapArray = <T, U, E>(
  items: T[],
  fn: (item: T) => Result<U, E>
): Result<U[], E> => {
  const results = items.map(fn);
  return combineResults(results);
};