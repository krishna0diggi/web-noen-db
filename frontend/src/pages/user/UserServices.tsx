import CategorySection from "@/components/ui/CategorySection";
import SEOHead from "@/components/seo/SEOHead";
import { useEffect, useState } from "react";
import { getCategories } from "@/service/adminService/adminService";

const UserServices = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setCategories([]);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  return (
    <>
      <SEOHead
        title="Beauty Services - Book Premium Ladies Salon Treatments | LooksNLove"
        description="Explore LooksNLove's comprehensive range of beauty services including professional hair styling, nail care, facial treatments, and spa services. Book your appointment with expert female stylists for premium beauty treatments."
        keywords="beauty services NYC, ladies salon services, hair styling services, nail care Manhattan, facial treatments, spa services, beauty appointments, professional styling, women beauty treatments"
        url="https://looksnlove.com/user/services"
      />
      <CategorySection categories={categories} loading={loading} />
    </>
  );
};

export default UserServices;