"use server";

import { CreateAbonnementDto, Token } from "../../config/interface";
import { HttpRequest, api_url } from "../../request/request";
import { signIn } from "@/auth";

// Authentification via NextAuth
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const res = await signIn("credentials", {
      redirect: false, // ⚡ indispensable pour gérer la réponse
      email: formData.get("email"),
      password: formData.get("password"),
    });

    return res;
  } catch (error) {
    console.error(error);
    return { error: "Quelque chose s'est mal passé." };
  }
}

// Nouvelle fonction login
export async function authSigninUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const res = await fetch(`${api_url}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errMsg = await res.text();
      console.error("❌ Erreur API login:", res.status, res.statusText, errMsg);
      return null;
    }

    const data = await res.json();
    console.log("✅ Response API login:", data);
    return data;
  } catch (error) {
    console.error("❌ Exception authSigninUser:", error);
    throw error;
  }
}


// Rafraîchir le token
export async function refreshAccessToken(token: Token) {
  try {
    const response = await fetch(`${api_url}auth/refresh/`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token.refresh_token}`,
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token,
    };
  } catch (error) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

// Autres appels Auth
export const Abonnement_access = async (dto: CreateAbonnementDto) =>
  await HttpRequest("abonnement", "POST", dto);

export const findUserByIdApi = async (id: number) =>
  await HttpRequest(`auth/getUserById/${id}`, "GET");
