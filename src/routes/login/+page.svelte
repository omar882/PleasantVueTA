<script>
	import { goto } from '$app/navigation'
	import { parseData } from '$lib/js/parseData.js'
	import { session } from '$lib/stores/session.js'
	import { oldAssignments } from '$lib/stores/oldAssignments.js'
	import Spinner from '$lib/components/Spinner.svelte'

	let username
	let password
	let error
	let loading = false

	async function login() {
		if (!username) {
			error = 'Please enter a username.'
			return
		}
		if (!password) {
			error = 'Please enter a password.'
			return
		}
		loading = true
		const res = await fetch('/login', {
			method: 'POST',
			body: JSON.stringify({
				username,
				password,
			}),
		})
		if (res.ok) {
			const json = await res.json()
			let { student, periods, currentPeriod } = json
			$session = {
				user: {
					username,
					password,
				},
				student,
				periods,
				currentPeriod,
				selectedPeriod: currentPeriod,
				selected: periods[currentPeriod],
				gradebook: periods[currentPeriod]
			}
			parseData($session, $oldAssignments)
			goto('/')
		} else {
			error = 'Invalid login credentials.'
			loading = false
		}
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="content">
	<form on:submit|preventDefault={login}>
		<h2>Login</h2>
		<input type="text" placeholder="Username" bind:value={username} />
		<input type="password" placeholder="Password" bind:value={password} />
		<div class="error">
			{#if error}
				{error}
			{:else}
				Your login info will not be saved anywhere except your browser.<br />
				You can see all the code on the
				<a rel="external" href="https://github.com/amadorapps/studentvue">github</a>.
			{/if}
		</div>
		<button type="submit">
			{#if loading}
				<Spinner width={20} border={2} />
			{:else}
				Login
			{/if}
		</button>
	</form>
</div>

<style lang="scss">
	.content {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: min-content min-content;
		gap: 10px;
		
	}
	
	.header {
		@include box;
		padding: 5px;
		// width: 100%;
		margin-inline: 10px;
	}

	.header h1 {
		padding: 0px;
		margin: 0px;
		margin-left: 10px;
	}

	form {
		@include box;

		display: flex;
		flex-direction: column;
		margin-inline: auto;
	}

	.error {
		margin: 20px 0;
		color: var(--font-color-2);
		font-size: 1em;
		text-align: center;
	}

	input {
		margin-top: $spacing-small;
	}

	h2 {
		width: 100%;
		text-align: center;
	}

	button {
		display: flex;
		justify-content: center;
	}

	@media (max-width: $breakpoint-phone) {
		form {
			margin: auto $spacing;
		}
	}
</style>
