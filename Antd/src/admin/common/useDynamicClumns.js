/* =============================
src/modules/common/useDynamicColumns.js
Utility to compute flexible widths
============================= */
import { useMemo } from "react";

export const getColumnWidth = (data, key, extra = 20) => {
  if (!data || data.length === 0) return 120;
  const maxLength = Math.max(
    (key || "").length,
    ...data.map((item) => String(item[key] || "").length)
  );
  return Math.min(Math.max(maxLength * 10 + extra, 80), 450); // clamp
};

export default function useDynamicColumns(data, cols) {
  return useMemo(() => {
    return cols.map((col) => ({
      ...col,
      width: col.width || getColumnWidth(data, col.dataIndex || col.key),
    }));
  }, [data, cols]);
}
