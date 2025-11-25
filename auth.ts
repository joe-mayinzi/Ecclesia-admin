// ./app/api/auth/[...nextauth]/route.ts
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

import { authSigninUser, refreshAccessToken } from "@/app/lib/actions/auth";
import { AuthResponse, PayloadAdmin } from "@/app/lib/config/interface";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    console.log("⚡ [authorize] credentials reçues:", credentials);

    // Validation Zod : email obligatoire
    const parsed = z
      .object({
        email: z.string().email(),
        password: z.string().min(6),
      })
      .safeParse(credentials);

    if (!parsed.success) {
      console.error("❌ [authorize] Validation failed:", parsed.error.format());
      return null;
    }

    const user: AuthResponse | null = await authSigninUser({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (!user) {
      console.error("❌ [authorize] Login failed");
      return null;
    }

    return user as unknown as User;
  },
}),

  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const now = moment().unix();

      // Mise à jour forcée
      if (trigger === "update") return { ...token, ...session.user };

      // Nouvel utilisateur connecté → on stocke ses tokens
      if (user) {
        token.access_token = (user as any).access_token;
        token.refresh_token = (user as any).refresh_token;
        return token;
      }

      // Rafraîchir si token expiré
      if (token && token.access_token) {
        const decoded: PayloadAdmin = jwtDecode(token.access_token as string);

        if (decoded.exp < now) {
          try {
            const rt = await refreshAccessToken({
              access_token: token.access_token as string,
              refresh_token: token.refresh_token as string,
            });

            token.access_token = rt.access_token;
            token.refresh_token = rt.refresh_token;
          } catch (err) {
            console.error("❌ [jwt] Refresh token failed:", err);
            return { ...token, error: "RefreshTokenError" };
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
  // On décode le token pour extraire les infos du payload
  if (token?.access_token) {
    try {
      const decoded: PayloadAdmin = jwtDecode(token.access_token as string);

      session.user = {
        ...session.user,
        id: decoded.sub,
        nom: decoded.nom,
        prenom: decoded.prenom,
        telephone: decoded.telephone,
        email: decoded.email,
        username: decoded.username,
        profil: decoded.profil,
        status: decoded.status,
        privileges: decoded.privileges,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      } as any;
    } catch (err) {
      console.error("❌ Erreur décodage JWT:", err);
      session.user = {
        ...session.user,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      } as any;
    }
  }

  return session;
}
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});
