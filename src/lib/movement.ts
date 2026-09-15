// Movement is medicine — the Krystalore 3-day-a-week routine.
// The FREE member catalog is a video library set on a 3-day routine. Members can
// upgrade to Krystalore's LIVE program ($99/mo for Kardia Guard members, a
// discount from the regular $399/mo) — live sessions 3×/week plus food &
// nutrition, healthy living, heart-healthy activities, and accountability.
// (Video URLs get populated in the back office; entries here define the routine.)

export type MovementSession = { title: string; focus: string; minutes: number; level: string; videoUrl?: string };
export type MovementDay = { day: string; theme: string; sessions: MovementSession[] };

export const ROUTINE: MovementDay[] = [
  {
    day: "Day 1",
    theme: "Get the heart going",
    sessions: [
      { title: "Gentle warm-up & mobility", focus: "Loosen up, raise the heart rate safely", minutes: 10, level: "All levels" },
      { title: "Low-impact cardio flow", focus: "Steady movement to build heart endurance", minutes: 20, level: "Beginner-friendly" },
      { title: "Cool down & breathe", focus: "Bring it down, calm the nervous system", minutes: 8, level: "All levels" },
    ],
  },
  {
    day: "Day 2",
    theme: "Strength for a strong heart",
    sessions: [
      { title: "Full-body warm-up", focus: "Prep joints and muscles", minutes: 8, level: "All levels" },
      { title: "Chair & bodyweight strength", focus: "Build muscle that supports heart health", minutes: 22, level: "Beginner-friendly" },
      { title: "Stretch & recover", focus: "Lengthen and relax", minutes: 8, level: "All levels" },
    ],
  },
  {
    day: "Day 3",
    theme: "Balance, mobility & calm",
    sessions: [
      { title: "Balance & stability", focus: "Steady, confident movement", minutes: 12, level: "All levels" },
      { title: "Flexibility flow", focus: "Ease and range of motion", minutes: 18, level: "All levels" },
      { title: "Guided relaxation", focus: "Lower stress, support blood pressure", minutes: 10, level: "All levels" },
    ],
  },
];

export const LIVE_PRICE = 99;
export const LIVE_REGULAR = 399;
export const LIVE_INCLUDES = [
  "Live sessions 3× every week — real coaching, not just videos",
  "Food & nutrition guidance for a heart-healthy life",
  "Movement, healthy living & heart-healthy activities",
  "Accountability — the part that actually keeps you going",
];
