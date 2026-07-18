export interface MedicationEntry {
  name: string;
  dosage: string;
  taken: boolean;
}

export interface SymptomsScale {
  energy: number;
  pelvicPain: number;
  bloating: number;
}

export interface PcosSigns {
  acneBreakout: boolean;
  hairChanges: boolean;
}

export interface DailyLog {
  date: string;
  medications: MedicationEntry[];
  cycle: string;
  symptoms: SymptomsScale;
  pcosSigns: PcosSigns;
  mood: string;
  sleepHours: number;
  cravings: string;
}

export interface GlossaryTerm {
  id: number;
  term: string;
  definition: string;
  userNotes: string;
}

export interface LabResult {
  testName: string;
  currentValue: string;
  previousValue: string;
}

export interface Appointment {
  id: number;
  date: string;
  doctorName: string;
  questions: string[];
  labResults: LabResult[];
}

export interface TrackerDatabase {
  logs: DailyLog[];
  terms: GlossaryTerm[];
  appointments: Appointment[];
}
