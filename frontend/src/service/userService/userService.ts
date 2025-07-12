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
