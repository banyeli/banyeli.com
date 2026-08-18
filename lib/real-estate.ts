export type LeadType = "seller" | "buyer" | "landlord" | "renter" | "investor";
export type LeadStage = "new" | "attempted_contact" | "contacted" | "qualified" | "appointment_scheduled" | "showing" | "offer" | "under_contract" | "closed" | "nurture" | "lost";
export type Lead = { id: string; name: string; type: LeadType; stage: LeadStage; city: string; score: number; scoreReasons: string[]; nextFollowUp?: string; lastActivity: string };
export const demoLeads: Lead[] = [
  { id: "demo-seller", name: "Maria Rodriguez", type: "seller", stage: "qualified", city: "Haverhill", score: 91, scoreReasons: ["Selling within 90 days: +30", "No agent selected: +20", "Requested valuation: +20", "Responded today: +21"], nextFollowUp: "Today", lastActivity: "Requested a home valuation" },
  { id: "demo-buyer", name: "Jordan Lee", type: "buyer", stage: "contacted", city: "Methuen", score: 72, scoreReasons: ["Preapproved: +25", "Buying within 3 months: +25", "Saved property search: +22"], nextFollowUp: "Tomorrow", lastActivity: "Shared preferred neighborhoods" },
  { id: "demo-renter", name: "Taylor Morgan", type: "renter", stage: "new", city: "Lawrence", score: 54, scoreReasons: ["Move-in date provided: +24", "Complete contact details: +15", "Recent form completion: +15"], nextFollowUp: "Today", lastActivity: "Submitted rental request" },
];
export function scoreBand(score: number) { return score >= 80 ? "Hot" : score >= 60 ? "Warm" : "Nurture"; }
/** Demo-only contract. Replace with licensed providers; never scrape listings. */
export interface PropertyDataProvider { searchProperty(query: string): Promise<unknown[]>; getPropertyDetails(id: string): Promise<unknown | null>; }
export const demoPropertyProvider: PropertyDataProvider = { async searchProperty() { return []; }, async getPropertyDetails() { return null; } };
