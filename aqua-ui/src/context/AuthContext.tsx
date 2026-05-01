import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  tenantId?: number | null;
  tenant?: {
    id: number;
    nombre: string;
    estado: string;
    plan?: {
      id: number;
      nombre: string;
    } | null;
  } | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  requirePasswordChange: boolean;
  login: (token: string, user: User, requirePasswordChange: boolean) => void;
  logout: () => void;
  resolvePasswordChange: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // NUEVO: Estado para bloquear la navegación
  const [requirePasswordChange, setRequirePasswordChange] = useState<boolean>(() => {
    return localStorage.getItem("requirePasswordChange") === "true";
  });

  const navigate = useNavigate();

  const login = (newToken: string, newUser: User, mustChangePass: boolean = false) => {
    setToken(newToken);
    setUser(newUser);
    setRequirePasswordChange(mustChangePass);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("requirePasswordChange", String(mustChangePass));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRequirePasswordChange(false);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("requirePasswordChange");
    navigate("/login");
  };

  // Función para liberar al usuario una vez que cambia la clave
  const resolvePasswordChange = () => {
    setRequirePasswordChange(false);
    localStorage.removeItem("requirePasswordChange");
    if (user?.rol === 'SUPERADMIN') {
      navigate("/dashboard");
    } else {
      navigate("/admin-dashboard");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        requirePasswordChange,
        login,
        logout,
        resolvePasswordChange,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}