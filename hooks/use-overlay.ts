'use client';

import { useEffect, useRef } from 'react';

/** A focus boundary for one modal surface. Restores focus and scroll on close. */
export function useOverlay<T extends HTMLElement>(open: boolean, close: () => void) {
  const ref = useRef<T>(null);
  const closeRef = useRef(close);

  useEffect(() => { closeRef.current = close; }, [close]);

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;

    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const inertSiblings: Array<{ element: HTMLElement; previous: boolean }> = [];

    // Preserve the dialog and its clickable backdrop. Inert sibling branches,
    // never an ancestor: this supports both nested overlays and body portals.
    let branch: HTMLElement = dialog.closest<HTMLElement>('.at-overlay') || dialog;
    while (branch !== document.body && branch.parentElement) {
      const parent = branch.parentElement;
      for (const sibling of Array.from(parent.children)) {
        if (sibling === branch || !(sibling instanceof HTMLElement)) continue;
        inertSiblings.push({ element: sibling, previous: sibling.inert });
        sibling.inert = true;
      }
      branch = parent;
    }

    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex], [contenteditable="true"]'
    )).filter(element => element.tabIndex >= 0 && !element.closest('[inert]')
      && element.getClientRects().length > 0 && window.getComputedStyle(element).visibility !== 'hidden');
    const focusFirst = () => (focusable()[0] || dialog).focus({ preventScroll: true });
    const frame = requestAnimationFrame(focusFirst);

    const containFocus = (event: FocusEvent) => {
      if (dialog.isConnected && event.target instanceof Node && !dialog.contains(event.target)) focusFirst();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      if (!elements.length) { event.preventDefault(); dialog.focus({ preventScroll: true }); return; }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog || !dialog.contains(document.activeElement))) {
        event.preventDefault(); last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault(); first.focus({ preventScroll: true });
      }
    };
    document.addEventListener('keydown', key, true);
    document.addEventListener('focusin', containFocus, true);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', key, true);
      document.removeEventListener('focusin', containFocus, true);
      for (const { element, previous: wasInert } of inertSiblings) element.inert = wasInert;
      document.body.style.overflow = previousOverflow;
      if (previous?.isConnected && !previous.closest('[inert]')) previous.focus({ preventScroll: true });
    };
  }, [open]);
  return ref;
}
