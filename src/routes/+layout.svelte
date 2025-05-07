<script lang="ts">
	import "../app.css";
	import { page } from "$app/state";
	import { base } from "$app/paths";
  
	let { children } = $props();
  </script>
  
  <header class="sticky top-0 bg-white shadow-md z-10">
	<nav class="container mx-auto px-4 py-3">
	  <ul class="flex justify-end space-x-6">
		<li>
		  <a
			href="{base}/line"
			class={`px-3 py-2 rounded-md transition-colors ${page.url.pathname === `${base}/line` ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`}
		  >
			Line
		  </a>
		</li>
		<li>
		  <a
			href="{base}/scatter"
			class={`px-3 py-2 rounded-md transition-colors ${page.url.pathname === `${base}/scatter` ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`}
		  >
			Scatter
		  </a>
		</li>
		<li>
		  <a
			href="{base}/bar"
			class={`px-3 py-2 rounded-md transition-colors ${page.url.pathname === `${base}/bar` ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`}
		  >
			Bar
		  </a>
		</li>
		<li>
		  <a
			href="{base}/"
			class={`px-3 py-2 rounded-md transition-colors ${page.url.pathname === `${base}/` ? "bg-orange-500 text-white" : "hover:bg-gray-200"}`}
		  >
			Gallery
		  </a>
		</li>
	  </ul>
	</nav>
  </header>
  <div class="min-h-screen bg-gray-100">
	<main class="container mx-auto px-4 py-8">
	  {@render children()}
	</main>
  </div>
  