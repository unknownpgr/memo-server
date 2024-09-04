import { useEffect, useState } from "react";
import { Observable } from "../core/observable";

export function useObservable<T extends Observable>(service: T) {
  const [, set] = useState({});
  useEffect(() => {
    const listener = () => set({});
    service.addListener(listener);
    return () => service.removeListener(listener);
  }, [service]);
  return service;
}
