import api from "../api";

export const getSerivices = async () => {
  try {
    const response = await api.get("/services");
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}
export const getServiceById = async (id: number) => {
  try {
    const response = await api.get(`/services/category/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching service with id ${id}:`, error);
    throw error;
  }
}
// http://localhost:3004/api/services/category/3
export const createService = async (serviceData: any) => {
  try {
    const response = await api.post("/services", serviceData);
    return response.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}   
export const updateService = async (id: number, serviceData: any) => {
  try {
    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  } catch (error) {
    console.error(`Error updating service with id ${id}:`, error);
    throw error;
  }
}
export const deleteService = async (id: number) => {
  try {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting service with id ${id}:`, error);
    throw error;
  }
}
export const getCategories = async () => {
  try {
    const response = await api.get("/categories/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
export const getCategoryById = async (id: number) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
}
export const createCategory = async (categoryData: any) => {
  try {
    const response = await api.post("/categories", categoryData);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}
export const updateCategory = async (id: number, categoryData: any) => {
  try {
    const response = await api.patch(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    throw error;
  }
}
export const deleteCategory = async (id: number) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
}
// Get all services by category slug
export const getServicesByCategory = async (categorySlug: string) => {
  try {
    const response = await api.get(`/services/category/slug/${categorySlug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching services for category slug ${categorySlug}:`, error);
    throw error;
  }
}

