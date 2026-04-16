export function saveGameState(state: any) {
    try {
      localStorage.setItem("life_os_state", JSON.stringify(state));
    } catch (e) {
      console.error("Save failed", e);
    }
  }
  
  export function loadGameState<T>() {
    try {
      const data = localStorage.getItem("life_os_state");
      return data ? (JSON.parse(data) as T) : null;
    } catch (e) {
      console.error("Load failed", e);
      return null;
    }
  }