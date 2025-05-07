import type { Chart } from './types';

// In-memory storage for non-browser environments
const memoryStorage = {
  savedCharts: [] as Chart[],
  currentChartData: {} as Chart
};

/**
 * Determines if code is running in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * This function saves a chart in the collection of saved charts.
 * In browser environments, charts are stored in localStorage.
 * In non-browser environments, charts are stored in memory.
 * 
 * @param chart The chart object to save
 * @param idx Optional index to update an existing chart, otherwise adds as new
 */
export function saveChart(chart: Chart, idx: number | null): void {
  let charts: Chart[];
  
  if (isBrowser()) {
    charts = loadAllSavedCharts();
  } else {
    charts = [...memoryStorage.savedCharts];
  }
  
  if (idx != null && idx < charts.length) {
    charts.splice(idx, 1, chart);
  } else {
    charts.push(chart);
  }
  
  if (isBrowser()) {
    window.localStorage.setItem("savedCharts", JSON.stringify(charts));
  } else {
    memoryStorage.savedCharts = charts;
  }
}

/**
 * This function loads and returns the array of all saved charts.
 * Works in both browser and non-browser environments.
 */
export function loadAllSavedCharts(): Chart[] {
  if (isBrowser()) {
    const charts = window.localStorage.getItem("savedCharts") || "[]";
    return JSON.parse(charts) as Chart[];
  } else {
    return [...memoryStorage.savedCharts];
  }
}

/**
 * This function loads and returns a specific chart from the array of saved charts.
 * Returns an empty chart object if the index doesn't exist.
 */
export function loadSavedChart(idx: number): Chart {
  const charts = loadAllSavedCharts();
  return charts[idx] || createEmptyChart();
}

/**
 * This function stores the data for the chart currently being built.
 */
export function updateCurrentChartData(currentChartData: Chart): void {
  if (isBrowser()) {
    window.localStorage.setItem(
      "currentChartData",
      JSON.stringify(currentChartData)
    );
  } else {
    memoryStorage.currentChartData = { ...currentChartData };
  }
}

/**
 * This function loads and returns the data for the chart currently being built.
 */
export function loadCurrentChartData(): Chart {
  if (isBrowser()) {
    const currentChartData =
      window.localStorage.getItem("currentChartData") || "{}";
    const parsed = JSON.parse(currentChartData);
    return Object.keys(parsed).length ? parsed : createEmptyChart();
  } else {
    return Object.keys(memoryStorage.currentChartData).length 
      ? { ...memoryStorage.currentChartData } 
      : createEmptyChart();
  }
}

/**
 * Deletes a chart at the specified index
 */
export function deleteChart(index: number): void {
  const charts = loadAllSavedCharts();
  if (index >= 0 && index < charts.length) {
    charts.splice(index, 1);
    
    if (isBrowser()) {
      window.localStorage.setItem("savedCharts", JSON.stringify(charts));
    } else {
      memoryStorage.savedCharts = charts;
    }
  }
}

/**
 * Creates an empty chart object with default values
 */
export function createEmptyChart(type? : "line"): Chart {
  return {
    type: type,
    data: [],
    xLabel: "",
    yLabel: "",
    title: "",
    color: "#F97316",
    imageData: ""
  };
}
