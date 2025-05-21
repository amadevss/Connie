'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { SummaryGeneratorInput } from "./types";

interface SummaryGeneratorProps {
  onSubmit: (data: SummaryGeneratorInput) => void;
  isLoading?: boolean;
}

export function SummaryGenerator({ onSubmit, isLoading }: SummaryGeneratorProps) {
  const [formData, setFormData] = useState<SummaryGeneratorInput>({
    tipoContenido: '',
    materia: '',
    nivelEducativo: '',
    tema: '',
    palabrasClave: '',
    longitud: 'media'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Generador de Resúmenes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tipoContenido">Tipo de Contenido</Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, tipoContenido: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de contenido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="texto">Texto</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="presentacion">Presentación</SelectItem>
                <SelectItem value="articulo">Artículo</SelectItem>
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
            <Label htmlFor="tema">Tema Principal</Label>
            <Input
              id="tema"
              placeholder="Ingresa el tema principal"
              value={formData.tema}
              onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="palabrasClave">Palabras Clave (opcional)</Label>
            <Input
              id="palabrasClave"
              placeholder="Ingresa palabras clave separadas por comas"
              value={formData.palabrasClave}
              onChange={(e) => setFormData({ ...formData, palabrasClave: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitud">Longitud del Resumen</Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, longitud: value as "corta" | "media" | "larga" })}
              defaultValue="media"
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la longitud" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corta">Corta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="larga">Larga</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !formData.tipoContenido || !formData.materia || !formData.nivelEducativo || !formData.tema}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando resumen...
              </>
            ) : (
              'Generar Resumen'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 