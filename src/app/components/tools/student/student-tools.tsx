'use client';

import { AssistantTasks } from './assistant-tasks';
import { SummaryGenerator } from './summary-generator';
import { StudyOrganizer } from './study-organizer';
import { ProblemSolver } from './problem-solver';
import { StudentTools } from './types';

export const studentTools: StudentTools = [
  {
    name: 'asistenteTareas',
    title: 'Asistente de Tareas',
    description: 'Organiza y planifica tus tareas escolares de manera eficiente',
    icon: '📝',
    component: AssistantTasks
  },
  {
    name: 'generadorResumenes',
    title: 'Generador de Resúmenes',
    description: 'Crea resúmenes efectivos de tus materiales de estudio',
    icon: '📚',
    component: SummaryGenerator
  },
  {
    name: 'organizadorEstudio',
    title: 'Organizador de Estudio',
    description: 'Planifica tu tiempo de estudio y crea horarios personalizados',
    icon: '📅',
    component: StudyOrganizer
  },
  {
    name: 'solucionadorProblemas',
    title: 'Solucionador de Problemas',
    description: 'Resuelve problemas académicos paso a paso',
    icon: '🔍',
    component: ProblemSolver
  }
]; 