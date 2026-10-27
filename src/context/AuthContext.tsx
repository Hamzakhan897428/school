import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { router } from "expo-router";
import { api, setOnUnauthorized, ApiError } from "../api/client";
import { storage } from "../api/storage";
import { ParentProfile, Child, LoginResponse } from "../types/api";

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
  user: ParentProfile | null;
  children: Child[];
  selectedChild: Child | null;
  setSelectedChild: (child: Child) => void;
  selectChildById: (childId: string) => void;
  login: (identifier: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  setLocale: (locale: "en" | "ur") => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fallback demo child if testing offline or before login
const DEMO_CHILD: Child = {
  id: "STD-DEMO-01",
  name: "Faizan Abbasi",
  firstName: "Faizan",
  admissionNo: "7821",
  gender: "male",
  photoUrl: "",
  classId: "CLS-7A",
  classLabel: "Class Grade 7 A",
  relation: "guardian",
  school: {
    id: "SCH-01",
    name: "Greenfield Grammar School",
    city: "Karachi",
    logoUrl: "",
    color: "#4F46E5",
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children: providerChildren,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(false);
  const [user, setUser] = useState<ParentProfile | null>(null);
  const [childrenList, setChildrenList] = useState<Child[]>([DEMO_CHILD]);
  const [selectedChild, setSelectedChildState] = useState<Child | null>(
    DEMO_CHILD
  );

  const setSelectedChild = useCallback((child: Child) => {
    setSelectedChildState(child);
    storage.setSelectedChildId(child.id);
  }, []);

  const selectChildById = useCallback(
    (childId: string) => {
      const found = childrenList.find((c) => c.id === childId);
      if (found) {
        setSelectedChild(found);
      }
    },
    [childrenList, setSelectedChild]
  );

  // Sign out handler
  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // Ignore network errors on logout
    }
    setUser(null);
    setIsAuthenticated(false);
    setMustChangePassword(false);
    await storage.clearAll();
    router.replace("/");
  }, []);

  // Handle unauthorized callback from api client
  useEffect(() => {
    setOnUnauthorized(async () => {
      setUser(null);
      setIsAuthenticated(false);
      setMustChangePassword(false);
      router.replace("/");
    });
  }, []);

  // Refresh profile & children list
  const refreshProfile = useCallback(async () => {
    try {
      const me = await api.me();
      setUser(me.parent);
      setMustChangePassword(!!me.mustChangePassword);
      setIsAuthenticated(true);

      if (me.children && me.children.length > 0) {
        setChildrenList(me.children);
        const storedChildId = await storage.getSelectedChildId();
        const active =
          me.children.find((c) => c.id === storedChildId) || me.children[0];
        setSelectedChildState(active);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        await storage.clearToken();
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Check stored token on startup
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const token = await storage.getToken();
        if (token) {
          await refreshProfile();
        }
      } catch {
        // Network offline or failed init
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [refreshProfile]);

  // Login implementation
  const login = async (
    identifier: string,
    password: string
  ): Promise<LoginResponse> => {
    const res = await api.login({
      identifier,
      password,
      deviceLabel: "+923001601844",
    });

    setUser(res.parent);
    setIsAuthenticated(true);
    setMustChangePassword(!!res.mustChangePassword);

    if (res.children && res.children.length > 0) {
      setChildrenList(res.children);
      const firstChild = res.children[0];
      setSelectedChild(firstChild);
    }

    return res;
  };

  // Change password implementation
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    await api.changePassword({ currentPassword, newPassword });
    setMustChangePassword(false);
  };

  // Update locale (English/Urdu)
  const setLocale = async (locale: "en" | "ur") => {
    if (user) {
      setUser({ ...user, locale });
    }
    if (isAuthenticated) {
      try {
        await api.updateProfile({ locale });
      } catch {
        // Keep optimistic state locally
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        mustChangePassword,
        user,
        children: childrenList,
        selectedChild,
        setSelectedChild,
        selectChildById,
        login,
        logout,
        changePassword,
        setLocale,
        refreshProfile,
      }}
    >
      {providerChildren}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

