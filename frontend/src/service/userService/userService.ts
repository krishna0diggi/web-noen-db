export const registerUser = async (userData: any) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
export const forgotPasswordService = async (phone: string, newPassword: string) => {
  try {
    const res = await api.post('/auth/forgot-password', { phone, newPassword });
    return res.data;
  } catch (error: any) {
    throw error;
  }
};
import api from "@/service/api";

export const getUserProfile = async (userId: number) => {
  const res = await api.get(`/auth/profile?id=${userId}`);
  return res.data;
};

interface UpdateUserProfilePayload {
  id: number;
  name: string;
  address: string;
}

export const updateUserProfile = async (profile: UpdateUserProfilePayload) => {
  try {
    const res = await api.put("/auth/profile", profile);
    return res.data;
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const verifyPhoneNumber = async (phone: string): Promise<boolean> => {
  try {
    const res = await api.post("/phoneVerify", { phone });
    // Assume API returns { exists: boolean }
    return res.data.exists;
  } catch (error) {
    return false;
  }
};
