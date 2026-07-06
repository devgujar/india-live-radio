import { AnimatePresence, motion } from "framer-motion";
import { Radio } from "lucide-react";
import type { Station } from "../types";
import StationCard from "./StationCard";

interface Props {
  stations: Station[];
  emptyMessage?: string;
}

export default function StationGrid({
  stations,
  emptyMessage = "No stations found. Try a different search or filter.",
}: Props) {
  if (stations.length === 0) {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center text-white/60">
        <Radio className="h-10 w-10 text-white/30" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <AnimatePresence mode="popLayout">
        {stations.map((station, i) => (
          <StationCard key={station.id} station={station} index={i} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
