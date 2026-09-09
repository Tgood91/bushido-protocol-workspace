import React, { useRef } from "react";
import { BarChart3 } from "lucide-react";
// @ts-ignore
import { VegaEmbed } from "react-vega";
import { CopyButton } from "./CopyButton";
import { UI_CLASSES, THEME } from "../ui.config";

interface ChartBlockProps {
  vegaConfig: any;
}

export const ChartBlock = ({ vegaConfig }: ChartBlockProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  const handleCopyImage = async () => {
    const canvas = chartRef.current?.querySelector("canvas");
    if (!canvas) throw new Error("Chart canvas not found");

    return new Promise<void>((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error("Failed to create image blob"));
          return;
        }
        try {
          const data = [new ClipboardItem({ "image/png": blob })];
          await navigator.clipboard.write(data);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  };

  const processedSpec = React.useMemo(() => {
    if (!vegaConfig) return null;
    
    // Deep clone to avoid mutating original
    const spec = JSON.parse(JSON.stringify(vegaConfig));
    
    // Recursive function to enable tooltips on all marks and encodings
    const enableTooltip = (s: any) => {
      if (!s) return;
      if (s.mark) {
        if (typeof s.mark === 'string') {
          s.mark = { type: s.mark, tooltip: true };
        } else {
          s.mark = { ...s.mark, tooltip: true };
        }
      }
      
      // Force tooltip encoding if not present
      if (s.encoding && !s.encoding.tooltip) {
        s.encoding.tooltip = { content: 'data' };
      }
      
      if (s.layer) s.layer.forEach(enableTooltip);
      if (s.concat) s.concat.forEach(enableTooltip);
      if (s.vconcat) s.vconcat.forEach(enableTooltip);
      if (s.hconcat) s.hconcat.forEach(enableTooltip);
    };
    
    enableTooltip(spec);

    // Identify chart type
    const markType = typeof spec.mark === 'string' ? spec.mark : spec.mark?.type;
    const isBar = markType === 'bar';
    const isHorizontal = isBar && (spec.encoding?.y?.type === 'nominal' || spec.encoding?.y?.type === 'ordinal');

    return {
      ...spec,
      width: spec.width || "container",
      // Use step for better spacing in discrete charts
      height: isHorizontal ? { step: 45 } : (spec.height || 350),
      autosize: spec.autosize || { 
        type: "fit-x", 
        contains: "padding", 
        resize: true 
      },
      config: {
        ...spec.config,
        bar: {
          paddingInner: 0.35, // More space between bars
          paddingOuter: 0.2,
          cornerRadiusEnd: 4,
          ...spec.config?.bar
        },
        view: { stroke: "transparent" },
        axis: {
          labelFontSize: 10,
          titleFontSize: 11,
          labelLimit: 120, // Allow more space for labels
          ...spec.config?.axis
        }
      }
    };
  }, [vegaConfig]);

  return (
    <div className={`my-6 p-4 md:p-6 ${UI_CLASSES.card.replace('rounded-xl', 'rounded-2xl')} flex flex-col items-center group relative overflow-visible`}>
      <div className="w-full flex flex-row items-center justify-between gap-2 mb-4 flex-wrap">
        <div className={`flex items-center gap-2 ${UI_CLASSES.labelMono} text-[10px] md:text-xs`}>
          <BarChart3 className="w-3 h-3 shrink-0" />
          <span className="truncate">Data Visualization</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <CopyButton onCopy={handleCopyImage} />
        </div>
      </div>
      <div className="w-full overflow-x-auto flex justify-start md:justify-center items-start min-h-[350px] scrollbar-hide py-4 px-2">
        <div ref={chartRef} className="w-full max-w-full dark:invert dark:hue-rotate-180">
          <VegaEmbed 
            spec={processedSpec} 
            options={{ 
              actions: false, 
              renderer: "canvas",
              tooltip: { theme: 'custom' }
            }} 
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};
