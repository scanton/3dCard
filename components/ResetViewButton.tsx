"use client";

import { motion } from "framer-motion";
import { useCardStore } from "@/lib/useCardStore";

const ResetViewButton = () => {
  const resetView = useCardStore((state) => state.resetView);

  return (
    <motion.button
      type="button"
      onClick={() => resetView()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: "linear-gradient(135deg, #5865f2, #7f5af0)",
        border: "none",
        color: "#f8f9ff",
        padding: "0.6rem 1.2rem",
        borderRadius: "0.75rem",
        fontSize: "0.9rem",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 8px 20px rgba(94, 109, 255, 0.35)",
        letterSpacing: "0.02em",
      }}
    >
      Reset View
    </motion.button>
  );
};

export default ResetViewButton;
