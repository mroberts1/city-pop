<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const a = data.aesthetic;
	const ib = a.infobox;

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

	function parseColours(str: string | null | undefined): string[] {
		if (!str) return [];
		return str.split(/,|\//).map((s) => s.trim()).filter(Boolean).slice(0, 8);
	}

	function colourToHex(name: string): string {
		const lower = name.toLowerCase().trim();
		for (const [key, hex] of Object.entries(colourMap)) {
			if (lower.includes(key)) return hex;
		}
		return '#555';
	}

	const colours = parseColours(ib.key_colours);

	const infoRows: [string, string][] = [
		['Decade of origin', ib.decade_of_origin ?? ''],
		['Location of origin', ib.location_of_origin ?? ''],
		['Key values', ib.key_values ?? ''],
		['Key motifs', ib.key_motifs ?? ''],
		['Related media', ib.related_media ?? ''],
		['Iconic figures', ib.iconic_figures ?? ''],
		['Creator/s', ib['creator/s'] ?? ''],
		['Coined by', ib.coined_by ?? ''],
	].filter(([, v]) => v) as [string, string][];
</script>

<svelte:head>
	<title>{a.name} — City Pop</title>
</svelte:head>

<div class="page">
	<header>
		<a href="/aesthetics" class="back">← Aesthetics</a>
	</header>

	<article>
		<div class="colour-bar">
			{#each colours as colour}
				<span class="swatch" style="background: {colourToHex(colour)}" title={colour}></span>
			{/each}
		</div>

		<div class="content">
			<div class="main">
				<h1>{a.name}</h1>

				{#if a.intro.length > 0}
					<div class="intro">
						{#each a.intro as para}
							<p>{para}</p>
						{/each}
					</div>
				{/if}

				{#if Object.keys(a.lists).length > 0}
					<div class="lists">
						{#each Object.entries(a.lists) as [listName, items]}
							{#if items.length > 0}
								<section class="list-section">
									<h3>{listName}</h3>
									<ul>
										{#each items as item}
											<li>{item}</li>
										{/each}
									</ul>
								</section>
							{/if}
						{/each}
					</div>
				{/if}
			</div>

			<aside class="infobox">
				{#if colours.length > 0}
					<div class="colour-section">
						<span class="label">Key colours</span>
						<div class="colour-swatches">
							{#each colours as colour}
								<span class="colour-chip" style="background: {colourToHex(colour)}">
									<span class="colour-name">{colour}</span>
								</span>
							{/each}
						</div>
					</div>
				{/if}

				{#each infoRows as [label, value]}
					<div class="info-row">
						<span class="label">{label}</span>
						<span class="value">{value}</span>
					</div>
				{/each}

				{#if ib.related_aesthetics && ib.related_aesthetics.length > 0}
					<div class="info-row">
						<span class="label">Related aesthetics</span>
						<div class="related-tags">
							{#each ib.related_aesthetics as rel}
								{@const relSlug = rel.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}
								<a href="/aesthetics/{relSlug}" class="tag">{rel}</a>
							{/each}
						</div>
					</div>
				{/if}

				{#if a.url && !('note' in a)}
					<div class="wiki-link">
						<a href={a.url} target="_blank" rel="noopener noreferrer">↗ Aesthetics Wiki</a>
					</div>
				{/if}
			</aside>
		</div>

		{#if a.sources && a.sources.length > 0}
			<section class="further-reading">
				<h2>Further Reading</h2>
				<ul>
					{#each a.sources as src}
						<li class="source-item">
							<span class="source-type source-type--{src.type}">{src.type}</span>
							<a href={src.url} target="_blank" rel="noopener noreferrer">{src.label}</a>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</article>
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
		margin: 0 auto 1.5rem;
	}

	.back {
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.85rem;
		letter-spacing: 0.04em;
	}

	.back:hover { color: var(--accent); }

	article { max-width: 1100px; margin: 0 auto; }

	.colour-bar {
		display: flex;
		height: 6px;
		border-radius: 2px;
		overflow: hidden;
		margin-bottom: 2rem;
	}

	.colour-bar .swatch { flex: 1; }

	.content {
		display: grid;
		grid-template-columns: 1fr 280px;
		gap: 3rem;
		align-items: start;
	}

	@media (max-width: 768px) {
		.content { grid-template-columns: 1fr; }
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 400;
		color: var(--accent);
		letter-spacing: 0.05em;
		margin: 0 0 1.5rem;
	}

	.intro p {
		font-size: 0.95rem;
		line-height: 1.75;
		color: var(--text-muted);
		margin: 0 0 1rem;
	}

	.lists { margin-top: 2rem; }

	.list-section { margin-bottom: 1.5rem; }

	.list-section h3 {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--accent);
		margin: 0 0 0.6rem;
		font-weight: 600;
	}

	.list-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.list-section li {
		font-size: 0.875rem;
		color: var(--text-muted);
		padding: 0.25rem 0;
		border-bottom: 1px solid var(--border);
	}

	aside.infobox {
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 4px;
		padding: 1.25rem;
		font-size: 0.8rem;
		position: sticky;
		top: 2rem;
	}

	.colour-section { margin-bottom: 1rem; }

	.colour-swatches {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-top: 0.4rem;
	}

	.colour-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.2rem 0.5rem;
		border-radius: 2px;
		font-size: 0.7rem;
	}

	.colour-name { color: rgba(255,255,255,0.75); }

	.info-row {
		padding: 0.6rem 0;
		border-top: 1px solid var(--border);
	}

	.label {
		display: block;
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--accent);
		margin-bottom: 0.25rem;
	}

	.value {
		color: var(--text-muted);
		line-height: 1.5;
	}

	.related-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.3rem;
	}

	.tag {
		font-size: 0.72rem;
		color: var(--text-muted);
		border: 1px solid var(--border);
		border-radius: 2px;
		padding: 0.15rem 0.5rem;
		text-decoration: none;
		transition: border-color 0.15s, color 0.15s;
	}

	.tag:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	.wiki-link {
		margin-top: 1rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
	}

	.wiki-link a {
		font-size: 0.75rem;
		color: var(--text-faint);
		text-decoration: none;
	}

	.wiki-link a:hover { color: var(--accent); }

	/* Further Reading */
	.further-reading {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
	}

	.further-reading h2 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--accent);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin: 0 0 1rem;
	}

	.further-reading ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.source-item {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		font-size: 0.875rem;
	}

	.source-item a {
		color: var(--text-muted);
		text-decoration: none;
		border-bottom: 1px solid var(--border);
		transition: color 0.15s, border-color 0.15s;
	}

	.source-item a:hover {
		color: var(--accent);
		border-bottom-color: var(--accent);
	}

	.source-type {
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 0.15rem 0.45rem;
		border-radius: 2px;
		flex-shrink: 0;
		font-family: monospace;
	}

	.source-type--wiki       { background: #1e3a5f; color: #7ec8e8; }
	.source-type--academic   { background: #2d1e5f; color: #a78bfa; }
	.source-type--community  { background: #1e3d2a; color: #7ec8a0; }
	.source-type--database   { background: #3d2e1e; color: #d4a76a; }
	.source-type--radio      { background: #3d1e2e; color: #e8a0b4; }
	.source-type--other      { background: #2a2a2a; color: #888888; }

</style>
