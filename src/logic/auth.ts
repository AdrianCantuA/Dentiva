export function login(email: string, password: string) {
  // Mock: acepta cualquier email con password "demo123"
  if (password === "demo123") {
    localStorage.setItem("token", btoa(email));
    return true;
  }
  return false;
}
export function logout() { localStorage.removeItem("token"); }
export function isAuthed() { return !!localStorage.getItem("token"); }
