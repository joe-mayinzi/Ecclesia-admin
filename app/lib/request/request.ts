import { auth } from "@/auth";

export const file_url = `https://d31uetu06bkcms.cloudfront.net/`;

// export const api_url = `http://192.168.0.157:4000/api/`; // HOMEBOX ORANGE
// export const api_url = `http://172.20.10.2:4000/api/`; // IP IPHONE

//export const api_url = `https://ecclesiabook.org/EhE7Aiheobj6gcBCZUsTkA5Kl_API_Admin`; 
// localhost

export const api_url = `http://localhost:3000/EhE7Aiheobj6gcBCZUsTkA5Kl_API_Admin/`;


// export const api_url = `https://ecclesiabook.org/api/`;
// export const api_url = `https://ecclesiabook.org/api_test/`;

// export const front_url = `http://localhost:3000/`;
// export const front_url = `https://ecclesiabook.linked-solution.net/`;
// export const front_url = `https://ecclesiabook.org/`;
export const front_url = `http://192.168.18.4:3000/`;

export async function HttpRequest(
  path: string,
  method: string = "GET",
  body?: any
) {
  const session = await auth();
  const token = (session as any)?.user?.access_token;
  

  const headers: any =
    body instanceof FormData
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

  try {
    const res = await fetch(`${api_url}${path}`, {
      method,
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
    // console.log(res);

    // if (!res.ok) {
    //   console.log(res);

    //   console.log({status: res.status,statusText: res.statusText });
    //   return null;
    // }
    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function AuthHttpRequest(
  path: string,
  method: string,
  data?: any
) {
  try {
    // const url = new URL(`${api_url}${path}`);
    // if (params) {
    //   Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    // }
    const response = await fetch(`${api_url}${path}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    });
    const res = await response.json();

    return res;
  } catch (error) {
    throw error;
  }
}

export async function RequestApi(
  path: string,
  method: string,
  data?: any,
  params?: any
) {
  try {
    const url = new URL(path);

    if (params) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
    }

    const response = await fetch(url.toString(), {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
      if (response.status === 401) {
        document.location = "https://ecclesiabook.org/AuthConnexionView";
      }

      return null;
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}