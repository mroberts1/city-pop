<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Parse key_colours string into an array of colour names
	function parseColours(str: string | null): string[] {
		if (!str) return [];
		return str
			.split(/,|\//)
			.map((s) => s.trim())
			.filter(Boolean)
			.slice(0, 6);
	}

	// Very rough colour name → hex map for common terms
	const colourMap: Record<string, string> = {
		black: '#111',
		white: '#f5f5f5',
		pink: '#f472b6',
		'neon pink': '#ff2d78',
		'hot pink': '#ff2d78',
		red: '#ef4444',
		orange: '#fb923c',
		yellow: '#fbbf24',
		gold: '#d4a017',
		'neon yellow': '#d9f321',
		green: '#4ade80',
		'lime green': '#84cc16',
		cyan: '#22d3ee',
		'neon blue': '#3b82f6',
		blue: '#60a5fa',
		'baby blue': '#93c5fd',
		purple: '#a855f7',
		violet: '#8b5cf6',
		magenta: '#d946ef',
		silver: '#94a3b8',
		chrome: '#cbd5e1',
		'neon purple': '#c026d3',
		teal: '#2dd4bf',
		'neon green': '#4ade80',
		pastel: '#fce7f3',
		'pastel pink': '#fbcfe8',
		'pastel blue': '#bfdbfe',
		'pastel yellow': '#fef08a',
		'warm white': '#fdf6e3',
		brown: '#a16207',
		grey: '#6b7280',
		gray: '#6b7280',
		beige: '#e5d5b0',
		cream: '#fdf6e3',
		coral: '#f87171',
		turquoise: '#2dd4bf'
	};

	function colourToHex(name: string): string {
		const lower = name.toLowerCase().trim();
		for (const [key, hex] of Object.entries(colourMap)) {
			if (lower.includes(key)) return hex;
		}
		return '#444';
	}
</script>

<svelte:head>
	<title>Aesthetics — City Pop</title>
</svelte:head>

<div class="page">
	<header>
		<a href="/" class="back">← City Pop</a>
		<h1>Aesthetics</h1>
		<p class="subtitle">City Pop and its 11 related aesthetic movements</p>
	</header>

	<div class="grid">
		{#each data.aesthetics as a}
			<a href="/aesthetics/{a.slug}" class="card" class:focal={a.slug === 'city-pop'}>
				<div class="swatches">
					{#each parseColours(a.key_colours) as colour}
						<span class="swatch" style="background: {colourToHex(colour)}" title={colour}></span>
					{/each}
					{#if !a.key_colours}
						<span class="swatch no-colour" title="colours not listed"></span>
					{/if}
				</div>

				<div class="body">
					<h2>{a.name}</h2>
					{#if a.decade}
						<span class="decade">{a.decade}</span>
					{/if}
					{#if a.key_motifs}
						<p class="motifs">{a.key_motifs.slice(0, 80)}{a.key_motifs.length > 80 ? '…' : ''}</p>
					{/if}
				</div>

				<div class="footer">
					<span class="related">{a.related_count} related</span>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		background: #0a0a12;
		color: #f0ece0;
		font-family: 'Georgia', serif;
		padding: 2rem;
	}

	header {
		max-width: 1100px;
		margin: 0 auto 2.5rem;
	}

	.back {
		display: inline-block;
		color: #a09880;
		text-decoration: none;
		font-size: 0.85rem;
		letter-spacing: 0.04em;
		margin-bottom: 1rem;
	}

	.back:hover {
		color: #f9c784;
	}

	h1 {
		font-size: 2.25rem;
		font-weight: 400;
		color: #f9c784;
		letter-spacing: 0.06em;
		margin: 0 0 0.4rem;
	}

	.subtitle {
		font-size: 0.9rem;
		color: #7a7868;
		font-style: italic;
		margin: 0;
	}

	.grid {
		max-width: 1100px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1.25rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		background: #13131f;
		border: 1px solid #2a2a3a;
		border-radius: 4px;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.2s, transform 0.15s;
	}

	.card:hover {
		border-color: #f9c784;
		transform: translateY(-2px);
	}

	.card.focal {
		border-color: #f9c784;
		grid-column: span 2;
	}

	@media (max-width: 600px) {
		.card.focal {
			grid-column: span 1;
		}
	}

	.swatches {
		display: flex;
		height: 8px;
	}

	.swatch {
		flex: 1;
		display: block;
	}

	.no-colour {
		background: #2a2a3a;
	}

	.body {
		padding: 1rem 1rem 0.5rem;
		flex: 1;
	}

	h2 {
		font-size: 1.05rem;
		font-weight: 600;
		color: #f0ece0;
		margin: 0 0 0.35rem;
		letter-spacing: 0.02em;
	}

	.decade {
		font-size: 0.75rem;
		color: #f9c784;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.motifs {
		font-size: 0.8rem;
		color: #7a7868;
		line-height: 1.4;
		margin: 0.4rem 0 0;
		font-style: italic;
	}

	.footer {
		padding: 0.5rem 1rem 0.75rem;
		border-top: 1px solid #1e1e2e;
	}

	.related {
		font-size: 0.72rem;
		color: #4a4858;
		letter-spacing: 0.04em;
	}
</style>
