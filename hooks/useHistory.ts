import { useEffect } from "react";
import { AppState, HistoryItem } from "../types";

export const useHistory = (
  appState: AppState,
  setAppState: React.Dispatch<React.SetStateAction<AppState>>,
) => {
  const history = appState.history;

  useEffect(() => {
    const savedHistory = localStorage.getItem("gitaura_history");
    if (savedHistory) {
      try {
        setAppState((s) => ({ ...s, history: JSON.parse(savedHistory) }));
      } catch (e) {
        console.error("History parse error", e);
      }
    }
  }, [setAppState]);

  const addToHistory = (owner: string, name: string, score: number) => {
    const newItem: HistoryItem = {
      id: `${owner}-${name}-${Date.now()}`,
      owner,
      name,
      score,
      date: Date.now(),
    };

    setAppState((prev) => {
      const filtered = prev.history.filter(
        (h) => h.owner !== owner || h.name !== name,
      );
      const newHistory = [newItem, ...filtered].slice(0, 6);
      localStorage.setItem("gitaura_history", JSON.stringify(newHistory));
      return { ...prev, history: newHistory };
    });
  };

  const clearHistory = () => {
    localStorage.removeItem("gitaura_history");
    setAppState((s) => ({ ...s, history: [] }));
  };

  return { history, addToHistory, clearHistory };
};
