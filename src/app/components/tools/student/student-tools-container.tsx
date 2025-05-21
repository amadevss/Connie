'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { studentTools } from './student-tools';
import { StudentToolName, AssistantTasksInput, SummaryGeneratorInput, StudyOrganizerInput, ProblemSolverInput, StudentToolData, StudentTools } from './types';
import { AnimatePresence, motion } from 'framer-motion';

interface StudentToolsContainerProps {
  onToolSubmit: (toolName: StudentToolName, data: AssistantTasksInput | SummaryGeneratorInput | StudyOrganizerInput | ProblemSolverInput) => void;
  isLoading?: boolean;
}

export function StudentToolsContainer({ onToolSubmit, isLoading }: StudentToolsContainerProps) {
  const [selectedTool, setSelectedTool] = useState<StudentToolName | null>(null);

  const handleToolSelect = (toolName: StudentToolName) => {
    setSelectedTool(toolName);
  };

  const handleToolSubmit = (data: AssistantTasksInput | SummaryGeneratorInput | StudyOrganizerInput | ProblemSolverInput) => {
    if (selectedTool) {
      onToolSubmit(selectedTool, data);
    }
  };

  const tools = studentTools as unknown as StudentTools;
  const selectedToolData = selectedTool ? tools.find((tool: StudentToolData) => tool.name === selectedTool) : null;
  const ToolComponent = selectedToolData?.component;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Herramientas para Estudiantes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tools.map((tool: StudentToolData) => (
            <Button
              key={tool.name}
              variant={selectedTool === tool.name ? "default" : "outline"}
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => handleToolSelect(tool.name)}
            >
              <span className="text-2xl">{tool.icon}</span>
              <span className="font-medium">{tool.title}</span>
              <span className="text-sm text-muted-foreground text-center">
                {tool.description}
              </span>
            </Button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {ToolComponent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ToolComponent onSubmit={handleToolSubmit} isLoading={isLoading} />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
} 