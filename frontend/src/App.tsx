import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { PageTransition } from "@/components/ui/page-transition";
import PageSpeedOptimizer from "@/components/seo/PageSpeedOptimizer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Services from "./pages/admin/Services";
import Appointments from "./pages/admin/Appointments";
import CustomerReviews from "./pages/admin/CustomerReviews";
import UserLayout from "./pages/user/UserLayout";
import UserDashboard from "./pages/user/UserDashboard";
import UserServices from "./pages/user/UserServices";
import UserAppointments from "./pages/user/UserAppointments";
import RatingsManagement from "./pages/admin/RatingsManagement";
import ServiceOrdering from "./pages/admin/ServiceOrdering";
import CustomersManagement from "./pages/admin/CustomersManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import DiscountManagement from "./pages/admin/DiscountManagement";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./contexts/AuthContext";
import PhoneVerify from "./pages/PhoneVerify";
import ProtectedRoute from "./contexts/ProtectedRoute";
import { ROLES } from "./models/role";
import Unauthorized from "./pages/UnAuthorized";
import CategoryDetailsPage from "./pages/admin/ServiceDetailPage";
import ServiceDetail from "./pages/ServiceDetail";
import { CartProvider } from "@/contexts/CartContext";
import CartPage from './pages/user/CartPage';
import CategorySection from "@/components/ui/CategorySection";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PageSpeedOptimizer />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="smooth-scroll">
            <CartProvider>
              <AuthProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<PhoneVerify />} />
                  <Route path="/forgot-password" element={<PhoneVerify isForgot={true} />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="/cart" element={
                    <PageTransition>
                      <CartPage />
                    </PageTransition>
                  } />
                  <Route path="/user/cart" element={
                    <PageTransition>
                      <UserLayout>
                        <CartPage />
                      </UserLayout>
                    </PageTransition>
                  } />

                  <Route path="/" element={
                    <PageTransition>
                      <Index />
                    </PageTransition>
                  } />
                  <Route path="/service/:slug" element={
                    <PageTransition>
                      <ServiceDetail />
                    </PageTransition>
                  } />
                  <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
                    <Route path="/user" element={
                      <PageTransition>
                        <UserLayout>
                          <UserDashboard />
                        </UserLayout>
                      </PageTransition>
                    } />
                    
                    <Route path="/user/services" element={
                      <PageTransition>
                        <UserLayout>
                          <UserServices />
                        </UserLayout>
                      </PageTransition>
                    } />
                    <Route path="/user/service/:slug" element={
                      <PageTransition>
                        <UserLayout>
                          <CategorySection categories={[]} />
                        </UserLayout>
                      </PageTransition>
                    } />
                    <Route path="/user/appointments" element={
                      <PageTransition>
                        <UserLayout>
                          <UserAppointments />
                        </UserLayout>
                      </PageTransition>
                    } />

                  </Route>
                  <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                    <Route path="/admin" element={
                      <PageTransition>
                        <AdminLayout>
                          <AdminDashboard />
                        </AdminLayout>
                      </PageTransition>
                    } />
                    <Route path="/admin/services" element={
                      <PageTransition>
                        <AdminLayout>
                          <Services />
                        </AdminLayout>
                      </PageTransition>
                    } />
                    <Route
                      path="/admin/services/:slug"
                      element={
                        <PageTransition>
                          <AdminLayout>
                            <CategoryDetailsPage />
                          </AdminLayout>
                        </PageTransition>
                      }
                    />

                    <Route path="/admin/appointments" element={
                      <PageTransition>
                        <AdminLayout>
                          <Appointments />
                        </AdminLayout>
                      </PageTransition>
                    } />
                    <Route path="/admin/reviews" element={
                      <PageTransition>
                        <AdminLayout>
                          <CustomerReviews />
                        </AdminLayout>
                      </PageTransition>
                    } />
                    <Route path="/admin/ratings" element={
                      <PageTransition>
                        <AdminLayout>
                          <RatingsManagement />
                        </AdminLayout>
                      </PageTransition>
                    } />
                    <Route path="/admin/service-ordering" element={
                      <PageTransition>
                        <AdminLayout>
                          <ServiceOrdering />
                        </AdminLayout>
                      </PageTransition>
                    } />
                    <Route path="/admin/customers" element={
                      <PageTransition>
                        <AdminLayout>
                          <CustomersManagement />
                        </AdminLayout>
                      </PageTransition>
                    } />
                    <Route path="/admin/orders" element={
                      <PageTransition>
                        <AdminLayout>
                          <OrdersManagement />
                        </AdminLayout>
                      </PageTransition>
                    } />
                    <Route path="/admin/discounts" element={
                      <PageTransition>
                        <AdminLayout>
                          <DiscountManagement />
                        </AdminLayout>
                      </PageTransition>
                    } />

                  </Route>

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={
                    <PageTransition>
                      <NotFound />
                    </PageTransition>
                  } />
                </Routes>
              </AuthProvider>
            </CartProvider>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
