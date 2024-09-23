import moment from "moment";

import {
  HttpRequest,
  AuthHttpRequest,
  RequestApi,
  api_url,
} from "../../../lib/request/request";

export interface credentials {
  telephone: string;
  password?: string;
}
export interface createAdminDto {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  password: string;
  privilege: string;
  fk_eglise?: number;
}
export interface CreateAbonnementDto {
  montant_abonnement: string | null;
  method_abonnement: string | null;
  reference_abonnement: string | null;
  // type_abonnement_id: number
}

const Maxicash = {
  PayType: "MaxiCash",
  MerchantID: "81a1c6e9175943d19a72250354871790",
  MerchantPassword: "d8938074afca416398e5daca220e57d1",
  Amount: "20000", //please note that the amounts must be sent in Cents
  Currency: "maxiDollar", //values can be “maxiDollar” or “maxiRand”
  Telephone: "0823999082",
  Language: "en", //en or fr
  Reference: moment().unix(),
  SuccessURL: "http://localhost:3000/AuthPayementSuccessView",
  FailureURL: "http://localhost:3000/AuthPayementSuccessView",
  CancelURL: "http://localhost:3000/AuthPayementSuccessView",
  NotifyURL: "http://localhost:3000/AuthPayementSuccessView",
};

var payloadString = "";

payloadString = JSON.stringify(Maxicash);
payloadString = payloadString.replace(/\"/g, '\\"');
export const AuthLogin = async (credentials: credentials) =>
  await AuthHttpRequest("auth/signin/admin", "POST", credentials);
export const AuthLoginToPay = async (dto: credentials) =>
  await AuthHttpRequest("auth/local/signin", "POST", dto);
export const AuthPayementApi = async () =>
  await RequestApi(
    "https://api-testbed.maxicashme.com/Merchant/api.asmx",
    "POST",
    '{ strData: "' + payloadString + '" }',
  );
export const createAdmin = async (credentials: createAdminDto) =>
  await AuthHttpRequest("auth/local/signup", "POST", credentials);

export const updateAdmin = async (
  dto: any,
  access_token: string,
  id: number,
) => {
  try {
    const res = await fetch(`${api_url}auth/link/admin/church/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      return null;
    }
    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
};
// await HttpRequest(``, "PATCH", dto);
export const createFile = async (route: string, dto: any) =>
  await HttpRequest(route, "POST", dto);
export const ReloadSession = async (dto: any) =>
  await HttpRequest("auth/local/signin", "POST", dto);
export const Abonnement_access = async (dto: CreateAbonnementDto) =>
  await HttpRequest("abonnement", "POST", dto);

export const AuthCheckValideCode = async (dto: { tel: string; code: string }) =>
  await HttpRequest(`auth/checkValideCode`, "POST", dto);
