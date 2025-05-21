import { CancelablePromise } from "../api";

export function timeout<T>(
  promise: CancelablePromise<T>,
  ms = 5000
): Promise<T> {
  setTimeout(() => promise.cancel(), ms);
  return promise;
}
