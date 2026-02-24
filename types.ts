
export enum TaskStatus {
  PENDING = 'PENDING',
  VERIFYING = 'VERIFYING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum ChecklistType {
  OPENING = 'OPENING',
  CLOSING = 'CLOSING'
}

export interface ChecklistTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  photoUrl?: string;
  verificationMessage?: string;
  lastUpdated?: number;
}

export interface Sector {
  id: string;
  name: string;
  icon: string;
  // Armazenamos dados independentes para cada tipo
  employeeName: {
    [ChecklistType.OPENING]?: string;
    [ChecklistType.CLOSING]?: string;
  };
  observations: {
    [ChecklistType.OPENING]?: string;
    [ChecklistType.CLOSING]?: string;
  };
  finalizedAt: {
    [ChecklistType.OPENING]?: number;
    [ChecklistType.CLOSING]?: number;
  };
  tasks: {
    [ChecklistType.OPENING]: ChecklistTask[];
    [ChecklistType.CLOSING]: ChecklistTask[];
  };
}

export interface DailyData {
  [date: string]: Sector[];
}

export interface ReportEntry {
  date: string;
  sectorId: string;
  sectorName: string;
  sectorIcon: string;
  type: ChecklistType;
  employeeName: string;
  observations: string;
  finalizedAt: number;
  tasks: ChecklistTask[];
}
