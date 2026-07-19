/**
 * Female-only filter for automated match / AI simulated calls.
 */

const MALE_NAME_RE =
  /\b(alex|alexander|andrew|anthony|benjamin|brandon|brian|charles|chris|christopher|daniel|david|diego|edward|ethan|frank|george|harry|henry|jack|james|jason|john|jonathan|joseph|josh|joshua|juan|kevin|kyle|leo|liam|lucas|luis|mark|martin|matthew|michael|mike|nathan|nick|noah|oliver|oscar|patrick|paul|peter|philip|richard|robert|ryan|sam|samuel|sean|sebastian|steve|steven|thomas|tim|tom|victor|william|will)\b/i;

const FEMALE_HINT_RE =
  /\b(mira|sofia|aya|lina|elena|noor|sara|sarah|afsha|urva|luna|maya|nina|zara|aisha|fatima|maryam|layla|amira|yuki|hana|jiu|mina|priya|ananya|emma|olivia|ava|mia|isabella|sophia|charlotte|amelia|harper|evelyn|aria|luna|camila|gianna|violet|scarlett|chloe|penelope|layla|riley|zoey|nora|lily|eleanor|hanna|addison|ellie|natalia|stella|leah|hazel|violet|aurora|savannah|audrey|brooklyn|bella|claire|skylar|lucy|paisley|everly|anna|caroline|nova|genesis|emilia|kennedy|samantha|maya|willow|kinsley|naomi|aaliyah|elena|sarah|ariana|allison|gabriella|alice|madelyn|cora|ruby|eva|serenity|autumn|adeline|hailey|gianna|valentina|isla|eliana|quinn|nevaeh|ivy|sadie|piper|lydia|alexa|josephine|emery|julia|delilah|arianna|vivian|kaylee|sophie|brielle|madeline|peyton|ryleigh|clara|hadley|melanie|mackenzie|reagan|adelaide|gabrielle|clara|jade|morgan)\b/i;

/** Premium female display names for AI / demo auto-call cycle */
export const FEMALE_PREMIUM_NAMES = [
  "Mira",
  "Sofia",
  "Aya",
  "Lina",
  "Elena",
  "Noor",
  "Sara",
  "Luna",
  "Maya",
  "Zara",
  "Hana",
  "Aisha",
  "Yuna",
  "Priya",
  "Amira",
] as const;

export function isFemaleHostProfile(input: {
  name?: string;
  gender?: string;
  tags?: string[];
}): boolean {
  const gender = String(input.gender || "").toLowerCase();
  if (gender === "male" || gender === "m") return false;
  if (gender === "female" || gender === "f") return true;

  const name = String(input.name || "").trim();
  if (!name) return false;
  if (MALE_NAME_RE.test(name)) return false;
  if (FEMALE_HINT_RE.test(name)) return true;

  /** Default for catalog/demo without gender: require feminine name match only */
  const first = name.split(/\s+/)[0] || name;
  if (FEMALE_PREMIUM_NAMES.some((n) => n.toLowerCase() === first.toLowerCase())) {
    return true;
  }
  // Block placeholders / low-quality labels
  const low = name.toLowerCase();
  if (
    low === "host" ||
    low === "user" ||
    low === "me" ||
    low.includes("placeholder") ||
    low.includes("test")
  ) {
    return false;
  }
  return FEMALE_HINT_RE.test(name);
}

export function filterFemaleHosts<T extends { name?: string; gender?: string }>(
  hosts: T[],
): T[] {
  return hosts.filter((h) => isFemaleHostProfile(h));
}
