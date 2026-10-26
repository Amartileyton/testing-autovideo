import React from 'react';
import { ComparisonBattle, type ComparisonBattleProps } from './ComparisonBattle';
import {
  ExponentialGrowthChart,
  type ExponentialGrowthChartProps,
} from './ExponentialGrowthChart';
import { VectorLoopCircuit, type VectorLoopCircuitProps } from './VectorLoopCircuit';
import { StepCascadeList, type StepCascadeListProps } from './StepCascadeList';
import { ParetoBarChart, type ParetoBarChartProps } from './ParetoBarChart';
import {
  IcebergDepthDiagram,
  type IcebergDepthDiagramProps,
} from './IcebergDepthDiagram';
import { FunnelFilter, type FunnelFilterProps } from './FunnelFilter';
import { PyramidHierarchy, type PyramidHierarchyProps } from './PyramidHierarchy';
import { VennConvergence, type VennConvergenceProps } from './VennConvergence';
import {
  EisenhowerMatrix2x2,
  type EisenhowerMatrix2x2Props,
} from './EisenhowerMatrix2x2';
import {
  CognitiveBatteryMeter,
  type CognitiveBatteryMeterProps,
} from './CognitiveBatteryMeter';
import {
  BalanceScaleTradeoff,
  type BalanceScaleTradeoffProps,
} from './BalanceScaleTradeoff';

export type VisualArchetypeId =
  | 'ComparisonBattle'
  | 'ExponentialGrowthChart'
  | 'VectorLoopCircuit'
  | 'StepCascadeList'
  | 'ParetoBarChart'
  | 'IcebergDepthDiagram'
  | 'FunnelFilter'
  | 'PyramidHierarchy'
  | 'VennConvergence'
  | 'EisenhowerMatrix2x2'
  | 'CognitiveBatteryMeter'
  | 'BalanceScaleTradeoff';

export interface ArchetypeCatalogEntry {
  id: VisualArchetypeId;
  code: string;
  name: string;
  cognitiveMetaphor: string;
  bestForBooks: string;
  whenToChoose: string;
}

export const VISUAL_ARCHETYPE_CATALOG: readonly ArchetypeCatalogEntry[] = [
  {
    id: 'ComparisonBattle',
    code: '01',
    name: 'Batalla Comparativa (A vs. B)',
    cognitiveMetaphor: 'Choque de Paradigmas (Mito vs. Realidad)',
    bestForBooks: 'Productividad, Psicología, Finanzas, Hábitos',
    whenToChoose:
      'Cuando el autor contrasta el comportamiento común erróneo con el principio diferencial del libro.',
  },
  {
    id: 'ExponentialGrowthChart',
    code: '02',
    name: 'Curva Exponencial y Umbral',
    cognitiveMetaphor: 'Interés Compuesto y Valle de la Decepción',
    bestForBooks: 'Hábitos, Inversión, Aprendizaje, Maestría',
    whenToChoose:
      'Cuando los resultados tardan en aparecer al principio pero se disparan tras cruzar un punto de inflexión.',
  },
  {
    id: 'VectorLoopCircuit',
    code: '03',
    name: 'Circuito de Bucle de 3 Nodos',
    cognitiveMetaphor: 'Sistema Cíclico Autopropulsado',
    bestForBooks: 'Hábitos, Sistemas de Negocio, Neurociencia',
    whenToChoose:
      'Cuando el libro explica un proceso repetitivo de 3 pasos con retroalimentación continua.',
  },
  {
    id: 'StepCascadeList',
    code: '04',
    name: 'Escalera / Cascada de 4 Reglas',
    cognitiveMetaphor: 'Hoja de Ruta Accionable',
    bestForBooks: 'Todos los libros prácticos y de desarrollo personal',
    whenToChoose:
      'Cuando la escena resume 3 o 4 mandamientos prácticos listos para aplicar hoy mismo.',
  },
  {
    id: 'ParetoBarChart',
    code: '05',
    name: 'Ley de Pareto (Desproporción 80/20)',
    cognitiveMetaphor: 'Asimetría Esfuerzo vs. Retorno',
    bestForBooks: 'Estrategia, Gestión del Tiempo, Ventas, Negocios',
    whenToChoose:
      'Cuando una minoría selecta de acciones (20%) produce la gran mayoría de los resultados (80%).',
  },
  {
    id: 'IcebergDepthDiagram',
    code: '06',
    name: 'Diagrama Iceberg (Visible vs. Oculto)',
    cognitiveMetaphor: 'Superficie Visible (15%) vs. Sistema Sumergido (85%)',
    bestForBooks: 'Psicología, Mentalidad, Liderazgo, Biografías',
    whenToChoose:
      'Cuando el éxito visible depende de causas invisibles, preparación en solitario o creencias subconscientes.',
  },
  {
    id: 'FunnelFilter',
    code: '07',
    name: 'Embudo de Filtro Esencialista',
    cognitiveMetaphor: 'Destilación y Eliminación de Ruido',
    bestForBooks: 'Esencialismo, Minimalismo, Foco, Toma de Decisiones',
    whenToChoose:
      'Cuando la idea central consiste en descartar 100 opciones triviales para quedarse con 1 prioridad vital.',
  },
  {
    id: 'PyramidHierarchy',
    code: '08',
    name: 'Pirámide Jerárquica de 3 Niveles',
    cognitiveMetaphor: 'Construcción de Cimientos a Cúspide',
    bestForBooks: 'Salud, Psicología, Liderazgo, Finanzas Personales',
    whenToChoose:
      'Cuando el nivel superior (maestría o libertad) exige haber consolidado antes los cimientos.',
  },
  {
    id: 'VennConvergence',
    code: '09',
    name: 'Convergencia de Venn (El Punto Dulce)',
    cognitiveMetaphor: 'Intersección de 3 Fuerzas Complementarias',
    bestForBooks: 'Propósito (Ikigai), Carrera Profesional, Posicionamiento',
    whenToChoose:
      'Cuando el éxito surge al combinar 3 ingredientes simultáneos (ej. Habilidad + Enfoque + Mercado).',
  },
  {
    id: 'EisenhowerMatrix2x2',
    code: '10',
    name: 'Matriz 2×2 de Decisión Estratégica',
    cognitiveMetaphor: 'Clasificación Cartesiana en 4 Cuadrantes',
    bestForBooks: 'Gestión, Productividad, Inversión, Negociación',
    whenToChoose:
      'Cuando hay que cruzar 2 variables (Impacto vs. Urgencia, Riesgo vs. Retorno) e iluminar el cuadrante ganador.',
  },
  {
    id: 'CognitiveBatteryMeter',
    code: '11',
    name: 'Medidor de Batería Cognitiva y Fugas',
    cognitiveMetaphor: 'Drenaje de Energía vs. Flujo Blindado',
    bestForBooks: 'Neurociencia, Atención, Descanso, Dopamina',
    whenToChoose:
      'Cuando el libro explica cómo las interrupciones o el estrés vacían nuestra energía mental disponible.',
  },
  {
    id: 'BalanceScaleTradeoff',
    code: '12',
    name: 'Palanca de Arquímedes / Coste de Oportunidad',
    cognitiveMetaphor: 'Apalancamiento Asimétrico',
    bestForBooks: 'Riqueza, Estrategia, Productividad, Filosofía Práctica',
    whenToChoose:
      'Cuando 1 hora de acción apalancada pesa más que 8 horas de trabajo mecánico.',
  },
] as const;

export interface ArchetypeRendererProps {
  archetype: VisualArchetypeId;
  enterFrame?: number;
  props?: Record<string, unknown>;
}

export const ArchetypeRenderer: React.FC<ArchetypeRendererProps> = ({
  archetype,
  enterFrame = 0,
  props = {},
}) => {
  switch (archetype) {
    case 'ComparisonBattle':
      return (
        <ComparisonBattle
          titleA="TRABAJO SUPERFICIAL"
          subtitleA="Correos, urgencias ajenas y multitarea fragmentada"
          titleB="TRABAJO PROFUNDO"
          subtitleB="Bloques blindados de 90 min con máxima creación de valor"
          enterFrameA={enterFrame}
          enterFrameB={enterFrame + 10}
          battleFrame={enterFrame + 24}
          {...(props as Partial<ComparisonBattleProps>)}
        />
      );
    case 'ExponentialGrowthChart':
      return (
        <ExponentialGrowthChart
          startFrame={enterFrame}
          {...(props as Partial<ExponentialGrowthChartProps>)}
        />
      );
    case 'VectorLoopCircuit':
      return (
        <VectorLoopCircuit
          startFrame={enterFrame}
          {...(props as Partial<VectorLoopCircuitProps>)}
        />
      );
    case 'StepCascadeList':
      return (
        <StepCascadeList
          enterFrame={enterFrame}
          {...(props as StepCascadeListProps)}
        />
      );
    case 'ParetoBarChart':
      return (
        <ParetoBarChart
          enterFrame={enterFrame}
          {...(props as ParetoBarChartProps)}
        />
      );
    case 'IcebergDepthDiagram':
      return (
        <IcebergDepthDiagram
          enterFrame={enterFrame}
          {...(props as IcebergDepthDiagramProps)}
        />
      );
    case 'FunnelFilter':
      return (
        <FunnelFilter
          enterFrame={enterFrame}
          {...(props as FunnelFilterProps)}
        />
      );
    case 'PyramidHierarchy':
      return (
        <PyramidHierarchy
          enterFrame={enterFrame}
          {...(props as PyramidHierarchyProps)}
        />
      );
    case 'VennConvergence':
      return (
        <VennConvergence
          enterFrame={enterFrame}
          {...(props as VennConvergenceProps)}
        />
      );
    case 'EisenhowerMatrix2x2':
      return (
        <EisenhowerMatrix2x2
          enterFrame={enterFrame}
          {...(props as EisenhowerMatrix2x2Props)}
        />
      );
    case 'CognitiveBatteryMeter':
      return (
        <CognitiveBatteryMeter
          enterFrame={enterFrame}
          {...(props as CognitiveBatteryMeterProps)}
        />
      );
    case 'BalanceScaleTradeoff':
      return (
        <BalanceScaleTradeoff
          enterFrame={enterFrame}
          {...(props as BalanceScaleTradeoffProps)}
        />
      );
    default:
      return <ParetoBarChart enterFrame={enterFrame} />;
  }
};
