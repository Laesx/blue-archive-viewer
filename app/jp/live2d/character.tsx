import { Character, LocalizeCharProfile, LocalizeCharProfileEn } from "@/app/lib/table";

/**
 * Localize character name from DevName to EN (FamilyNameEn + PersonalNameEn) if available, otherwise FullNameJp.
 * @param s - DevName
 * @returns Localized character name
 * @example
 * localizeCharFromDevName("azusa_default") // => "Shirasu Azusa" | "白洲アズサ"
 */
export function localizeCharFromDevName(s: string): string {
  const id = findCharIdFromDevName(s);
  if (id !== -1) {
    // Workaround for missing character profile in EN
    const profileEn = LocalizeCharProfileEn.data.find((v) => v.CharacterId === id);
    const profile = LocalizeCharProfile.data.find((v) => v.CharacterId === id);
    // If profileEn is available, return FamilyNameEn + PersonalNameEn
    if (profileEn) return `${[profileEn.PersonalNameEn, profileEn.FamilyNameEn].join(" ")}`;
    // If profile is available, return FullNameJp
    if (!profile) return s;
    if (profile.FamilyNameEn === "" || profile.FamilyNameEn === undefined) return profile.FullNameJp;
    // JP Table never has english names, so maybe I should change localize char profile to load differently and do a check there
    return `${[profile.FamilyNameEn, profile.PersonalNameEn].join(" ")}`;
  }
  return s;
}

/**
 * Find character id from DevName.
 * @param s - DevName
 * @returns CharacterId
 * @example
 * findCharIdFromDevName("azusa_default") // => 10019
 */
export function findCharIdFromDevName(s: string): number {
  let id = Character.data.find((v) => (v.DevName.toLowerCase() === s.toLowerCase() || v.ScenarioCharacter.toLowerCase() === s.toLowerCase()) && (v.IsPlayable || v.IsPlayableCharacter))?.Id;
  if (id) {
    return id;
  }
  // add _10 to_01 to the end of the DevName and try again
  // eg: ch0258 -> ch0258_01
  for(let i = 10; i >= 1; i--) {
    id = Character.data.find((v) => (v.DevName.toLowerCase() === `${s}_${i.toString().padStart(2, "0")}`.toLowerCase() || v.ScenarioCharacter.toLowerCase() === `${s}_${i.toString().padStart(2, "0")}`.toLowerCase()) && (v.IsPlayable || v.IsPlayableCharacter))?.Id;
    if (id) {
      return id;
    }
  }
  return -1;
}
