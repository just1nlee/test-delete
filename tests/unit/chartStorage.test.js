//vitest testing imports
import { expect, test, describe } from "vitest";

//code imports
import { saveChart, loadAllSavedCharts, loadSavedChart, updateCurrentChartData, loadCurrentChartData, deleteChart, createEmptyChart } from '../../src/lib/chartStorage';

// need to test loadAllSavedCharts first since we cannot interact with local
// program memory without violating the rules of unit testing.
describe("loadAllSavedCharts", () => {
    test("returns an array", () => {
        const result = loadAllSavedCharts();

        expect(result).toEqual([]);
        expect(Array.isArray(result)).toBe(true);
    });
});

describe("loadSavedChart", () => {
    test("returns a Chart object when index doesn't exist", () => {
        const result = loadSavedChart(0);
        
        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
        expect(result).toHaveProperty('type');
        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('xLabel');
        expect(result).toHaveProperty('yLabel');
        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('color');
        expect(result).toHaveProperty('imageData');
        expect(Array.isArray(result.data)).toBe(true);
    });

    test("function doesn't throw with valid number inputs", () => {
        expect(() => loadSavedChart(0)).not.toThrow();
        expect(() => loadSavedChart(5)).not.toThrow();
        expect(() => loadSavedChart(-1)).not.toThrow();
    });
});

describe("deleteChart", () => {
    test("deletes a chart at index 0", () => {
        expect(() => deleteChart(0)).not.toThrow();
    });

    test("does not throw when deleting a chart with an invalid index", () => {
        expect(() => deleteChart(-1)).not.toThrow();
        expect(() => deleteChart(100)).not.toThrow();
    });
});

describe("loadCurrentChartData", () => {
    test("returns a Chart object with default values", () => {
        const result = loadCurrentChartData();

        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
        expect(result).toHaveProperty('type', undefined);
        expect(result).toHaveProperty('data', []);
        expect(result).toHaveProperty('xLabel', '');
        expect(result).toHaveProperty('yLabel', '');
        expect(result).toHaveProperty('title', '');
        expect(result).toHaveProperty('color', '#F97316');
        expect(result).toHaveProperty('imageData', '');
    });
});

// since saveChart utilizes in memory storage that is defined in the file
// but not public, need to check to see if valid inputs result in the
// function executes and does not throw an error
describe("saveChart", () => {
    test("save chart as new with all filled feilds to memory storage", () => {
        const chart = {
            type: "line",
            data: [
                { x: 1, y: 10 },
                { x: 2, y: 15 },
                { x: 3, y: 20 }
            ],
            xLabel: "X Axis",
            yLabel: "Y Axis",
            title: "Test Chart",
            color: "#FF0000",
            imageData: "data:image/png;base64,abc123"
        };

        //need to pass saveChart as a function to vitest since its return value is void
        expect(() => saveChart(chart, null)).not.toThrow();
    });

    test("update chart at index 0 with all filled feilds to memory storage", () => {
        const chart = {
            type: "line",
            data: [
                { x: 1, y: 10 },
                { x: 2, y: 15 },
                { x: 3, y: 20 }
            ],
            xLabel: "X Axis",
            yLabel: "Y Axis",
            title: "Test Chart",
            color: "#FF0000"
        };

        expect(() => saveChart(chart, 0)).not.toThrow();
    });

    test("Emptiest valid chart", () => {
        //chart excludes all optional fields
        const chart = {
            type: undefined,
            data: [],
            xLabel: "",
            yLabel: ""
        };

        expect(() => saveChart(chart, null)).not.toThrow();
    });
});

describe("updateCurrentChartData", () => {
    test("updates current chart data with valid data", () => {
        const chartData = {
            type: "bar",
            data: [
                { x: 1, y: 5 },
                { x: 2, y: 10 }
            ],
            xLabel: "X Axis",
            yLabel: "Y Axis",
            title: "Updated Chart",
            color: "#00FF00"
        };

        expect(() => updateCurrentChartData(chartData)).not.toThrow();
    });

    test("updates current chart data with empty data and no optional fields", () => {
        const chartData = {
            type: "line",
            data: [],
            xLabel: "",
            yLabel: ""
        };

        expect(() => updateCurrentChartData(chartData)).not.toThrow();
    });
});

describe("createEmptyChart", () => {
    test("creates an empty chart with default values", () => {
        const result = createEmptyChart();

        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
        expect(result).toHaveProperty('type', undefined);
        expect(result).toHaveProperty('data', []);
        expect(result).toHaveProperty('xLabel', '');
        expect(result).toHaveProperty('yLabel', '');
        expect(result).toHaveProperty('title', '');
        expect(result).toHaveProperty('color', '#F97316');
        expect(result).toHaveProperty('imageData', '');
    });
});