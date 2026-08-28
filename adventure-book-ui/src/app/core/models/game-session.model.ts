export interface Player {
  healthPoints: number;
  isDead: boolean;
}

export interface GameSession {
  id: string;
  bookId: string;
  currentSectionId: number;
  player: Player;
}

export interface StartGameRequest {
  bookId: string;
}

export interface MakeChoiceRequest {
  nextSectionId: number;
}
