import "server-only";
import { db } from "./db";

export type RoutedLab = {
  id: string;
  name: string;
  fulfillment: string;
  requestUrl: string;
  phone: string;
  city: string;
  state: string;
};

// Find the best lab that offers `testSlug` and can serve someone in `state`.
// Preference: in-person in that state > mail-order for that state > nationwide mail-order.
export async function routeGeneticLab(testSlug: string, state: string): Promise<RoutedLab | null> {
  const test = await db.geneticTest.findUnique({ where: { slug: testSlug } });
  if (!test) return null;
  const labs = await db.geneticLab.findMany({
    where: { active: true, tests: { some: { testId: test.id } } },
  });
  const st = (state || "").trim().toUpperCase();

  const covers = (l: (typeof labs)[number]) => {
    if (l.fulfillment === "mail_nationwide") return true;
    if (l.fulfillment === "mail_by_state")
      return l.coverageStates.split(/[\s,]+/).map((s) => s.trim().toUpperCase()).filter(Boolean).includes(st);
    if (l.fulfillment === "in_person") return l.state.trim().toUpperCase() === st;
    return false;
  };
  const rank = (l: (typeof labs)[number]) =>
    l.fulfillment === "in_person" ? 0 : l.fulfillment === "mail_by_state" ? 1 : 2;

  const eligible = labs.filter(covers).sort((a, b) => rank(a) - rank(b));
  const pick = eligible[0] || labs.find((l) => l.fulfillment === "mail_nationwide") || null;
  if (!pick) return null;
  return { id: pick.id, name: pick.name, fulfillment: pick.fulfillment, requestUrl: pick.requestUrl, phone: pick.phone, city: pick.city, state: pick.state };
}
