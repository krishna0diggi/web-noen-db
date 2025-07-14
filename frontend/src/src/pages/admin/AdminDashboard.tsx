import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, ShoppingCart, Star, TrendingUp, Clock, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NotificationCard } from "@/components/admin/NotificationCard";
import { StaggerContainer, StaggerItem, AnimatedSection } from "@/components/ui/animated-card";

const stats = [
  {
    title: "Today's Appointments",
    value: "12",
    icon: Calendar,
    color: "text-primary",
    bgColor: "bg-primary/10",
    change: "+2 from yesterday",
  },
  {
    title: "New Customers",
    value: "8",
    icon: Users,
    color: "text-info",
    bgColor: "bg-info/10",
    change: "+15% this week",
  },
  {
    title: "Revenue Today",
    value: "$1,250",
    icon: ShoppingCart,
    color: "text-success",
    bgColor: "bg-success/10",
    change: "+8% from yesterday",
  },
  {
    title: "Avg Rating",
    value: "4.8",
    icon: Star,
    color: "text-warning",
    bgColor: "bg-warning/10",
    change: "Excellent",
  },
];

const recentAppointments = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    service: "Hair Styling & Color",
    time: "10:00 AM",
    status: "confirmed",
    avatar: "SJ",
  },
  {
    id: "2",
    customerName: "Emily Davis",
    service: "Manicure & Pedicure",
    time: "11:30 AM",
    status: "pending",
    avatar: "ED",
  },
  {
    id: "3",
    customerName: "Maria Garcia",
    service: "Facial Treatment",
    time: "2:00 PM",
    status: "confirmed",
    avatar: "MG",
  },
  {
    id: "4",
    customerName: "Lisa Wilson",
    service: "Eyebrow Threading",
    time: "3:30 PM",
    status: "confirmed",
    avatar: "LW",
  },
];

const initialNotifications = [
  {
    id: "1",
    type: "appointment" as const,
    title: "New Appointment Booked",
    message: "Sarah Johnson booked Hair Styling for tomorrow at 10:00 AM",
    time: "2 minutes ago",
    isNew: true,
  },
  {
    id: "2",
    type: "review" as const,
    title: "New Customer Review",
    message: "Emily Davis left a 5-star review for your nail service",
    time: "15 minutes ago",
    isNew: true,
  },
  {
    id: "3",
    type: "order" as const,
    title: "Payment Received",
    message: "Payment of $85 received for Maria Garcia's facial treatment",
    time: "1 hour ago",
    isNew: false,
  },
];

export default function AdminDashboard() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
          </motion.div>
          <motion.div 
            className="flex items-center gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" className="gap-2">
                <Bell className="w-4 h-4" />
                Notifications
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {notifications.filter(n => n.isNew).length}
                </Badge>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Stats Grid */}
      <AnimatedSection>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <motion.div 
                        className={`p-3 rounded-lg ${stat.bgColor}`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </motion.div>
                    </div>
                    <div className="flex items-center gap-1 mt-4">
                      <TrendingUp className="w-3 h-3 text-success" />
                      <span className="text-xs text-success">{stat.change}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </AnimatedSection>

      <AnimatedSection>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Appointments */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="col-span-1">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Today's Appointments</CardTitle>
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {recentAppointments.length} scheduled
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAppointments.map((appointment, index) => (
                  <motion.div 
                    key={appointment.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground font-medium text-sm">
                        {appointment.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{appointment.customerName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-foreground">{appointment.time}</span>
                      </div>
                      <Badge className={getStatusColor(appointment.status)} variant="secondary">
                        {appointment.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="outline" className="w-full">
                    View All Appointments
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Notifications */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="col-span-1">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.slice(0, 4).map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <NotificationCard
                      notification={notification}
                      onDismiss={handleDismissNotification}
                    />
                  </motion.div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No new notifications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </AnimatedSection>
    </div>
  );
}