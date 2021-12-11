import { Translation } from "./translation";

export interface Role {
  id?: number;
  authorId?: number;
  title: Translation;
  responsibilities: Translation;
  description: Translation;
  requirements: Translation;
  timeCommitmentMin: number;
  timeCommitmentMax: number;
  email: string;
  mattermostId: string;
  phone?: string;
  createdDate?: string;
  dueDate?: string;
  filledDate?: string;
  workingCircleId: number;
  localGroupId: number;
}
