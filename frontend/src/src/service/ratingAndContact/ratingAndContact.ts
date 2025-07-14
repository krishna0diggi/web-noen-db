import api from "../api";
export const getRatings = async () => {
  try {
    const response = await api.get("/ratings");
    return response.data;
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
};
export const getRatingById = async (id: number) => {
  try {
    const response = await api.get(`/ratings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching rating with id ${id}:`, error);
    throw error;
  }
};
export const createRating = async (ratingData: any) => {
  try {
    const response = await api.post("/ratings", ratingData);
    return response.data;
  } catch (error) {
    console.error("Error creating rating:", error);
    throw error;
  }
};
export const updateRating = async (id: number, ratingData: any) => {
  try {
    const response = await api.put(`/ratings/${id}`, ratingData);
    return response.data;
  } catch (error) {
    console.error(`Error updating rating with id ${id}:`, error);
    throw error;
  }
};
export const deleteRating = async (id: number) => {
  try {
    const response = await api.delete(`/ratings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting rating with id ${id}:`, error);
    throw error;
  }
};
export const getRatingsByUserId = async (userId: number) => {
  try {
    const response = await api.get(`/ratings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ratings for user with id ${userId}:`, error);
    throw error;
  }
};
export const getRatingsByServiceId = async (serviceId: number) => {
  try {
    const response = await api.get(`/ratings/service/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ratings for service with id ${serviceId}:`, error);
    throw error;
  }
};
export const getContacts = async () => {
  try {
    const response = await api.get("/contacts");
    return response.data;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
}

