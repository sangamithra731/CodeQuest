import { useEffect, useState } from "react";

let pyodideInstance = null;
let loadingPromise = null;

export function usePyodide() {
  const [pyodide, setPyodide] = useState(pyodideInstance);
  const [loading, setLoading] = useState(!pyodideInstance);

  useEffect(() => {
    if (pyodideInstance) {
      setPyodide(pyodideInstance);
      setLoading(false);
      return;
    }
    if (!loadingPromise) {
      loadingPromise = window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/",
      });
    }
    loadingPromise.then((instance) => {
      pyodideInstance = instance;
      setPyodide(instance);
      setLoading(false);
    });
  }, []);

  return { pyodide, loading };
}