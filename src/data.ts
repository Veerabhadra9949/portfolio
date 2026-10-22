export type Project = {
  number: string;
  name: string;
  type: string;
  year: string;
  description: string;
  image: string;
  imageAlt: string;
  accent: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    number: "01",
    name: "KINFIELD",
    type: "Digital product · Concept",
    year: "2025",
    description:
      "A calmer way to care for your money. Kinfield makes everyday finances feel clear, considered, and a little more human.",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Colorful abstract shapes arranged as a tactile product design",
    accent: "lime",
    tags: ["Product design", "React", "Fintech"],
  },
  {
    number: "02",
    name: "STILL / FORM",
    type: "E-commerce · Concept",
    year: "2025",
    description:
      "An editorial storefront for objects made to last, bringing thoughtful product storytelling to a slower kind of shopping.",
    image:
      "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Sculptural ceramic objects displayed in a warm, minimal interior",
    accent: "peach",
    tags: ["E-commerce", "Art direction", "Shopify"],
  },
  {
    number: "03",
    name: "OTHERSPACE",
    type: "Creative technology · Concept",
    year: "2024",
    description:
      "A playful digital home for curious minds, connecting a community through ideas, experiments, and things worth sharing.",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Immersive installation with glowing colored lights",
    accent: "blue",
    tags: ["Creative code", "WebGL", "Community"],
  },
];
