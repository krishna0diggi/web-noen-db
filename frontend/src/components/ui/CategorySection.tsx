import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import React from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface CategorySectionProps {
  categories: any[];
  loading?: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories, loading = false }) => {
  const navigate = useNavigate();
  if (loading) {
    return <LoadingSpinner className="py-20" />;
  }
  return (
    <section id="services" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-card/30">
      <div className="w-full max-w-screen-lg mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Popular Services</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2 sm:px-4">
            Click a category to discover all services and offers for you
          </p>
        </motion.div>
        <div className="w-full px-2 sm:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <AnimatePresence>
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -8, scale: 1.03, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
                >
                  <Card
                    className="group cursor-pointer border-2 border-transparent hover:border-primary transition-all duration-300 h-full bg-card/90 hover:bg-primary/10 shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden ring-1 ring-border/40 dark:ring-border/60 flex flex-col items-center justify-start"
                    onClick={() =>
                      navigate(`/service/${cat.slug}`, {
                        state: { id: cat.id },
                      })
                    }
                  >
                    <CardContent className="flex flex-col items-center justify-start h-full w-full pt-8 pb-6 px-4">
                      {/* Category Circle with GIF */}
                      <motion.div
                        className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors shadow-md overflow-hidden border-2 border-primary/30"
                        whileHover={{ scale: 1.1, rotate: 8 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {cat.gifUrl ? (
                          <img
                            src={cat.gifUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-4xl select-none">{cat.emoji || "✨"}</span>
                        )}
                      </motion.div>
                      {/* Title and Description below the circle */}
                      <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors text-foreground drop-shadow-sm text-center">
                        {cat.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-2 text-center">
                        {cat.description}
                      </p>
                      <Button
                        variant="outline"
                        className="mt-2 w-full group-hover:bg-primary group-hover:text-white transition-colors shadow-sm hover:scale-[1.03]"
                      >
                        Explore Services
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
