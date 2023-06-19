import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000/passmaster" });

export const registerUser = async (user: {
  username: string;
  email: string;
  fullname: string;
  password: string;
}) => {
  const response = await api.post("/register", user);
  return response.data;
};

export const getTotp = async (username: string) => {
  const response = await api.get(`/totp/${username}`);
  return response.data;
};

export const verifyTotp = async (username: string, totp_token: string) => {
  const response = await api.post(
    `/verify_totp/${username}?totp_token=${totp_token}`
  );
  return response.data;
};

export const loginUser = async (username: string, password: string) => {
  const response = await api.post(
    "/token",
    new URLSearchParams({
      grant_type: "",
      username: username,
      password: password,
      scope: "",
      client_id: "",
      client_secret: "",
    }).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

export const getUser = async (token: string) => {
  const response = await api.get("/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllPasswords = async (token: string) => {
  const response = await api.get("/get_all_passwords", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const savePassword = async (
  password_data: {
    website: string;
    email: string;
    username: string;
    password: string;
  },
  token: string
) => {
  try {
    const response = await api.post("/save_password", password_data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error during API call", error);
  }
};

export const getPassword = async (passmaster_id: string, token: string) => {
  const response = await api.get(`/get_password/${passmaster_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updatePassword = async (
  passmaster_id: string,
  password_data: {
    website?: string;
    email?: string;
    username?: string;
    password?: string;
  },
  token: string
) => {
  try {
    const response = await api.put(
      `/update_password/${passmaster_id}`,
      password_data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error data', error.response.data);
      console.error('Error status', error.response.status);
      console.error('Error headers', error.response.headers);
    } else if (error.request) {
      console.error('No response received', error.request);
    } else {
      console.error('Error', error.message);
    }
    console.error('Error config', error.config);
  }
};

export const deletePassword = async (passmaster_id: string, token: string) => {
  const response = await api.delete(`/delete_password/${passmaster_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
