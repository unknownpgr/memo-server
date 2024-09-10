import { useEffect, useState } from "react";
import { Observable } from "../core/model/observable";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useObservable<T extends Observable<any>>(service: T): T {
  const [, set] = useState(0);
  useEffect(() => {
    const listener = () => set((prev) => prev + 1);
    service.addListener(listener);
    return () => service.removeListener(listener);
  }, [service]);
  return service;
}

/**
 * 위 코드에서 any를 가능하면 사용하고 싶지 않았지만 아래 모든 조건을 만족하는 방법을 찾지 못했다.
 * 1. 파라매터와 완전히 동일한 자료형을 반환해야 한다.
 * 2. Infer을 사용할 경우 infer된 타입을 사용해야 한다.
 * 3. Observable이 아닌 경우에는 에러를 발생시켜야 한다.
 */
