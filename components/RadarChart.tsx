
import React from 'react';
import { AnalysisBreakdown, OutputLanguage } from '../types';
import { t } from '../locales';

interface RadarChartProps {
  data: AnalysisBreakdown;
  lang: OutputLanguage;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, lang }) => {
  const txt = t[lang].results;
  const metrics = [
    { key: 'codeQuality', label: txt.radarCode },
    { key: 'documentation', label: txt.radarDocs },
    { key: 'virality', label: txt.radarViral },
    { key: 'community', label: txt.radarCommunity },
    { key: 'maintenance', label: txt.radarMaint },
  ];

  const size = 200;
  const center = size / 2;
  const radius = size / 2 - 40; // Leave padding for labels

  // Helper to calculate point coordinates
  const getPoint = (index: number, value: number, max: number = 100) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
    const r = (value / max) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points string
  const points = metrics
    .map((m, i) => {
      const val = data[m.key as keyof AnalysisBreakdown] || 50;
      const { x, y } = getPoint(i, val);
      return `${x},${y}`;
    })
    .join(' ');

  // Generate background grid (concentric pentagons)
  const levels = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[240px] h-[240px]">
        <svg width="240" height="240" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {/* Background Grid */}
          {levels.map((level, lvlIdx) => (
            <polygon
              key={lvlIdx}
              points={metrics.map((_, i) => {
                const { x, y } = getPoint(i, level);
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#334155" // Slate 700
              strokeWidth="1"
              className="opacity-50"
            />
          ))}

          {/* Axes Lines */}
          {metrics.map((_, i) => {
             const { x, y } = getPoint(i, 100);
             return (
               <line 
                 key={i} 
                 x1={center} 
                 y1={center} 
                 x2={x} 
                 y2={y} 
                 stroke="#334155" 
                 strokeWidth="1" 
                 className="opacity-30"
                />
             );
          })}

          {/* Data Polygon */}
          <polygon
            points={points}
            fill="rgba(99, 102, 241, 0.2)" // Primary color with opacity
            stroke="#6366f1"
            strokeWidth="2"
            className="filter drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
          />

          {/* Data Points */}
          {metrics.map((m, i) => {
            const val = data[m.key as keyof AnalysisBreakdown] || 50;
            const { x, y } = getPoint(i, val);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                className="fill-secondary stroke-slate-900 stroke-2"
              />
            );
          })}

          {/* Labels */}
          {metrics.map((m, i) => {
            const { x, y } = getPoint(i, 115); // Push labels out further
            // Adjust alignment based on position
            let anchor: "middle" | "start" | "end" = 'middle';
            let baseline: "auto" | "middle" | "central" | "baseline" = 'middle';
            
            if (i === 0) baseline = 'auto'; // Top
            if (i === 1) anchor = 'start'; // Right
            if (i === 4) anchor = 'end'; // Left
            
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor={anchor}
                alignmentBaseline={baseline}
                className="text-[10px] fill-slate-400 font-mono uppercase tracking-wide"
              >
                {m.label}
              </text>
            );
          })}
        </svg>
      </div>
      <div className="text-xs text-slate-500 mt-2 font-mono"></div>
    </div>
  );
};
