import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DiscountBanner } from "@/components/ui/discount-banner";
import { Calendar, Clock, Star, Scissors, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";

const UserDashboard = () => {
  // Mock data - replace with API calls
  const upcomingAppointments = [
    {
      id: 1,
      service: "Hair Styling",
      date: "2024-01-20",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      service: "Facial Treatment",
      date: "2024-01-25",
      time: "2:00 PM", 
      status: "pending",
    },
  ];

  const popularServices = [
    {
      id: 1,
      name: "Hair Styling",
      price: 50,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Facial Treatment",
      price: 80,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=300&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Manicure",
      price: 35,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=200&fit=crop",
    },
  ];

  const stats = [
    { label: "Total Bookings", value: "12", icon: Calendar },
    { label: "Favorite Services", value: "3", icon: Star },
    { label: "Loyalty Points", value: "240", icon: Award },
  ];

  return (
    <>
      <SEOHead 
        title="My Beauty Dashboard - Manage Appointments | LooksNLove Ladies Salon"
        description="Access your personal LooksNLove dashboard to view upcoming beauty appointments, book new services, and track your beauty journey. Exclusive offers and discounts available for our valued customers."
        keywords="beauty dashboard, salon appointments, ladies salon booking, personal beauty profile, appointment management, beauty services booking"
        url="https://looksnlove.com/user"
      />
    <div className="space-y-8">
      {/* Welcome Section */}
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

      {/* Active Discounts */}
      <DiscountBanner variant="dashboard" />

      {/* Stats */}
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
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Scissors className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{appointment.service}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {appointment.date}
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={appointment.status === "confirmed" ? "default" : "secondary"}
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming appointments
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popular Services */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Popular Services
          </CardTitle>
          <Link to="/user/services">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularServices.map((service) => (
              <div key={service.id} className="group cursor-pointer">
                <div className="aspect-video relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1">
                  <div className="font-medium">{service.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold">${service.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{service.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default UserDashboard;