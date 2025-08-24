import { useState, useEffect } from "react";

/**
 * Hook personalizado para "debouncear" (retrasar) un valor.
 * @param value El valor que se quiere retrasar (ej: un término de búsqueda).
 * @param delay El tiempo de retraso en milisegundos (ej: 500).
 * @returns El valor retrasado.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // 1. Estado para guardar el valor con "debounce"
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 2. Crea un temporizador que se ejecutará después del 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 3. Limpia el temporizador si el 'value' o el 'delay' cambian.
    //    Esto es crucial: si el usuario sigue tecleando, el temporizador
    //    anterior se cancela y se crea uno nuevo.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se re-ejecuta si el valor o el delay cambian

  // 4. Devuelve el último valor estable
  return debouncedValue;
}
