import api from "../api";
export const getAppointments = async () => {
  try {
    const response = await api.get("/appointments");
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}
// utils/api.ts or services/appointment.ts (wherever you keep API calls)

export const appointmentsAdmin = async (filter = '') => {
  try {
    const response = await api.get("/appointments", {
      params: {
        filter, // sends ?filter=value in the URL
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

// services/appointment.ts or wherever your API calls are stored

export const updateAppointmentStatus = async (id: number, status: string) => {
  try {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Failed to update status for appointment ${id}`, error);
    throw error;
  }
};

export const bookAppointment = async (appointmentData: any) => {
  try {
    const response = await api.post("/appointments", appointmentData);
    return response.data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
}

export const getAppointmentById = async (id: number) => {
  try {
    const response = await api.get(`/appointments/user/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointment with id ${id}:`, error);
    throw error;
  }
}
export const upcomingAppoinments = async (userId: number) => {
  try {
    const response = await api.get(`/appointments/user/${userId}/upcoming`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching upcoming appointments for user with id ${userId}:`, error);
    throw error;
  }
}

export const createAppointment = async (appointmentData: any) => {
  try {
    const response = await api.post("/appointments", appointmentData);
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}
export const updateAppointment = async (id: number, appointmentData: any) => {
  try {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating appointment with id ${id}:`, error);
    throw error;
  }
}
export const deleteAppointment = async (id: number) => {
  try {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting appointment with id ${id}:`, error);
    throw error;
  }
}
export const getAppointmentByUserId = async (userId: number) => {
  try {
    const response = await api.get(`/appointments/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments for user with id ${userId}:`, error);
    throw error;
  }
}
export const getAppointmentByServiceId = async (serviceId: number) => {
  try {
    const response = await api.get(`/appointments/service/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments for service with id ${serviceId}:`, error);
    throw error;
  }
}
export const getAppointmentByDate = async (date: string) => {
  try {
    const response = await api.get(`/appointments/date/${date}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments for date ${date}:`, error);
    throw error;
  }
}
export const getAppointmentByStatus = async (status: string) => {
  try {
    const response = await api.get(`/appointments/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments with status ${status}:`, error);
    throw error;
  }
}
export const getAppointmentByServiceAndDate = async (serviceId: number, date: string) => {
  try {
    const response = await api.get(`/appointments/service/${serviceId}/date/${date}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments for service with id ${serviceId} on date ${date}:`, error);
    throw error;
  }
}
export const getAppointmentByUserAndService = async (userId: number, serviceId: number) => {
  try {
    const response = await api.get(`/appointments/user/${userId}/service/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments for user with id ${userId} and service with id ${serviceId}:`, error);
    throw error;
  }
}
export const getAppointmentByUserAndDate = async (userId: number, date: string) => {
  try {
    const response = await api.get(`/appointments/user/${userId}/date/${date}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments for user with id ${userId} on date ${date}:`, error);
    throw error;
  }
}
export const getAppointmentByServiceAndStatus = async (serviceId: number, status: string) => {
  try {
    const response = await api.get(`/appointments/service/${serviceId}/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments for service with id ${serviceId} with status ${status}:`, error);
    throw error;
  }
}
export const getAppointmentByUserAndStatus = async (userId: number, status: string) => {
  try {
    const response = await api.get(`/appointments/user/${userId}/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments for user with id ${userId} with status ${status}:`, error);
    throw error;
  }
}
export const getAppointmentByServiceAndUser = async (serviceId: number, userId: number) => {
  try {
    const response = await api.get(`/appointments/service/${serviceId}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching appointments for service with id ${serviceId} and user with id ${userId}:`, error);
    throw error;
  }
}
