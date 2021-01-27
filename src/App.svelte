<script>
	import Grid from "./components/Grid.svelte";
	import Chat from "./components/Chat.svelte";

    import { socket } from "./components/stores.js";
	let numUsers = 0;

	socket.on('numUsers', (e) => {
		numUsers = e
		console.log('a new user joined')
	});
</script>

<main>
	{numUsers} are currently connected.
	<br>
	<br>
	<!-- <Foo /> -->
	<Grid />
	<br>
	<Chat />


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