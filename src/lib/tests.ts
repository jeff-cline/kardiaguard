// The Kardia Guard heart-screening catalog.
// Content is educational and guideline-informed (USPSTF / AHA / ACC / Medicare).
// Kardia Guard connects knowledge and helps you book — it does not diagnose.
// Screenings are subject to insurance or Medicare approval; some require a provider's order.

export type HeartTest = {
  slug: string;
  name: string;
  short: string;          // short name for chips
  detects: string;
  noninvasive: string;    // "Yes" | "Yes — blood draw" | "Yes — with contrast"
  screeningFit: number;   // 1..5
  sortOrder: number;
  whatItIs: string;
  whenOffered: string;    // where/when it's typically offered
  whyOffered: string;     // why it matters
  whenRoutine: string;    // guideline-based routine timing (age/sex)
  medicare: string;       // Medicare / coverage note
};

export const TESTS: HeartTest[] = [
  {
    slug: "coronary-artery-calcium-cac-ct",
    name: "Coronary Artery Calcium (CAC) CT",
    short: "CAC score",
    detects: "Calcified coronary plaque / future coronary artery disease (CAD) risk",
    noninvasive: "Yes",
    screeningFit: 5,
    sortOrder: 1,
    whatItIs:
      "A fast, low-dose CT scan that measures calcified plaque in the heart's arteries and returns a single number — your calcium score. A higher score means more plaque and higher future risk.",
    whenOffered:
      "At imaging centers and many cardiology and hospital radiology departments. No IV, no contrast, no treadmill — you lie still for a few minutes.",
    whyOffered:
      "It can reclassify your risk when it isn't clear from cholesterol and blood pressure alone — helping you and your provider decide whether a statin or other prevention makes sense.",
    whenRoutine:
      "Most often considered for adults roughly 40–75 at borderline or intermediate cardiovascular risk when the decision to start a statin is uncertain (per ACC/AHA prevention guidance). It is a decision aid, not an every-year test.",
    medicare:
      "Coverage varies; CAC is often out-of-pocket and may not be routinely covered by Medicare or private plans. Confirm cost and whether an order is needed with the facility and your provider.",
  },
  {
    slug: "lipid-panel",
    name: "Lipid panel (cholesterol)",
    short: "Lipid panel",
    detects: "Total cholesterol, LDL, HDL, and triglycerides",
    noninvasive: "Yes — blood draw",
    screeningFit: 5,
    sortOrder: 2,
    whatItIs:
      "A simple blood test that measures the fats in your blood — the cholesterol numbers that drive much of cardiovascular risk.",
    whenOffered:
      "At virtually any lab, clinic, or many pharmacies. Sometimes fasting is requested; your provider will advise.",
    whyOffered:
      "High LDL and triglycerides are among the most modifiable causes of heart disease. Knowing your numbers is the first step to lowering risk.",
    whenRoutine:
      "The USPSTF supports screening men 35+ and women 45+ (and adults 20+ with cardiovascular risk factors). Many clinicians re-check every 4–6 years, or more often if numbers are abnormal or you're on treatment.",
    medicare:
      "Medicare Part B covers a cardiovascular screening blood test (including cholesterol) once every 5 years. Additional testing may apply a cost-share. Confirm with your provider.",
  },
  {
    slug: "blood-pressure-screening",
    name: "Blood pressure screening",
    short: "Blood pressure",
    detects: "Hypertension (high blood pressure)",
    noninvasive: "Yes",
    screeningFit: 5,
    sortOrder: 3,
    whatItIs:
      "A quick cuff measurement — in a clinic, pharmacy, or with a validated home monitor — of the pressure in your arteries.",
    whenOffered:
      "Everywhere: clinics, pharmacies, and at home. Confirming a diagnosis often uses repeated or home/ambulatory readings.",
    whyOffered:
      "High blood pressure usually has no symptoms but is a leading driver of heart attack, stroke, and kidney disease — and it's very treatable once found.",
    whenRoutine:
      "The USPSTF recommends screening every year for adults 40+ (and those at higher risk), and every 3–5 years for lower-risk adults 18–39 with a prior normal reading.",
    medicare:
      "Blood pressure checks are a routine part of covered visits; home monitoring may be covered in specific situations. Confirm with your provider.",
  },
  {
    slug: "a1c-glucose",
    name: "A1C / glucose",
    short: "A1C / glucose",
    detects: "Diabetes and prediabetes — a major cardiovascular risk driver",
    noninvasive: "Yes — blood draw",
    screeningFit: 5,
    sortOrder: 4,
    whatItIs:
      "Blood tests that measure your blood sugar now (glucose) and your average over ~3 months (A1C).",
    whenOffered: "At any lab or clinic; A1C does not require fasting.",
    whyOffered:
      "Diabetes dramatically raises heart and vascular risk. Catching prediabetes early opens the door to reversing course.",
    whenRoutine:
      "The USPSTF supports screening adults 35–70 who are overweight or obese, repeating about every 3 years if normal. Your provider may screen earlier or more often based on risk.",
    medicare:
      "Medicare covers diabetes screening tests (typically up to twice a year) for people at risk. Confirm eligibility with your provider.",
  },
  {
    slug: "hs-crp",
    name: "hs-CRP (high-sensitivity C-reactive protein)",
    short: "hs-CRP",
    detects: "Inflammation associated with cardiovascular risk",
    noninvasive: "Yes — blood draw",
    screeningFit: 4,
    sortOrder: 5,
    whatItIs:
      "A blood test for low-grade inflammation, which is linked to atherosclerosis and cardiovascular events.",
    whenOffered: "At labs and clinics as an add-on to routine bloodwork.",
    whyOffered:
      "When risk is borderline, hs-CRP can add information that helps refine the decision to treat.",
    whenRoutine:
      "Used selectively as a risk-refiner — not a universal yearly test. Most useful in adults at intermediate risk when the treatment decision is unclear.",
    medicare:
      "Coverage depends on medical necessity and indication. Confirm with your provider before testing.",
  },
  {
    slug: "lipoprotein-a-lp-a",
    name: "Lipoprotein(a) / Lp(a)",
    short: "Lp(a)",
    detects: "Inherited cardiovascular risk",
    noninvasive: "Yes — blood draw",
    screeningFit: 4,
    sortOrder: 6,
    whatItIs:
      "A blood test for a mostly genetic particle. Elevated Lp(a) raises cardiovascular risk independently of standard cholesterol.",
    whenOffered: "At labs and clinics; a single lifetime measurement is often enough.",
    whyOffered:
      "Because it's inherited, a high Lp(a) can explain risk in people with a strong family history — and flag relatives who should check too.",
    whenRoutine:
      "Increasingly recommended at least once in a lifetime, especially with a personal or family history of early heart disease. Discuss with your provider.",
    medicare:
      "Coverage varies by indication. Confirm cost and necessity with your provider.",
  },
  {
    slug: "apolipoprotein-b-apob",
    name: "Apolipoprotein B / ApoB",
    short: "ApoB",
    detects: "Atherogenic particle burden",
    noninvasive: "Yes — blood draw",
    screeningFit: 4,
    sortOrder: 7,
    whatItIs:
      "A blood test that counts the actual number of cholesterol-carrying particles that can lodge in artery walls — sometimes a more precise risk marker than LDL alone.",
    whenOffered: "At labs and clinics as part of an advanced lipid assessment.",
    whyOffered:
      "ApoB can reveal risk that LDL misses, particularly with diabetes, high triglycerides, or metabolic syndrome.",
    whenRoutine:
      "Used selectively to refine risk and guide therapy, often alongside or instead of a standard lipid panel when numbers are discordant.",
    medicare:
      "Coverage depends on indication. Confirm with your provider.",
  },
  {
    slug: "ankle-brachial-index-abi",
    name: "Ankle-Brachial Index (ABI)",
    short: "ABI",
    detects: "Peripheral artery disease (PAD)",
    noninvasive: "Yes",
    screeningFit: 4,
    sortOrder: 8,
    whatItIs:
      "A painless comparison of blood pressure at your ankle versus your arm, using cuffs and a small probe, to detect narrowed leg arteries.",
    whenOffered: "At clinics, vascular labs, and many cardiology practices.",
    whyOffered:
      "PAD signals widespread atherosclerosis and higher heart-attack and stroke risk — and it's frequently silent.",
    whenRoutine:
      "Considered for people with leg symptoms or higher vascular risk (older age, smoking, diabetes). Not a universal screen for everyone.",
    medicare:
      "Often covered when medically indicated (symptoms or risk factors). Confirm with your provider.",
  },
  {
    slug: "abdominal-aortic-aneurysm-ultrasound",
    name: "Abdominal Aortic Aneurysm (AAA) ultrasound",
    short: "AAA ultrasound",
    detects: "Abdominal aortic aneurysm",
    noninvasive: "Yes",
    screeningFit: 4,
    sortOrder: 9,
    whatItIs:
      "A quick, painless ultrasound of the aorta in your abdomen to check for a bulge (aneurysm) that could be dangerous if it grows.",
    whenOffered: "At imaging centers, vascular labs, and many primary-care referrals.",
    whyOffered:
      "An aneurysm is usually silent until it's an emergency. A one-time scan can catch it while it's still safe to watch or treat.",
    whenRoutine:
      "The USPSTF recommends a one-time ultrasound for men 65–75 who have ever smoked, and selective screening for other men 65–75. Discuss with your provider.",
    medicare:
      "Medicare covers a one-time AAA screening ultrasound for eligible beneficiaries at risk (referral required). Confirm eligibility with your provider.",
  },
  {
    slug: "carotid-ultrasound",
    name: "Carotid ultrasound",
    short: "Carotid US",
    detects: "Carotid plaque / stenosis (stroke risk)",
    noninvasive: "Yes",
    screeningFit: 3,
    sortOrder: 10,
    whatItIs:
      "An ultrasound of the neck arteries that supply the brain, looking for plaque or narrowing.",
    whenOffered: "At vascular labs, imaging centers, and cardiology practices.",
    whyOffered:
      "Significant narrowing can raise stroke risk and may change prevention decisions.",
    whenRoutine:
      "Generally reserved for people with symptoms or specific risk factors rather than routine screening of everyone. Discuss appropriateness with your provider.",
    medicare:
      "Usually covered when medically indicated. Confirm with your provider.",
  },
  {
    slug: "resting-ecg-ekg",
    name: "Resting ECG / EKG",
    short: "ECG/EKG",
    detects: "Heart rhythm and electrical abnormalities",
    noninvasive: "Yes",
    screeningFit: 3,
    sortOrder: 11,
    whatItIs:
      "A few-minute recording of your heart's electrical activity through stickers on the skin — no needles.",
    whenOffered: "At almost any clinic, urgent care, or cardiology office.",
    whyOffered:
      "It can reveal rhythm problems (like atrial fibrillation), evidence of a prior event, or conduction issues.",
    whenRoutine:
      "Not recommended as a routine screen for symptom-free, low-risk adults, but commonly used when there are symptoms, risk factors, or a baseline is needed.",
    medicare:
      "Covered as part of the one-time 'Welcome to Medicare' visit and when medically indicated. Confirm with your provider.",
  },
  {
    slug: "echocardiogram",
    name: "Echocardiogram",
    short: "Echo",
    detects: "Heart structure, valves, and pumping function",
    noninvasive: "Yes",
    screeningFit: 3,
    sortOrder: 12,
    whatItIs:
      "An ultrasound of the heart that shows the chambers, valves, and how well the heart pumps — no radiation.",
    whenOffered: "At cardiology practices, imaging centers, and hospitals.",
    whyOffered:
      "It's the go-to test for evaluating murmurs, heart failure, valve disease, and structural problems.",
    whenRoutine:
      "Ordered based on symptoms or findings rather than as a universal screen. Your provider decides when it adds value.",
    medicare:
      "Covered when medically indicated. Confirm with your provider.",
  },
  {
    slug: "exercise-stress-test",
    name: "Exercise stress test",
    short: "Stress test",
    detects: "Ischemia / rhythm abnormalities under exertion",
    noninvasive: "Yes",
    screeningFit: 2,
    sortOrder: 13,
    whatItIs:
      "You walk on a treadmill (or receive a medication) while your heart's rhythm and response are monitored, to see how it behaves under stress.",
    whenOffered: "At cardiology practices and hospital cardiac units.",
    whyOffered:
      "Useful for evaluating exertional symptoms like chest pain or breathlessness, and for guiding further testing.",
    whenRoutine:
      "Not recommended for routine screening of symptom-free, low-risk adults; used when symptoms or risk warrant it.",
    medicare:
      "Covered when medically indicated. Confirm with your provider.",
  },
  {
    slug: "ct-coronary-angiography-ccta",
    name: "CT coronary angiography (CCTA)",
    short: "CCTA",
    detects: "Narrowing and soft plaque in the coronary arteries",
    noninvasive: "Yes — with contrast",
    screeningFit: 3,
    sortOrder: 14,
    whatItIs:
      "A contrast-enhanced CT that produces detailed images of the coronary arteries themselves — showing narrowing and non-calcified (soft) plaque a calcium score can't.",
    whenOffered: "At advanced imaging centers and cardiology/hospital radiology departments.",
    whyOffered:
      "It's increasingly used to evaluate chest pain and to characterize plaque when more detail is needed than a calcium score provides.",
    whenRoutine:
      "Typically used for evaluation of symptoms or specific risk questions rather than routine screening. Your provider determines when it's appropriate.",
    medicare:
      "Coverage depends on indication and setting. Confirm cost and necessity with your provider.",
  },
];

export const testBySlug = (slug: string) => TESTS.find((t) => t.slug === slug);
export const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);
