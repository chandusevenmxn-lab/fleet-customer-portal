import React from 'react';

const AuthContext = React.createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => {},
  signOut: () => {},
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [session, setSession] = React.useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          setSession('admin-session-token');
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading: false,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
