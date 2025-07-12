import { Scissors, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="bg-card border-t border-border py-16 px-2 sm:px-4">
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">LooksNLove</span>
          </div>
          <p className="text-muted-foreground">
            Your premier destination for beauty and wellness treatments.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2">
            <a href="/user/services" className="block text-muted-foreground hover:text-primary transition-colors">Services</a>
            <a href="/user" className="block text-muted-foreground hover:text-primary transition-colors">Book Appointment</a>
            <a href="/user/appointments" className="block text-muted-foreground hover:text-primary transition-colors">My Appointments</a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <div className="space-y-2">
            <p className="text-muted-foreground">Hair Styling</p>
            <p className="text-muted-foreground">Facial Treatments</p>
            <p className="text-muted-foreground">Nail Care</p>
            <p className="text-muted-foreground">Bridal Packages</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Contact Info</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground text-sm">123 Beauty Street, City</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground text-sm">info@salonbeauty.com</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-12 pt-8 text-center">
        <p className="text-muted-foreground">
          © 2024 LooksNLove. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
