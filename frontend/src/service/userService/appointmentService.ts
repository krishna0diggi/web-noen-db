import api from "@/service/api";

// Book a new appointment (bulk or single)
export const bookAppointment = async (data: {
  userId: number;
  serviceIds: number[];
  date: string;
  time: string;
  totalAmount: number;
}) => {
  const res = await api.post("/appointments", data);
  return res.data;
};

// Get all appointments for a user
export const getUserAppointments = async (userId: number) => {
  const res = await api.get(`/appointments/user/${userId}`);
  return res.data;
};

// Cancel an appointment
export const cancelAppointment = async (appointmentId: number) => {
  const res = await api.patch(`/appointments/${appointmentId}/cancel`);
  return res.data;
};
