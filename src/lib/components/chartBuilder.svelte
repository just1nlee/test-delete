<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { generateChart } from "$lib/generateChart";
  import { createEmptyChart } from "$lib/chartStorage";
  import { sortPoints } from "$lib/sortPoints";
  import {
    saveChart,
    loadSavedChart,
    loadCurrentChartData,
    updateCurrentChartData,
  } from "$lib/chartStorage";

  import type { Chart, DataPoint } from "$lib/types";

  let { type } = $props();
  let previousType = $state(type);

  let chartData = $state<Chart>(createEmptyChart());
  let dataPoints = $state<Array<DataPoint>>([{ x: "", y: "" }]);
  let saveButtonText = $state("Save Chart");
  let saveButtonDisabled = $state(true);
  let chartId = $state<number | null>(null);

  $effect(() => {
    // Only run after initial setup
    if (previousType !== type && previousType !== "") {
      // Clear chart image when type changes
      chartData.imageData = "";
    }
    previousType = type;
  });

  onMount(() => {
    const chartParam = page.url.searchParams.get("chart");
    chartId = chartParam ? parseInt(chartParam, 10) : null;
    loadChartData();
  });

  function loadChartData() {
    let loadedData: Chart;

    if (chartId !== null) {
      loadedData = loadSavedChart(chartId);
    } else {
      loadedData = loadCurrentChartData();
    }

    if (loadedData && typeof loadedData === "object") {
      chartData.type = loadedData.type || type || "line";
      chartData.title = loadedData.title || "";
      chartData.xLabel = loadedData.xLabel || "";
      chartData.yLabel = loadedData.yLabel || "";
      chartData.color = loadedData.color || "#F97316";
      chartData.imageData = loadedData.imageData || "";

      if (loadedData.data && loadedData.data.length > 0) {
        dataPoints = [...loadedData.data];
      }
    }
  }

  // Add a new empty row to the data grid
  function addXYPair() {
    dataPoints = [...dataPoints, { x: "", y: "" }];
  }

  // Update chart data when input values change
  function updateChartData() {
    // Filter out empty rows where both X and Y are empty
    const validData = dataPoints.filter((pair) => {
      const hasX =
        pair.x !== null && pair.x !== undefined && String(pair.x).trim() !== "";
      const hasY =
        pair.y !== null && pair.y !== undefined && String(pair.y).trim() !== "";
      return hasX || hasY;
    });
    chartData = {
      ...chartData,
      imageData: "",
      data: validData,
    };

    updateCurrentChartData(chartData);
  }

  // Generate chart image from current data
  async function generateChartFromData() {
    const validData = dataPoints.filter((pair) => {
      const hasX =
        pair.x !== null && pair.x !== undefined && String(pair.x).trim() !== "";
      const hasY =
        pair.y !== null && pair.y !== undefined && String(pair.y).trim() !== "";
      return hasX || hasY;
    });

    if (validData.length === 0) {
      alert("Error: No data specified!");
      return;
    }

    if (!chartData.xLabel || !chartData.yLabel) {
      alert("Error: Must specify a label for both X and Y!");
      return;
    }

    try {
      let processedData = [...validData];
      if (type === "bar") {
        processedData = processedData.map((point) => ({
          x: String(point.x),
          y: point.y,
        }));
      }

      const sortedData = sortPoints([...processedData]);
      const { imageData } = await generateChart(
        type,
        sortedData,
        chartData.xLabel,
        chartData.yLabel,
        chartData.title,
        chartData.color
      );
      chartData.imageData = imageData;
      saveButtonDisabled = false;
      saveButtonText = "Save Chart";
    } catch (error) {
      alert(`Error generating chart:\n\n${error}`);
    }
  }

  // Save the current chart
  function saveCurrentChart() {
    saveChart(
      {
        type: type,
        data: chartData.data,
        xLabel: chartData.xLabel,
        yLabel: chartData.yLabel,
        title: chartData.title,
        color: chartData.color,
        imageData: chartData.imageData,
      },
      chartId
    );

    saveButtonText = "Chart Saved ✓";
    saveButtonDisabled = true;
  }

  // Clear chart data and reset UI
  function clearChartData() {
    chartData = createEmptyChart(type);
    dataPoints = [{ x: "", y: "" }];
    updateCurrentChartData(chartData);
    saveButtonText = "Save Chart";
    saveButtonDisabled = true;
  }
</script>

<h1 class="text-3xl font-bold mb-6">
  {type.charAt(0).toUpperCase() + type.slice(1)} Chart Builder
</h1>
<div class="bg-white p-6 rounded-lg shadow-md">
  <div
    class="flex flex-wrap items-end justify-between mb-6 p-4 gap-6 bg-gray-50 rounded-lg"
  >
    <div class="flex flex-wrap gap-4">
      <label class="flex flex-col">
        <span class="text-sm font-medium text-gray-700 mb-1">Chart title</span>
        <input
          bind:value={chartData.title}
          onchange={updateChartData}
          class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </label>
      <label class="flex flex-col">
        <span class="text-sm font-medium text-gray-700 mb-1">Chart color</span>
        <input
          type="color"
          bind:value={chartData.color}
          onchange={updateChartData}
          class="h-10.5 w-20 border border-gray-300 rounded-md cursor-pointer"
        />
      </label>
    </div>
    <div class="flex flex-wrap gap-4">
      <button
        onclick={generateChartFromData}
        class="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-medium"
      >
        Generate Chart
      </button>
      <button
        onclick={clearChartData}
        class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md font-medium"
      >
        Clear Chart Data
      </button>
      <button
        onclick={saveCurrentChart}
        disabled={saveButtonDisabled}
        class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saveButtonText}
      </button>
    </div>
  </div>
  <div class="flex flex-col md:flex-row gap-6">
    <div class="data-entry md:w-1/3">
      <div
        id="x-y-data-grid"
        class="flex flex-col space-y-4 bg-gray-50 p-4 rounded-lg"
      >
        <label class="flex flex-col">
          <span class="text-sm font-medium text-gray-700 mb-1">X label</span>
          <input
            bind:value={chartData.xLabel}
            onchange={updateChartData}
            class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </label>
        <label class="flex flex-col">
          <span class="text-sm font-medium text-gray-700 mb-1">Y label</span>
          <input
            bind:value={chartData.yLabel}
            onchange={updateChartData}
            class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </label>

        <h4 class="font-medium text-gray-800 mt-2">Values</h4>
        <div class="grid grid-cols-2 gap-2">
          {#each dataPoints as pair, i}
            <div class="x-value">
              <label class="text-sm text-gray-600"
                >X
                <input
                  type={type === "bar" ? "text" : "number"}
                  bind:value={pair.x}
                  onchange={updateChartData}
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                /></label
              >
            </div>
            <div class="y-value">
              <label class="text-sm text-gray-600"
                >Y
                <input
                  type="number"
                  bind:value={pair.y}
                  onchange={updateChartData}
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                /></label
              >
            </div>
          {/each}
        </div>
      </div>
      <button
        onclick={addXYPair}
        class="mt-4 bg-orange-500 hover:bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
      >
        +
      </button>
    </div>
    <div
      class="md:w-2/3 bg-gray-50 rounded-lg h-80 flex items-center justify-center"
    >
      {#if chartData.imageData}
        <img
          src={chartData.imageData}
          alt="Generated chart"
          class="max-w-full max-h-full"
        />
      {:else}
        <span class="text-gray-400">Chart will appear here</span>
      {/if}
    </div>
  </div>
</div>
