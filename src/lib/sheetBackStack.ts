/**
 * LIFO stack so Android hardware back closes sheets before navigating.
 */

type Closer = () => void;

const stack: Closer[] = [];

export function pushSheetCloser(close: Closer): () => void {
  stack.push(close);
  return () => {
    const i = stack.lastIndexOf(close);
    if (i >= 0) stack.splice(i, 1);
  };
}

/** Returns true if a sheet was closed. */
export function popSheetCloser(): boolean {
  const close = stack.pop();
  if (!close) return false;
  try {
    close();
  } catch {
    /* ignore */
  }
  return true;
}

export function hasOpenSheet(): boolean {
  return stack.length > 0;
}
