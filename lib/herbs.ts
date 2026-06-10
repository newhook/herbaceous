// Rule-based herb recommendation engine.
// Maps food preferences (and optional free-text notes) to garden herbs.
// Pure & dependency-free so it can run on the server or in the browser.

export type Herb = {
  name: string;
  emoji: string;
  blurb: string; // what it's good for in the garden / kitchen
};

export type FoodOption = {
  id: string;
  label: string;
  emoji: string;
};

// The food likes a user can pick from on the dashboard.
export const FOOD_OPTIONS: FoodOption[] = [
  { id: "italian", label: "Italian & pasta", emoji: "🍝" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "mexican", label: "Mexican & tacos", emoji: "🌮" },
  { id: "asian", label: "Thai & SE-Asian", emoji: "🍜" },
  { id: "indian", label: "Indian & curry", emoji: "🍛" },
  { id: "bbq", label: "Grilled meat & BBQ", emoji: "🍖" },
  { id: "seafood", label: "Fish & seafood", emoji: "🐟" },
  { id: "salads", label: "Fresh salads", emoji: "🥗" },
  { id: "soups", label: "Soups & stews", emoji: "🍲" },
  { id: "tea", label: "Tea & infusions", emoji: "🍵" },
  { id: "cocktails", label: "Cocktails", emoji: "🍹" },
  { id: "baking", label: "Desserts & baking", emoji: "🧁" },
  { id: "breakfast", label: "Eggs & breakfast", emoji: "🍳" },
  { id: "spicy", label: "Spicy food", emoji: "🌶️" },
  { id: "mediterranean", label: "Mediterranean", emoji: "🫒" },
];

// Canonical herb definitions.
const HERBS: Record<string, Herb> = {
  basil: { name: "Basil", emoji: "🌿", blurb: "Sweet aromatic leaves — the backbone of pesto, caprese & tomato sauces." },
  oregano: { name: "Oregano", emoji: "🌿", blurb: "Pungent and warm — essential on pizza and in red sauces." },
  rosemary: { name: "Rosemary", emoji: "🌲", blurb: "Piney and robust — perfect with roasted and grilled meats." },
  thyme: { name: "Thyme", emoji: "🌿", blurb: "Earthy all-rounder for stews, roasts and slow-cooked dishes." },
  cilantro: { name: "Cilantro / Coriander", emoji: "🌱", blurb: "Bright citrusy leaves for salsa, curries and noodle bowls." },
  mint: { name: "Mint", emoji: "🍃", blurb: "Cooling and vigorous — teas, mojitos, salads and desserts." },
  parsley: { name: "Parsley", emoji: "🌿", blurb: "Clean, fresh finishing herb for almost any savory dish." },
  chives: { name: "Chives", emoji: "🧅", blurb: "Mild oniony bite — eggs, potatoes and creamy dips." },
  dill: { name: "Dill", emoji: "🌾", blurb: "Feathery and tangy — a classic partner for fish and pickles." },
  sage: { name: "Sage", emoji: "🍂", blurb: "Velvety and savory — browned butter, stuffing and pork." },
  chamomile: { name: "Chamomile", emoji: "🌼", blurb: "Soothing daisy-like flowers for calming bedtime infusions." },
  lemongrass: { name: "Lemongrass", emoji: "🪴", blurb: "Lemony stalks that define Thai curries, soups and teas." },
  thai_basil: { name: "Thai Basil", emoji: "🌿", blurb: "Anise-scented basil for stir-fries and pho." },
  tarragon: { name: "Tarragon", emoji: "🌿", blurb: "Delicate anise notes — chicken, eggs and béarnaise." },
  lavender: { name: "Lavender", emoji: "💜", blurb: "Floral and sweet — shortbread, syrups and relaxing teas." },
  fennel: { name: "Fennel", emoji: "🌾", blurb: "Sweet anise fronds & seeds for fish, sausage and salads." },
  marjoram: { name: "Marjoram", emoji: "🌿", blurb: "Gentle, sweeter cousin of oregano for Mediterranean fare." },
};

// food id -> herb keys it suggests.
const RULES: Record<string, string[]> = {
  italian: ["basil", "oregano", "parsley", "marjoram"],
  pizza: ["oregano", "basil", "marjoram"],
  mexican: ["cilantro", "oregano"],
  asian: ["thai_basil", "cilantro", "lemongrass", "mint"],
  indian: ["cilantro", "mint", "lemongrass"],
  bbq: ["rosemary", "thyme", "sage"],
  seafood: ["dill", "parsley", "fennel", "tarragon"],
  salads: ["parsley", "mint", "dill", "chives"],
  soups: ["thyme", "parsley", "sage", "marjoram"],
  tea: ["mint", "chamomile", "lavender", "lemongrass"],
  cocktails: ["mint", "rosemary", "lavender"],
  baking: ["lavender", "mint", "rosemary"],
  breakfast: ["chives", "parsley", "dill", "tarragon"],
  spicy: ["cilantro", "thai_basil", "mint"],
  mediterranean: ["rosemary", "thyme", "oregano", "marjoram", "fennel"],
};

// Keyword matching for the optional free-text box.
const KEYWORD_RULES: { keywords: string[]; herbs: string[] }[] = [
  { keywords: ["tomato", "pasta", "marinara", "caprese", "pesto"], herbs: ["basil", "oregano"] },
  { keywords: ["taco", "salsa", "guac", "burrito", "mexican"], herbs: ["cilantro"] },
  { keywords: ["thai", "pho", "stir fry", "stir-fry", "noodle", "ramen"], herbs: ["thai_basil", "lemongrass", "cilantro"] },
  { keywords: ["curry", "indian", "tikka", "masala"], herbs: ["cilantro", "mint"] },
  { keywords: ["steak", "lamb", "roast", "grill", "bbq", "barbecue"], herbs: ["rosemary", "thyme"] },
  { keywords: ["fish", "salmon", "shrimp", "seafood", "sushi"], herbs: ["dill", "fennel", "parsley"] },
  { keywords: ["tea", "infusion", "relax", "sleep", "calm"], herbs: ["chamomile", "mint", "lavender"] },
  { keywords: ["cocktail", "mojito", "gin", "drink"], herbs: ["mint", "rosemary"] },
  { keywords: ["egg", "omelet", "omelette", "breakfast", "potato"], herbs: ["chives", "parsley"] },
  { keywords: ["spicy", "chili", "chilli", "hot"], herbs: ["cilantro", "thai_basil"] },
  { keywords: ["dessert", "cake", "cookie", "bake", "sweet"], herbs: ["lavender", "mint"] },
];

export type Recommendation = Herb & { score: number };

/**
 * Recommend herbs from selected food option ids plus optional free text.
 * Returns herbs ordered by how many of the user's likes point to them.
 */
export function recommendHerbs(selectedFoodIds: string[], freeText = ""): Recommendation[] {
  const scores = new Map<string, number>();

  const bump = (key: string, by = 1) => {
    scores.set(key, (scores.get(key) ?? 0) + by);
  };

  for (const id of selectedFoodIds) {
    for (const herbKey of RULES[id] ?? []) bump(herbKey);
  }

  const text = freeText.toLowerCase();
  if (text.trim()) {
    for (const rule of KEYWORD_RULES) {
      if (rule.keywords.some((k) => text.includes(k))) {
        for (const herbKey of rule.herbs) bump(herbKey);
      }
    }
  }

  return [...scores.entries()]
    .map(([key, score]) => ({ ...HERBS[key], score }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}
