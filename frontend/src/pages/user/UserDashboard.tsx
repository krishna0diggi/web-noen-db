import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DiscountBanner } from "@/components/ui/discount-banner";
import { Calendar, Clock, Star, Scissors, Award } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import { upcomingAppoinments } from "@/service/appoinmentService/appoinmentService";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const UserDashboard = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const stats = [
    { label: "Total Bookings", value: "12", icon: Calendar },
    { label: "Favorite Services", value: "3", icon: Star },
    { label: "Loyalty Points", value: "240", icon: Award },
  ];

  useEffect(() => {
    const fetchUpcoming = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await upcomingAppoinments(user.id);
        setUpcomingAppointments(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError("Failed to fetch upcoming appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, [user?.id]);

  return (
    <>
      <SEOHead 
        title="My Beauty Dashboard - Manage Appointments | LooksNLove Ladies Salon"
        description="Access your personal LooksNLove dashboard to view upcoming beauty appointments, book new services, and track your beauty journey."
        keywords="beauty dashboard, salon appointments, ladies salon booking"
        url="https://looksnlove.com/user"
      />

      <div className="space-y-8">
        {/* Welcome */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground mb-6">
            Book your next beauty session with us
          </p>
          <Link to="/user/services">
            <Button size="lg" className="gap-2">
              <Scissors className="w-5 h-5" />
              Book New Appointment
            </Button>
          </Link>
        </div>

        {/* Discount Banner */}
        {/* <DiscountBanner variant="dashboard" /> */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Appointments
            </CardTitle>
            <Link to="/user/appointments">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size={40} />
              </div>
            ) : error ? (
              <div className="text-center text-destructive py-8">{error}</div>
            ) : upcomingAppointments.length > 0 ? (
              <AnimatePresence>
                <div className="space-y-4">
                  {upcomingAppointments.map((appt, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, delay: idx * 0.07 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Scissors className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {Array.isArray(appt.services) ? appt.services.join(", ") : appt.services}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {appt.date}
                            <Clock className="w-4 h-4" />
                            {appt.time}
                          </div>
                        </div>
                      </div>
                      <Badge variant={appt.status?.toLowerCase() === "confirmed" ? "default" : "secondary"}>
                        {appt.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming appointments
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default UserDashboard;
