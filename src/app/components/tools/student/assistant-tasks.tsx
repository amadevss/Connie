'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AssistantTasksInput } from "./types";

interface AssistantTasksProps {
  onSubmit: (data: AssistantTasksInput) => void;
  isLoading?: boolean;
}

export function AssistantTasks({ onSubmit, isLoading }: AssistantTasksProps) {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState<Omit<AssistantTasksInput, 'fechaEntrega'>>({
    tipoTarea: '',
    materia: '',
    nivelDificultad: '',
    descripcion: ''
  });

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (date: Date) => {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    onSubmit({
      ...formData,
      fechaEntrega: formatDate(date)
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Asistente de Tareas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tipoTarea">Tipo de Tarea</Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, tipoTarea: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de tarea" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="investigacion">Investigación</SelectItem>
                <SelectItem value="proyecto">Proyecto</SelectItem>
                <SelectItem value="ejercicio">Ejercicio</SelectItem>
                <SelectItem value="presentacion">Presentación</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="materia">Materia</Label>
            <Input
              id="materia"
              placeholder="Ingresa la materia"
              value={formData.materia}
              onChange={(e) => setFormData({ ...formData, materia: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nivelDificultad">Nivel de Dificultad</Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, nivelDificultad: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el nivel de dificultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basico">Básico</SelectItem>
                <SelectItem value="intermedio">Intermedio</SelectItem>
                <SelectItem value="avanzado">Avanzado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaEntrega">Fecha de Entrega</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? formatDateForDisplay(date) : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  value={date}
                  onChange={setDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe brevemente la tarea..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !formData.tipoTarea || !formData.materia || !formData.nivelDificultad || !date}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando plan...
              </>
            ) : (
              'Generar Plan de Tarea'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 