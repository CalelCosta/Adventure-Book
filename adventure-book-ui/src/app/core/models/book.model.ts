export type SectionType = 'BEGIN' | 'NODE' | 'END';
export type ConsequenceType = 'LOSE_HEALTH' | 'GAIN_HEALTH';

export interface Consequence {
  type: ConsequenceType;
  value: string;
}

export interface Option {
  text: string;
  gotoId: number;
  consequence?: Consequence;
}

export interface Section {
  id: number;
  type: SectionType;
  text: string;
  options: Option[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  sections: Section[];
}
