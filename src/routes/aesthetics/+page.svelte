<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function parseColours(str: string | null): string[] {
		if (!str) return [];
		return str.split(/,|\//).map((s) => s.trim()).filter(Boolean).slice(0, 6);
	}

	const colourMap: Record<string, string> = {
		black: '#111', white: '#f5f5f5', pink: '#f472b6', 'neon pink': '#ff2d78',
		'hot pink': '#ff2d78', red: '#ef4444', orange: '#fb923c', yellow: '#fbbf24',
		gold: '#d4a017', 'neon yellow': '#d9f321', green: '#4ade80', 'lime green': '#84cc16',
		cyan: '#22d3ee', 'neon blue': '#3b82f6', blue: '#60a5fa', 'baby blue': '#93c5fd',
		purple: '#a855f7', violet: '#8b5cf6', magenta: '#d946ef', silver: '#94a3b8',
		chrome: '#cbd5e1', 'neon purple': '#c026d3', teal: '#2dd4bf', amber: '#f59e0b',
		'warm brown': '#92400e', 'muted orange': '#c2410c', 'deep green': '#166534',
		'off-white': '#fafaf0', grey: '#6b7280', gray: '#6b7280', beige: '#e5d5b0',
		cream: '#fdf6e3', coral: '#f87171', turquoise: '#2dd4bf', 'pastel pink': '#fbcfe8',
		'pastel blue': '#bfdbfe', 'neon green': '#4ade80'
	};

	function colourToHex(name: string): string {
		const lower = name.toLowerCase().trim();
		for (const [key, hex] of Object.entries(colourMap)) {
			if (lower.includes(key)) return hex;
		}
		return 'var(--border)';
	}
</script>

<svelte:head>
	<title>Aesthetics — City Pop</title>
</svelte:head>

<div class="page">
	<header>
		<a href="/" class="back">← City Pop</a>
		<h1>Aesthetics</h1>
		<p class="subtitle">City Pop and its 12 related aesthetic movements</p>
	</header>

	<div class="grid">
		{#each data.aesthetics as a}
			<a href="/aesthetics/{a.slug}" class="card" class:focal={a.slug === 'city-pop'}>
				<div class="swatches">
					{#each parseColours(a.key_colours) as colour}
						<span class="swatch" style="background: {colourToHex(colour)}" title={colour}></span>
					{/each}
					{#if !a.key_colours}
						<span class="swatch no-colour"></span>
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
		background: var(--bg);
		color: var(--text);
		padding: 2rem;
	}

	header {
		max-width: 1100px;
		margin: 0 auto 2.5rem;
	}

	.back {
		display: inline-block;
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.85rem;
		letter-spacing: 0.04em;
		margin-bottom: 1rem;
	}

	.back:hover { color: var(--accent); }

	h1 {
		font-size: 2.25rem;
		font-weight: 400;
		color: var(--accent);
		letter-spacing: 0.06em;
		margin: 0 0 0.4rem;
	}

	.subtitle {
		font-size: 0.9rem;
		color: var(--text-dim);
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
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 4px;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.2s, transform 0.15s;
	}

	.card:hover {
		border-color: var(--border-hover);
		transform: translateY(-2px);
	}

	.card.focal {
		border-color: var(--accent);
		grid-column: span 2;
	}

	@media (max-width: 600px) {
		.card.focal { grid-column: span 1; }
	}

	.swatches {
		display: flex;
		height: 8px;
	}

	.swatch { flex: 1; display: block; }

	.no-colour { background: var(--border); }

	.body {
		padding: 1rem 1rem 0.5rem;
		flex: 1;
	}

	h2 {
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--text);
		margin: 0 0 0.35rem;
		letter-spacing: 0.02em;
	}

	.decade {
		font-size: 0.75rem;
		color: var(--accent);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.motifs {
		font-size: 0.8rem;
		color: var(--text-dim);
		line-height: 1.4;
		margin: 0.4rem 0 0;
		font-style: italic;
	}

	.footer {
		padding: 0.5rem 1rem 0.75rem;
		border-top: 1px solid var(--border);
	}

	.related {
		font-size: 0.72rem;
		color: var(--text-faint);
		letter-spacing: 0.04em;
	}
</style>
