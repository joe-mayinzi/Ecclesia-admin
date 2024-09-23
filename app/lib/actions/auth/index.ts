"use server";

import { AuthError } from "next-auth";

import { CreateAbonnementDto, Token } from "../../config/interface";
import { HttpRequest, api_url } from "../../request/request";

import { signIn } from "@/auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
  }
}

export async function authSigninUser({
  telephone,
  password,
}: {
  telephone: string;
  password: string;
}) {
  try {
    const res = await fetch(`${api_url}auth/signin/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ telephone, password }),
      cache: "no-store",
    });

    if (res.status !== 201) {
      return null;
    }

    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function authWithUsername({ username }: { username: string }) {
  try {
    const res = await fetch(`${api_url}auth/user/username/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
}

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

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token, // Fall back to old refresh token
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const Abonnement_access = async (dto: CreateAbonnementDto) =>
  await HttpRequest("abonnement", "POST", dto);

export const findUserByIdApi = async (id: number) =>
  await HttpRequest(`auth/getUserById/${id}`, "GET");

export const checkValidateCodeApi = async (code: string, tel: string) =>
  await HttpRequest(`auth/checkValideCode`, "POST", { code, tel });
export const AuthsendSmsByTelApi = async (dto: {
  tel: string;
  email: string;
}) =>
  await HttpRequest(
    `auth/sendSmsByTel?telephone=${dto.tel}&email=${dto.email}`,
    "GET",
  );
export const AuthDeleteApi = async () =>
  await HttpRequest("auth/delete/user/", "DELETE");
export const AuthDeleteDataOfUserApi = async () =>
  await HttpRequest("auth/delete/user/", "DELETE");
export const IdentificationSendFileApi = async (dto: any) =>
  await HttpRequest("identification", "POST", dto);
