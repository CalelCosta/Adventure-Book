export interface Consequence {
  type: 'LOSE_HEALTH' | 'GAIN_HEALTH';
  value: number | string;
  text?: string;
}

export interface Option {
  description: string;
  gotoId: number | string;
  consequence?: Consequence;
  requirement?: string;
}

export type SectionType = 'BEGIN' | 'NODE' | 'END';

export interface Section {
  id: number | string;
  title?: string;
  text: string;
  type?: SectionType;
  options?: Option[];
}

export interface Book {
  id?: string | number;
  title: string;
  author: string;
  difficulty?: string;
  description?: string;
  tags?: string[];
  sections: Section[];
}

export interface GameState {
  bookId: string;
  currentSectionId: number | string;
  health: number;
  maxHealth: number;
  isGameOver: boolean;
  isVictorious: boolean;
  lastConsequenceMessage?: string;
}
