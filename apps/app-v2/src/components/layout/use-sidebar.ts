import { useCallback, useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const unsubscribe = router.subscribe(
      'onResolved',
      (evt: { pathChanged?: boolean }) => {
        if (evt.pathChanged) setIsOpen(false);
      },
    );

    return unsubscribe;
  }, [router]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return { isOpen, open, close, toggle };
}
