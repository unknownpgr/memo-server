import useSWR from "swr";

const fetcher = (input: RequestInfo | URL, init?: RequestInit | undefined) =>
  fetch(input, init).then((res) => res.json());

const useJSON = <T>(input: RequestInfo | URL, init?: RequestInit | undefined) =>
  useSWR<T>(input, fetcher);

export default useJSON;
