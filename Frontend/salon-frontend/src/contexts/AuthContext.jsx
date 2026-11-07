import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as auth from "@/lib/auth";
import { usersApi } from "@/api/users";
import { FullscreenLoader } from "@/components/ui/FullscreenLoader";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [initializing, setInitializing] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);
  const [roles, setRoles] = useState([]);

  async function loadProfile() {
    try {
      const data = await usersApi.getProfile();
      setProfile(data);
    } catch {
      setProfile(null);
    }
  }

  function applyTokens(tokens) {
    if (tokens) {
      setAuthenticated(true);
      setRoles(tokens.role ? [tokens.role] : []);
    } else {
      setAuthenticated(false);
      setRoles([]);
      setProfile(null);
    }
  }

  useEffect(() => {
    async function hydrate() {
      const token = await auth.getValidAccessToken();
      const tokens = auth.getCurrentTokens();
      applyTokens(token ? tokens : null);
      if (token) await loadProfile();
    }
    hydrate().finally(() => setInitializing(false));
    const unsubscribe = auth.onAuthChange((tokens) => applyTokens(tokens));
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      authenticated,
      initializing,
      profile,
      roles,
      hasRole: (role) => roles.includes(role),
      isSalonOwner: roles.includes("SALON_OWNER"),
      isAdmin: roles.includes("ADMIN"),
      login: async (email, password) => {
        await auth.login(email, password);
        await loadProfile();
      },
      signup: async (payload) => {
        await auth.signup(payload);
        await loadProfile();
      },
      logout: () => auth.logout(),
      refreshProfile: loadProfile,
    }),
    [authenticated, initializing, profile, roles]
  );

  if (initializing) return <FullscreenLoader label="Preparing your session…" />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
