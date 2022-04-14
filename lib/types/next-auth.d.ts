import NextAuth, { DefaultSession } from "next-auth";
import { JWT, DefaultJWT, GetTokenParams } from "next-auth/jwt";

type Providers = "google" | "github" | "facebook" | "credential";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id: string
    }
    expires: ISODateString;
    userRoles: string[];
    provider: string | null;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** OpenID ID Token */
    roles?: string[]
    provider?: string | null;
  }
}

export interface resetPassProps {
  mail: string;
  newPass: string;
  token: string;
}




