/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: "#FF9933",
          400: "#ffab52",
          500: "#FF9933",
          600: "#f57c1f",
        },
        indiagreen: {
          DEFAULT: "#138808",
          400: "#1aa30a",
          500: "#138808",
        },
        navy: {
          DEFAULT: "#000080",
          400: "#1a1acc",
        },
        ink: {
          900: "#0a0a12",
          800: "#12121f",
          700: "#1b1b2e",
        },
      },
      fontFamily: {
        display: ["Poppins", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "tiranga":
          "linear-gradient(135deg, #FF9933 0%, #ffffff 50%, #138808 100%)",
        "aurora":
          "radial-gradient(1200px 600px at 10% 10%, rgba(255,153,51,0.25), transparent 60%), radial-gradient(1000px 500px at 90% 20%, rgba(19,136,8,0.22), transparent 60%), radial-gradient(900px 700px at 50% 100%, rgba(0,0,128,0.3), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(255,153,51,0.6)",
        glass: "0 8px 32px rgba(0,0,0,0.37)",
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "80%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        equalize: {
          "0%, 100%": { height: "20%" },
          "50%": { height: "100%" },
        },
      },
      animation: {
        pulseRing: "pulseRing 1.8s cubic-bezier(0.215,0.61,0.355,1) infinite",
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
        equalize: "equalize 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
