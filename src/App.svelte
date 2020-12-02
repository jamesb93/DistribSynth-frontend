<script>
	export let name;
	import Slide from "./components/Slide.svelte"
	import { connections, socket } from "./components/stores.js"

	//
	function beforeUnload() {
	  // Cancel the event as stated by the standard.
	  // more compatibility
	  socket.close();
	  return '...';
	}
</script>



  
  
  <svelte:window on:beforeunload|preventDefault={beforeUnload}/>

<main>
	{$connections} are currently connected.
	<br>
	<Slide />
	<br>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>