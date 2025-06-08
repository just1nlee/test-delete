//vitest testing imports
import { expect, test, describe, vi, beforeEach } from "vitest";

//code imports
import { generateChart } from '../../src/lib/generateChart';

//mock the global fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("generateChart", () => {
    //the before each block simulates the quickchart API response
    //and sets up the mock fetch function to return a successful response

    beforeEach(() => {

        //reset the mock fetch before each test
        vi.clearAllMocks();
        
        //mock the blob function to simulate the png that the quickchart api
        //would return
        const mockBlob = new Blob(['mock image data'], { type: 'image/png' });
        mockBlob.text = vi.fn().mockResolvedValue('base64EncodedImageData');
        
        //mock the FileReader constructor for blobToBase64
        const mockFileReader = {
        readAsDataURL: vi.fn(),
        onloadend: null,
        result: 'base64EncodedImageData',
        };
        
        global.FileReader = vi.fn(() => mockFileReader);
        
        //mock the fetch response to return a successful response with a blob
        mockFetch.mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob)
        });
        
        //simulate FileReader success by triggering the success callback
        //as our blobToBase64 function expects this callback
        setTimeout(() => {
        if (mockFileReader.onloadend) {
            mockFileReader.onloadend();}
        }, 0);
    });

    test("line chart with all parameters", async () => {
        const data = [
            { x: 1, y: 10 },
            { x: 2, y: 20 },
            { x: 3, y: 15 }
        ];

        const result = await generateChart(
            "line",
            data,
            "X Axis",
            "Y Axis",
            "Test Line Chart",
            "#FF0000"
        );

        //verify the result matches expected format from our mocked function
        expect(result).toEqual({imageData: 'base64EncodedImageData'});

        //verify that the API call was made
        expect(mockFetch).toHaveBeenCalledTimes(1);
        expect(mockFetch).toHaveBeenCalledWith(
            "https://quickchart.io/chart",
            expect.objectContaining({
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: expect.stringContaining('"type":"line"')
            })
        );
    });

    test("chart with minimal parameters", async () => {
        const data = [{ x: 1, y: 5 }, { x: 2, y: 10 }];

        const result = await generateChart("bar", data, "Categories", "Values");

        expect(result).toEqual({
            imageData: 'base64EncodedImageData'
        });
        expect(mockFetch).toHaveBeenCalledTimes(1);
        
        const callArgs = mockFetch.mock.calls[0];
        const requestBody = JSON.parse(callArgs[1].body);
        expect(requestBody.chart.type).toBe("bar");
        expect(requestBody.chart.data.datasets[0].data).toEqual(data);
    });

    test("scatter plot", async () => {
        const data = [{ x: 1, y: 1 }, { x: 2, y: 4 }];

        const result = await generateChart("scatter", data, "X", "Y");

        expect(result).toEqual({
            imageData: 'base64EncodedImageData'
        });
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    test("uses default color when color is not provided", async () => {
        const data = [{ x: 1, y: 1 }];

        await generateChart("line", data, "X", "Y");

        const callArgs = mockFetch.mock.calls[0];
        const requestBody = JSON.parse(callArgs[1].body);
        expect(requestBody.chart.options.datasets.line.borderColor).toBe("#F97316");
    });

    test("includes title when provided", async () => {
        const data = [{ x: 1, y: 1 }];

        await generateChart("line", data, "X", "Y", "test_title");

        const callArgs = mockFetch.mock.calls[0];
        const requestBody = JSON.parse(callArgs[1].body);
        expect(requestBody.chart.options.plugins.title).toEqual({
        display: true,
        text: "test_title"
        });
    });

    test("excludes title when not provided", async () => {
        const data = [{ x: 1, y: 1 }];

        await generateChart("line", data, "X", "Y");

        const callArgs = mockFetch.mock.calls[0];
        const requestBody = JSON.parse(callArgs[1].body);
        expect(requestBody.chart.options.plugins.title).toBeUndefined();
    });
});