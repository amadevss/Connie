'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { StudyOrganizerInput } from "./types";

interface StudyOrganizerProps {
  onSubmit: (data: StudyOrganizerInput) => void;
  isLoading?: boolean;
}

export function StudyOrganizer({ onSubmit, isLoading }: StudyOrganizerProps) {
  const [formData, setFormData] = useState<StudyOrganizerInput>({
    materia: '',
    nivelEducativo: '',
    temas: '',
    fechaExamen: '',
    tiempoDisponible: '',
    preferenciasEstudio: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Organizador de Estudio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Label htmlFor="nivelEducativo">Nivel Educativo</Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, nivelEducativo: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el nivel educativo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primaria">Primaria</SelectItem>
                <SelectItem value="secundaria">Secundaria</SelectItem>
                <SelectItem value="preparatoria">Preparatoria</SelectItem>
                <SelectItem value="universidad">Universidad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temas">Temas a Estudiar</Label>
            <Textarea
              id="temas"
              placeholder="Ingresa los temas que necesitas estudiar, separados por comas"
              value={formData.temas}
              onChange={(e) => setFormData({ ...formData, temas: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaExamen">Fecha del Examen</Label>
            <Input
              id="fechaExamen"
              type="date"
              value={formData.fechaExamen}
              onChange={(e) => setFormData({ ...formData, fechaExamen: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiempoDisponible">Tiempo Disponible por Día</Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, tiempoDisponible: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tiempo disponible" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 hora</SelectItem>
                <SelectItem value="2h">2 horas</SelectItem>
                <SelectItem value="3h">3 horas</SelectItem>
                <SelectItem value="4h">4 horas</SelectItem>
                <SelectItem value="5h+">5 horas o más</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferenciasEstudio">Preferencias de Estudio (opcional)</Label>
            <Textarea
              id="preferenciasEstudio"
              placeholder="Describe tus preferencias de estudio (ej: visual, auditivo, práctico)"
              value={formData.preferenciasEstudio}
              onChange={(e) => setFormData({ ...formData, preferenciasEstudio: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !formData.materia || !formData.nivelEducativo || !formData.temas || !formData.fechaExamen || !formData.tiempoDisponible}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando plan de estudio...
              </>
            ) : (
              'Generar Plan de Estudio'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 