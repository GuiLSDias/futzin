// usePelada hook
import { useState, useEffect } from "react";

export function usePelada(id: string) {
  const [pelada, setPelada] = useState(null);

  useEffect(() => {
    // Fetch pelada
  }, [id]);

  return { pelada };
}
