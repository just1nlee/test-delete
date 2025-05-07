<script lang="ts">
    import { loadAllSavedCharts } from "$lib/chartStorage";
  
    import type { Chart } from "$lib/types";
  
    let savedCharts = $state<Array<Chart>>([]);
  
    $effect(() => {
      savedCharts = loadAllSavedCharts();
    });
  
    function deleteChart(index: number): void {
      savedCharts = savedCharts.filter((_, i) => i !== index);
      localStorage.setItem(
        "savedCharts",
        JSON.stringify(savedCharts)
      );
    }
  </script>

<svelte:head>
  <title>Gallery</title> 
</svelte:head>
  
  <h1 class="text-3xl font-bold mb-6">Gallery</h1>
  <div id="gallery" class="bg-white p-6 rounded-lg shadow-md">
    {#if savedCharts.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each savedCharts as chart, index}
          <div
            class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md"
          >
            <div class="p-4">
              <h3 class="font-semibold text-lg mb-2">
                {chart.title || `Chart ${index + 1}`}
              </h3>
              <p class="text-gray-600 text-sm mb-3">
                Type: {chart.type || "Unknown"}
              </p>
  
              <div
                class="bg-gray-100 h-40 flex items-center justify-center rounded overflow-hidden"
              >
                {#if savedCharts[index].imageData}
                  <img
                    src={savedCharts[index].imageData}
                    alt={chart.title || `Chart ${index + 1}`}
                    class="max-w-full max-h-full object-contain"
                  />
                {:else}
                  <div class="flex flex-col items-center text-gray-500">
                    <span class="text-xs">No preview</span>
                  </div>
                {/if}
              </div>
  
              <div class="mt-4 flex justify-between">
                <button
                  class="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                  onclick={() =>
                    (window.location.href = `/${chart.type?.toLowerCase() || "line"}?chart=${index}`)}
                >
                  Open
                </button>
                <button
                  class="px-3 py-1 border border-red-500 text-red-500 rounded hover:border-red-600 text-sm"
                  onclick={() => deleteChart(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="text-center py-10 text-gray-500">
        <p class="mb-4">No saved charts yet.</p>
        <p>Create a new chart using the navigation above.</p>
      </div>
    {/if}
  </div>
  