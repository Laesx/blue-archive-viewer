import { Region } from "./types";

interface LocalizeCharProfileEn {
  CharacterId: number;
  FullNameJp: string;
  PersonalNameEn?: string;
  FamilyNameEn?: string;
}

export const data: LocalizeCharProfileEn[] = [];

export const initialize = async () => {
  const baseUrl = window.location.origin;
  const chars = await fetch(`${baseUrl}/data/en/Preload/TableBundles/Excel/LocalizeCharProfileExcelTable.json`).then((res) => res.json()) as LocalizeCharProfileEn[];
  data.push(...chars);
};
