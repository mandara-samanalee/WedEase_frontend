import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
      lxl: '1652px'
    },
    extend: {
      colors: {
        background: {
          white: "#ffffff",
          black: "#000000",
        },
        purple: {
        /*  "50": "#f2eaf0",
          "100": "#e5d4e1",
          "200": "#caa9c4",
          "300": "#b07ea6",
          "400": "#955389",
          "500": "#7b286b",
          "600": "#622056",
          "700": "#4a1840",
          "800": "#31102b",
          "900": "#190815"  */
           /* "50": "#efeaf2",
          "100": "#e0d4e5",
          "150": "#D0C5ED",
          "200": "#c0a9ca",
          "300": "#a17eb0",
          "400": "#815395",
          "500": "#62287b",
          "600": "#4e2062",
          "700": "#3b184a",
          "800": "#271031",
          "900": "#140819"  */
         "50": "#f6ecf1",
        "100": "#edd8e3",
        "200": "#dab1c6",
        "300": "#c88aaa",
        "350": "#c43e83",
        "400": "#b5638d",
        "500": "#a33c71",
        "600": "#82305a",
        "700": "#622444",
        "800": "#41182d",
        "900": "#210c17" 	 
        }
      },
    }, 
  },
  plugins: [],
} satisfies Config;
