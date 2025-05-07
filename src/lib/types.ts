export interface DataPoint {
  x: number | string;
  y: number | string;
}

export  interface Chart {
  type: "line" | "scatter" | "bar" | undefined;
  data: DataPoint[];
  xLabel: string;
  yLabel: string;
  title?: string;
  color?: string;
  imageData?: string;
}
