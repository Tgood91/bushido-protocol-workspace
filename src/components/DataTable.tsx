import React, { useState } from "react";
import { Table as TableIcon, ChevronDown, ChevronUp } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { Tooltip } from "./Tooltip";
import { UI_CLASSES, THEME } from "../ui.config";

interface DataTableProps {
  data: any[];
  schema: any;
}

export const DataTable = ({ data, schema }: DataTableProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  if (!data || data.length === 0) return null;

  const columns = schema?.fields?.map((f: any) => f.name) || Object.keys(data[0]);

  const getCsvData = () => {
    const header = columns.join(",");
    const rows = data.map(row => columns.map(col => String(row[col])).join(","));
    return [header, ...rows].join("\n");
  };

  return (
    <div className={`my-4 ${UI_CLASSES.card} overflow-visible`}>
      <div className={`flex items-center justify-between pr-2 border-b ${THEME.colors.border}`}>
        <Tooltip content={isOpen ? "Collapse Table" : "Expand Table"} className="flex-1 min-w-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-4 py-2 ${UI_CLASSES.labelMono} !text-[#141414]/90 dark:!text-white/80 hover:bg-[#141414]/5 dark:hover:bg-white/5 ${UI_CLASSES.transition} overflow-hidden ${UI_CLASSES.focusRingInset}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <TableIcon className="w-3 h-3 shrink-0" />
              <span className="truncate">Query Results ({data.length} rows)</span>
            </div>
            {isOpen ? <ChevronUp className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />}
          </button>
        </Tooltip>
        <CopyButton text={getCsvData()} className="ml-1 shrink-0" />
      </div>
      {isOpen && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className={`bg-[#F5F5F0] dark:bg-white/5 border-b ${THEME.colors.border}`}>
                {columns.map((col: string) => (
                  <th key={col} className={`px-4 py-2 font-semibold ${THEME.colors.textPrimary} uppercase tracking-wider`}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className={`border-b border-[#141414]/5 dark:border-white/5 hover:bg-[#F5F5F0]/50 dark:hover:bg-white/5 ${UI_CLASSES.transition}`}>
                  {columns.map((col: string) => (
                    <td key={col} className="px-4 py-2 font-mono text-[#141414]/80 dark:text-white/70">
                      {typeof row[col] === 'number' ? row[col].toLocaleString(undefined, { maximumFractionDigits: 4 }) : String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
