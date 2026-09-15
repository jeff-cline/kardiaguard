// Kardia Guard — genetic testing catalog.
// Genetic testing is a complete feature: members request a test, which routes
// to a partner lab (usually mail-order — a swab kit is sent, you send it back).
// Content is educational. Genetic tests generally REQUIRE a provider's order /
// prescription and are subject to insurance or Medicare approval — always check
// with your provider.

export type GeneticTest = {
  slug: string;
  name: string;
  category: "Cardiac" | "Lipids" | "Pharmacogenomics" | "Hereditary Cancer";
  short: string;
  detects: string;
  sortOrder: number;
  whatItIs: string;
  whoFor: string;      // who should consider it
  howItWorks: string;  // mail-order swab flow
  guidance: string;    // guideline / AHA note
  requiresOrder: boolean;
};

export const GENETIC_TESTS: GeneticTest[] = [
  {
    slug: "inherited-cardiovascular-cgx",
    name: "Inherited Cardiovascular Genetic Testing (CGx)",
    category: "Cardiac",
    short: "Cardiac genetics (CGx)",
    detects: "Inherited heart conditions — cardiomyopathies, inherited arrhythmias, and genetic causes of sudden cardiac death",
    sortOrder: 1,
    whatItIs:
      "A panel that looks for gene changes linked to inherited heart disease — conditions like hypertrophic and dilated cardiomyopathy, long QT and other inherited arrhythmias, and genetic causes of unexplained sudden death.",
    whoFor:
      "People with a personal or family history of early or unexplained heart disease, cardiomyopathy, fainting spells, or sudden death in a relative — and their close family members, who may share the same risk.",
    howItWorks:
      "Most testing is mail-order: the lab sends a simple cheek-swab or saliva kit to your door, you collect the sample and mail it back in the prepaid envelope, and results go to the ordering provider.",
    guidance:
      "The American Heart Association has issued scientific statements supporting genetic testing for inherited cardiovascular disease in appropriate patients, ideally alongside genetic counseling. It can confirm a diagnosis and, importantly, identify at-risk relatives.",
    requiresOrder: true,
  },
  {
    slug: "familial-hypercholesterolemia-fh",
    name: "Familial Hypercholesterolemia (FH) Genetic Testing",
    category: "Lipids",
    short: "FH genetics",
    detects: "Inherited very-high LDL cholesterol (familial hypercholesterolemia)",
    sortOrder: 2,
    whatItIs:
      "A test for the gene changes that cause FH — an inherited condition that keeps LDL (“bad”) cholesterol very high from birth and sharply raises the risk of early heart disease if untreated.",
    whoFor:
      "Adults or children with very high LDL, a personal or family history of early heart attacks, or a known family FH mutation. Finding it early means it's highly treatable.",
    howItWorks:
      "Typically a mail-order saliva or cheek-swab kit sent to your home; you return it by prepaid mail and results go to your provider, who can guide treatment and family testing.",
    guidance:
      "FH is one of the most common inherited conditions and is under-diagnosed. Identifying it lets providers treat aggressively and screen relatives (cascade testing), per lipid and cardiovascular guidance.",
    requiresOrder: true,
  },
  {
    slug: "cardiac-pharmacogenomics-pgx",
    name: "Cardiac Pharmacogenomics (PGx)",
    category: "Pharmacogenomics",
    short: "Pharmacogenomics (PGx)",
    detects: "How your genes affect the safety and effectiveness of common medications",
    sortOrder: 3,
    whatItIs:
      "A test that reads gene variants affecting how you process certain medications — including some blood thinners, statins, and other cardiovascular drugs — so treatment can be tailored to you.",
    whoFor:
      "People starting or struggling with cardiovascular or other medications, those with side effects, or anyone whose provider wants to personalize prescribing.",
    howItWorks:
      "Usually mail-order: a cheek-swab or saliva kit arrives at your home, you send it back prepaid, and the report goes to your prescriber to inform drug and dose choices.",
    guidance:
      "Pharmacogenetic associations exist for a number of medications where genotype can affect safety or response. Results support — but never replace — your prescriber's judgment.",
    requiresOrder: true,
  },
  {
    slug: "hereditary-cancer-brca",
    name: "Hereditary Cancer Panel (incl. BRCA1 / BRCA2)",
    category: "Hereditary Cancer",
    short: "Hereditary cancer / BRCA",
    detects: "Inherited risk for breast, ovarian, and other cancers (BRCA1, BRCA2 and related genes)",
    sortOrder: 4,
    whatItIs:
      "A panel for inherited gene changes — including BRCA1 and BRCA2 — that raise the risk of breast, ovarian, and several other cancers. Whole-person heart health includes knowing your inherited cancer risk.",
    whoFor:
      "People with a personal or strong family history of breast, ovarian, prostate, pancreatic, or related cancers — often guided by professional criteria your provider follows.",
    howItWorks:
      "Commonly mail-order: the lab ships a saliva or cheek-swab kit to your home; you return it prepaid, and results go to your provider or a genetic counselor to plan screening and prevention.",
    guidance:
      "Professional guidelines define who should consider hereditary-cancer testing and genetic counseling. Results can change screening, prevention, and family testing decisions.",
    requiresOrder: true,
  },
];

export const geneticBySlug = (slug: string) => GENETIC_TESTS.find((t) => t.slug === slug);
