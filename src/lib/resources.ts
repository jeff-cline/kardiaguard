// Heart-healthy resources — curated, authoritative links shown in the member
// back office. Educational only.

export type Resource = { title: string; desc: string; url: string; category: string };

export const RESOURCES: Resource[] = [
  { category: "The basics", title: "Life's Essential 8", desc: "The American Heart Association's 8 habits that most protect your heart.", url: "https://www.heart.org/en/healthy-living/healthy-lifestyle/lifes-essential-8" },
  { category: "The basics", title: "Know your numbers", desc: "Blood pressure, cholesterol, blood sugar, and weight — what the targets mean.", url: "https://www.heart.org/en/health-topics/heart-attack/understand-your-risks-to-prevent-a-heart-attack" },
  { category: "Nutrition", title: "Heart-healthy eating", desc: "Simple, sustainable ways to eat for your heart — no fad diets.", url: "https://www.heart.org/en/healthy-living/healthy-eating" },
  { category: "Nutrition", title: "The DASH eating plan", desc: "The eating pattern shown to help lower blood pressure (NIH / NHLBI).", url: "https://www.nhlbi.nih.gov/education/dash-eating-plan" },
  { category: "Blood pressure", title: "Manage high blood pressure", desc: "Practical steps to bring numbers down and keep them there (AHA).", url: "https://www.heart.org/en/health-topics/high-blood-pressure" },
  { category: "Cholesterol", title: "Understanding cholesterol", desc: "LDL, HDL, and what to do about your numbers (AHA).", url: "https://www.heart.org/en/health-topics/cholesterol" },
  { category: "Movement", title: "Move more, sit less", desc: "How much activity actually helps — and how to fit it in (AHA).", url: "https://www.heart.org/en/healthy-living/fitness" },
  { category: "Stress & sleep", title: "Stress and your heart", desc: "How stress affects the heart and simple ways to manage it (AHA).", url: "https://www.heart.org/en/healthy-living/healthy-lifestyle/stress-management" },
  { category: "Quit smoking", title: "Quit tobacco", desc: "Free tools and a quitline to stop — one of the best things for your heart (CDC).", url: "https://www.cdc.gov/tobacco/campaign/tips/quit-smoking/index.html" },
];
