export interface AssistantTasksInput {
  tipoTarea: string;
  materia: string;
  nivelDificultad: string;
  descripcion: string;
  fechaEntrega: string;
}

export interface AssistantTasksOutput {
  plan: string;
  recursos: string[];
  consejos: string[];
}

export interface SummaryGeneratorInput {
  tipoContenido: string;
  materia: string;
  nivelEducativo: string;
  tema: string;
  palabrasClave: string;
  longitud: 'corta' | 'media' | 'larga';
}

export interface SummaryGeneratorOutput {
  resumen: string;
  puntosClave: string[];
  referencias: string[];
}

export interface StudyOrganizerInput {
  materia: string;
  nivelEducativo: string;
  temas: string;
  fechaExamen: string;
  tiempoDisponible: string;
  preferenciasEstudio: string;
}

export interface StudyOrganizerOutput {
  plan: string;
  horario: string;
  recursos: string[];
  consejos: string[];
}

export interface ProblemSolverInput {
  tipoProblema: string;
  materia: string;
  nivelEducativo: string;
  descripcion: string;
  intentosPrevios: string;
  enfoque: string;
}

export interface ProblemSolverOutput {
  solucion: string;
  pasos: string[];
  explicacion: string;
  recursos: string[];
}

export type StudentToolName = 'asistenteTareas' | 'generadorResumenes' | 'organizadorEstudio' | 'solucionadorProblemas';

export type StudentToolInput = 
  | { tool: 'asistenteTareas'; input: AssistantTasksInput }
  | { tool: 'generadorResumenes'; input: SummaryGeneratorInput }
  | { tool: 'organizadorEstudio'; input: StudyOrganizerInput }
  | { tool: 'solucionadorProblemas'; input: ProblemSolverInput };

export type StudentToolOutput = 
  | { tool: 'asistenteTareas'; output: AssistantTasksOutput }
  | { tool: 'generadorResumenes'; output: SummaryGeneratorOutput }
  | { tool: 'organizadorEstudio'; output: StudyOrganizerOutput }
  | { tool: 'solucionadorProblemas'; output: ProblemSolverOutput };

export type StudentToolComponentProps = {
  onSubmit: (data: AssistantTasksInput | SummaryGeneratorInput | StudyOrganizerInput | ProblemSolverInput) => void;
  isLoading?: boolean;
};

export interface StudentToolData {
  name: StudentToolName;
  title: string;
  description: string;
  icon: string;
  component: React.ComponentType<StudentToolComponentProps>;
}

export type StudentTools = StudentToolData[]; 