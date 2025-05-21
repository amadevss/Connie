'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { ProblemSolverInput } from "./types";

interface ProblemSolverProps {
  onSubmit: (data: ProblemSolverInput) => void;
  isLoading?: boolean;
}

export function ProblemSolver({ onSubmit, isLoading }: ProblemSolverProps) {
  const [formData, setFormData] = useState<ProblemSolverInput>({
    tipoProblema: '',
    materia: '',
    nivelEducativo: '',
    descripcion: '',
    intentosPrevios: '',
    enfoque: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Solucionador de Problemas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tipoProblema">Tipo de Problema</Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, tipoProblema: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de problema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matematico">Matemático</SelectItem>
                <SelectItem value="fisico">Físico</SelectItem>
                <SelectItem value="quimico">Químico</SelectItem>
                <SelectItem value="logico">Lógico</SelectItem>
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
            <Label htmlFor="descripcion">Descripción del Problema</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe detalladamente el problema que necesitas resolver"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="intentosPrevios">Intentos Previos (opcional)</Label>
            <Textarea
              id="intentosPrevios"
              placeholder="Describe los intentos que has realizado para resolver el problema"
              value={formData.intentosPrevios}
              onChange={(e) => setFormData({ ...formData, intentosPrevios: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enfoque">Enfoque Deseado (opcional)</Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, enfoque: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el enfoque deseado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paso-a-paso">Paso a Paso</SelectItem>
                <SelectItem value="conceptual">Conceptual</SelectItem>
                <SelectItem value="practico">Práctico</SelectItem>
                <SelectItem value="visual">Visual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !formData.tipoProblema || !formData.materia || !formData.nivelEducativo || !formData.descripcion}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando problema...
              </>
            ) : (
              'Resolver Problema'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 