<script lang="ts">
	const links = [
		{
			href: '/aesthetics',
			label: 'Aesthetics',
			desc: 'Browse City Pop and its 12 related aesthetic movements'
		},
		{
			href: '/graph',
			label: 'Knowledge Graph',
			desc: 'Explore the network of relationships between aesthetics'
		},
		{
			href: 'https://mroberts1.github.io/endless-summer',
			label: 'Endless Summer',
			desc: 'The academic paper: Transcultural Geographies of City Pop Art',
			external: true
		}
	];
</script>

<svelte:head>
	<title>City Pop</title>
</svelte:head>

<main>
	<header>
		<h1>City Pop</h1>
		<p class="tagline">A visual archive of Japanese City Pop and the aesthetics of its world</p>
	</header>

	<nav class="links">
		{#each links as link}
			<a
				href={link.href}
				class="card"
				target={link.external ? '_blank' : undefined}
				rel={link.external ? 'noopener noreferrer' : undefined}
			>
				<span class="label">{link.label}</span>
				<span class="desc">{link.desc}</span>
				{#if link.external}
					<span class="external-mark">↗</span>
				{/if}
			</a>
		{/each}
	</nav>
</main>

<style>
	main {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: var(--bg);
		color: var(--text);
	}

	header {
		text-align: center;
		margin-bottom: 3rem;
	}

	h1 {
		font-size: clamp(2.5rem, 8vw, 5rem);
		font-weight: 400;
		letter-spacing: 0.08em;
		color: var(--accent);
		margin: 0 0 0.75rem;
	}

	.tagline {
		font-size: 1rem;
		color: var(--text-dim);
		letter-spacing: 0.04em;
		max-width: 40ch;
		margin: 0 auto;
		font-style: italic;
	}

	.links {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		max-width: 520px;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 1.25rem 1.5rem;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--bg-card);
		text-decoration: none;
		color: inherit;
		position: relative;
		transition: border-color 0.2s, background 0.2s;
	}

	.card:hover {
		border-color: var(--border-hover);
		background: var(--bg-hover);
	}

	.label {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--accent);
		letter-spacing: 0.04em;
	}

	.desc {
		font-size: 0.875rem;
		color: var(--text-dim);
		line-height: 1.4;
	}

	.external-mark {
		position: absolute;
		top: 1rem;
		right: 1.25rem;
		font-size: 1rem;
		color: var(--text-faint);
	}

	.card:hover .external-mark {
		color: var(--accent);
	}
</style>
