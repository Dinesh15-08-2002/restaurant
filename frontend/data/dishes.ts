export interface SignatureDish {
  id: string;
  name: string;
  tagline: string;
  description: string;
  accentHue: string;
  gradientClass: string;
}

export const SIGNATURE_DISHES: SignatureDish[] = [
  {
    id: "signature-1",
    name: "Awadhi Dum Biryani [Placeholder]",
    tagline: "Slow-cooked saffron basmati & royal whole-spice aromatics",
    description:
      "Prepared in sealed earthen handis over dying embers, unlocking layers of Kashmiri saffron, kewra, and fragrant spices.",
    accentHue: "text-amber-400",
    gradientClass:
      "bg-gradient-to-br from-amber-900/40 via-surface-elevated to-surface border-amber-800/30",
  },
  {
    id: "signature-2",
    name: "Smoked Tandoori Chaap [Placeholder]",
    tagline: "Clay-oven roasted soya skewers in spiced velvet cream",
    description:
      "Kissed by natural hardwood smoke in our authentic clay tandoor, garnished with pickled onions and fresh coriander.",
    accentHue: "text-orange-400",
    gradientClass:
      "bg-gradient-to-br from-orange-900/40 via-surface-elevated to-surface border-orange-800/30",
  },
  {
    id: "signature-3",
    name: "Slow-Simmered Dal Velvet [Placeholder]",
    tagline: "24-hour slow-cooked black lentils & churned butter",
    description:
      "Simmered continuously over gentle charcoal heat with ripe tomatoes and ginger juliennes for an unmatched creamy finish.",
    accentHue: "text-yellow-400",
    gradientClass:
      "bg-gradient-to-br from-yellow-900/30 via-surface-elevated to-surface border-yellow-800/30",
  },
];

