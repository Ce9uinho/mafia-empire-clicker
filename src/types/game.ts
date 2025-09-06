export interface GameState {
  dirty: number;
  clean: number;
  dirtyPer: number;
  cleanPer: number;
  cleanCost: number;
  heat: number;
  heatPer: number;
  eff: number;
  lv: number;
  xp: number;
  xpNeed: number;
  capMax: number;
  bldMax: number;
  subMax: number;
  crimes: CrimeNode[];
  capangas: CapangaNode[];
  builds: BuildNode[];
  bribes: BribeNode[];
  playerCrime: string | null;
}

export interface CrimeData {
  id: string;
  name: string;
  reqLv: number;
  dirty: number;
  heat: number;
}

export interface CrimeNode {
  id: string;
  base: CrimeData;
  workers: number;
}

export interface CapangaData {
  id: string;
  name: string;
  hire: number;
  salary: number;
  buffs: {
    dirtyMul?: number;
    heatMul?: number;
  };
}

export interface CapangaNode {
  kind: CapangaData;
}

export interface BuildingData {
  id: string;
  name: string;
  cost: number;
  type: 'launder' | 'clean';
  rate: number;
}

export interface BuildNode {
  b: BuildingData;
}

export interface BribeData {
  id: string;
  name: string;
  costPer: number;
  reduce: number;
}

export interface BribeNode {
  s: BribeData;
}

export type TabType = 'crimes' | 'capangas' | 'buildings' | 'bribes';

export const CRIMES: CrimeData[] = [
  { id: 'pickpocket', name: 'Carteirista', reqLv: 1, dirty: 0.5, heat: 0.02 },
  { id: 'loja', name: 'Furto em Loja', reqLv: 5, dirty: 1.0, heat: 0.05 },
  { id: 'carro', name: 'Roubo de Carro', reqLv: 10, dirty: 2.2, heat: 0.09 },
  { id: 'armazem', name: 'Roubos a Armazéns', reqLv: 25, dirty: 9.0, heat: 0.16 },
  { id: 'posto', name: 'Assalto a Gasolina', reqLv: 30, dirty: 11, heat: 0.20 },
  { id: 'banco', name: 'Assalto a Banco', reqLv: 55, dirty: 45, heat: 0.50 },
];

export const CAPANGAS: CapangaData[] = [
  { id: 'thug', name: 'Recruta', hire: 30, salary: 1, buffs: { dirtyMul: 1.00 } },
  { id: 'sold', name: 'Soldado', hire: 120, salary: 3, buffs: { dirtyMul: 1.08 } },
  { id: 'capo', name: 'Capo', hire: 600, salary: 8, buffs: { dirtyMul: 1.12, heatMul: 0.95 } },
  { id: 'hacker', name: 'Hacker', hire: 900, salary: 10, buffs: { heatMul: 0.90 } },
];

export const BUILDINGS: BuildingData[] = [
  { id: 'bar', name: 'Bar de Esquina', cost: 100, type: 'launder', rate: 1 },
  { id: 'cafe', name: 'Café/Restaurante', cost: 250, type: 'clean', rate: 1 },
  { id: 'trans', name: 'Empresa de Transportes', cost: 2000, type: 'clean', rate: 3 },
];

export const BRIBES: BribeData[] = [
  { id: 'cop', name: 'Polícia Corrupto', costPer: 2, reduce: 0.08 },
  { id: 'juiz', name: 'Juiz Amigo', costPer: 5, reduce: 0.20 },
];