//vitest testing imports
import { expect, test, describe } from "vitest";

//code imports
import { sortPoints } from '../../src/lib/sortPoints';

describe("sortPoints", () => {
    test("sorts numeric data points in ascending order", () => {
        const points = [
            { x: 3, y: 10 },
            { x: 1, y: 5 },
            { x: 2, y: 15 }
        ];
        
        const result = sortPoints(points);
        
        expect(result[0].x).toBe(1);
        expect(result[1].x).toBe(2);
        expect(result[2].x).toBe(3);
        //should be sorted in place
        expect(result).toBe(points);
    });

    test("negative numeric data points", () => {
        const points = [
            { x: 2, y: 10 },
            { x: -1, y: 5 },
            { x: 0, y: 15 },
            { x: -5, y: 20 }
        ];
        
        const result = sortPoints(points);
        
        expect(result[0].x).toBe(-5);
        expect(result[1].x).toBe(-1);
        expect(result[2].x).toBe(0);
        expect(result[3].x).toBe(2);
    });

    test("decimal numeric data points", () => {
        const points = [
            { x: 2.5, y: 10 },
            { x: 1.1, y: 5 },
            { x: 2.2, y: 15 }
        ];
        
        const result = sortPoints(points);
        
        expect(result[0].x).toBe(1.1);
        expect(result[1].x).toBe(2.2);
        expect(result[2].x).toBe(2.5);
    });

    test("string data points", () => {
        const points = [
            { x: "Charlie", y: 10 },
            { x: "Andrew", y: 5 },
            { x: "Brian", y: 15 }
        ];
        
        const result = sortPoints(points);
        
        expect(result[0].x).toBe("Andrew");
        expect(result[1].x).toBe("Brian");
        expect(result[2].x).toBe("Charlie");
    });

    test("handles single element array", () => {
        const points = [{ x: 5, y: 10 }];
        
        const result = sortPoints(points);
        
        expect(result).toHaveLength(1);
        expect(result[0].x).toBe(5);
        expect(result[0].y).toBe(10);
        expect(result).toBe(points);
    });
});