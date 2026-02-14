import { motion } from "framer-motion";
import { services } from "@/data";
import { useTranslation } from "react-i18next";

const ServicesSection = () => {
  const { t } = useTranslation();
  return (
    <section id="services" className="py-24 px-6 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-mono text-neon-purple uppercase tracking-wider">
            <span className="w-8 h-px bg-neon-purple/50" />
            {t("sections.services")}
            <span className="w-8 h-px bg-neon-purple/50" />
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 gradient-text">{t("services.heading")}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-3d"
              >
                <div className="card-3d-inner p-8 rounded-2xl glass neon-border group holo-shine">
                  <div className="w-14 h-14 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple mb-6 group-hover:scale-110 group-hover:neon-glow-purple transition-all">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
