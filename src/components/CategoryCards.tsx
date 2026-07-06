import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LANGUAGES } from "../data/categories";

export default function CategoryCards() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9">
      {LANGUAGES.map((cat, i) => (
        <motion.button
          key={cat.slug}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.04 }}
          whileHover={{ y: -4 }}
          onClick={() => navigate(`/categories?lang=${cat.slug}`)}
          className={`group relative flex aspect-square flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl bg-gradient-to-br ${cat.gradient} p-2 text-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70`}
        >
          <span className="absolute inset-0 bg-black/20 transition group-hover:bg-black/5" />
          <span className="relative text-2xl">{cat.emoji}</span>
          <span className="relative text-center text-xs font-semibold leading-tight sm:text-sm">
            {cat.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
