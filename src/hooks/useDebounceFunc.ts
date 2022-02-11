import { useEffect, useRef } from 'react';
import { useDebounce } from 'react-use';

export default function useDebounceFunc(fn: () => void, delay: number = 300, dependency: any[] = []) {
  const isMounted = useRef(false);

  useDebounce(
    () => {
      if (isMounted.current) {
        fn();
      } else {
        isMounted.current = true;
      }
    },
    delay,
    dependency,
  );

  useEffect(() => {
    fn();
  }, []);
}
