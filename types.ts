export enum Person {
  Anu = 'Anu',
  Aaku = 'Aaku',
}

export enum WalkTime {
  Morning = 'morning',
  Evening = 'evening',
}

export interface DailyWalks {
  [WalkTime.Morning]: Person[];
  [WalkTime.Evening]: Person[];
}

export interface WalksByDate {
  [date: string]: DailyWalks; // Key is a 'YYYY-MM-DD' string
}

export interface Scores {
  [Person.Anu]: number;
  [Person.Aaku]: number;
}
