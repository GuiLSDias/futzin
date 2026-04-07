// useGrupo hook
import { useState, useEffect } from "react";

export function useGrupo(id: string) {
  const [grupo, setGrupo] = useState(null);

  useEffect(() => {
    // Fetch grupo
  }, [id]);

  return { grupo };
}
