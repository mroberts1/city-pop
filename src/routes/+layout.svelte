<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/global.css';
	import { theme } from '$lib/theme';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => theme.init());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<button
	class="theme-toggle"
	onclick={() => theme.toggle()}
	aria-label="Toggle light/dark theme"
>
	{#if $theme === 'dark'}
		☀
	{:else}
		☾
	{/if}
</button>

{@render children()}

<style>
	.theme-toggle {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 100;
		background: var(--bg-card);
		border: 1px solid var(--border);
		color: var(--accent);
		border-radius: 50%;
		width: 2.25rem;
		height: 2.25rem;
		font-size: 1rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: border-color 0.2s, background 0.2s;
		line-height: 1;
	}

	.theme-toggle:hover {
		border-color: var(--accent);
		background: var(--bg-hover);
	}
</style>
