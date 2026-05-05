<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type Node = (typeof data.nodes)[number] & d3.SimulationNodeDatum;
	type Edge = { source: Node; target: Node; weight: number };

	let svgEl: SVGSVGElement;
	let selected: (typeof data.nodes)[number] | null = $state(null);
	let width = $state(800);
	let height = $state(600);

	const colourMap: Record<string, string> = {
		black: '#111', white: '#f5f5f5', pink: '#f472b6', 'neon pink': '#ff2d78',
		'hot pink': '#ff2d78', red: '#ef4444', orange: '#fb923c', yellow: '#fbbf24',
		gold: '#d4a017', cyan: '#22d3ee', 'neon blue': '#3b82f6', blue: '#60a5fa',
		'baby blue': '#93c5fd', purple: '#a855f7', violet: '#8b5cf6', magenta: '#d946ef',
		silver: '#94a3b8', teal: '#2dd4bf', amber: '#f59e0b', 'warm brown': '#92400e',
		'off-white': '#fafaf0', grey: '#6b7280', gray: '#6b7280', beige: '#e5d5b0',
		coral: '#f87171', turquoise: '#2dd4bf', 'pastel pink': '#fbcfe8',
		'pastel blue': '#bfdbfe', 'lime green': '#84cc16', 'neon purple': '#c026d3',
		'neon green': '#4ade80', 'deep green': '#166534', 'muted orange': '#c2410c',
		'hot pink ': '#ff2d78', cream: '#fdf6e3', 'neon yellow': '#d9f321',
		green: '#4ade80', 'bright': '#fbbf24'
	};

	function firstColour(str: string): string {
		if (!str) return 'var(--accent)';
		const parts = str.split(/,|\//).map(s => s.trim().toLowerCase());
		for (const part of parts) {
			for (const [key, hex] of Object.entries(colourMap)) {
				if (part.includes(key)) return hex;
			}
		}
		return 'var(--accent)';
	}

	onMount(() => {
		const container = svgEl.parentElement!;
		width = container.clientWidth;
		height = container.clientHeight;

		const nodes: Node[] = data.nodes.map(n => ({ ...n }));
		const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));

		const edges: Edge[] = data.edges
			.map(e => ({ source: nodeById[e.source], target: nodeById[e.target], weight: e.weight }))
			.filter(e => e.source && e.target);

		const minDeg = Math.min(...nodes.map(n => n.degree));
		const maxDeg = Math.max(...nodes.map(n => n.degree));
		const nodeRadius = (d: Node) => {
			const t = maxDeg === minDeg ? 0.5 : (d.degree - minDeg) / (maxDeg - minDeg);
			return 7 + t * 22;
		};

		const svg = d3.select(svgEl)
			.attr('width', width)
			.attr('height', height);

		// Zoom
		const g = svg.append('g');
		svg.call(
			d3.zoom<SVGSVGElement, unknown>()
				.scaleExtent([0.3, 3])
				.on('zoom', (event) => g.attr('transform', event.transform))
		);

		// Simulation
		const sim = d3.forceSimulation<Node>(nodes)
			.force('link', d3.forceLink<Node, Edge>(edges)
				.id(d => d.id!)
				.distance(e => e.weight === 2 ? 80 : 130)
				.strength(e => e.weight === 2 ? 0.9 : 0.4)
			)
			.force('charge', d3.forceManyBody().strength(-320))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('collision', d3.forceCollide<Node>().radius(d => nodeRadius(d) + 10));

		// Edges
		const link = g.append('g').selectAll<SVGLineElement, Edge>('line')
			.data(edges)
			.join('line')
			.attr('stroke', 'var(--border)')
			.attr('stroke-width', e => e.weight === 2 ? 2.5 : 1)
			.attr('stroke-opacity', e => e.weight === 2 ? 0.7 : 0.35);

		// Node groups
		const node = g.append('g').selectAll<SVGGElement, Node>('g')
			.data(nodes)
			.join('g')
			.attr('cursor', 'pointer')
			.call(
				d3.drag<SVGGElement, Node>()
					.on('start', (event, d) => {
						if (!event.active) sim.alphaTarget(0.3).restart();
						d.fx = d.x; d.fy = d.y;
					})
					.on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
					.on('end', (event, d) => {
						if (!event.active) sim.alphaTarget(0);
						d.fx = null; d.fy = null;
					})
			)
			.on('click', (_event, d) => {
				selected = selected?.id === d.id ? null : data.nodes.find(n => n.id === d.id) ?? null;
			});

		// Circles
		node.append('circle')
			.attr('r', nodeRadius)
			.attr('fill', d => firstColour(d.key_colours))
			.attr('fill-opacity', 0.85)
			.attr('stroke', d => firstColour(d.key_colours))
			.attr('stroke-width', 2)
			.attr('stroke-opacity', 1);

		// Labels
		node.append('text')
			.text(d => d.name)
			.attr('text-anchor', 'middle')
			.attr('dy', d => nodeRadius(d) + 13)
			.attr('font-size', '11px')
			.attr('font-family', 'Georgia, serif')
			.attr('fill', 'var(--text-muted)')
			.attr('pointer-events', 'none');

		// Hover highlight
		node
			.on('mouseenter', function(_e, d) {
				d3.select(this).select('circle')
					.attr('stroke-width', 3)
					.attr('fill-opacity', 1);
				// Dim non-neighbours
				const neighbourIds = new Set(
					edges.filter(e => e.source.id === d.id || e.target.id === d.id)
						.flatMap(e => [e.source.id, e.target.id])
				);
				node.attr('opacity', n => neighbourIds.has(n.id) || n.id === d.id ? 1 : 0.2);
				link.attr('stroke-opacity', e =>
					e.source.id === d.id || e.target.id === d.id
						? (e.weight === 2 ? 1 : 0.7)
						: 0.05
				);
			})
			.on('mouseleave', function() {
				d3.select(this).select('circle')
					.attr('stroke-width', 2)
					.attr('fill-opacity', 0.85);
				node.attr('opacity', 1);
				link.attr('stroke-opacity', e => e.weight === 2 ? 0.7 : 0.35);
			});

		// Tick
		sim.on('tick', () => {
			link
				.attr('x1', e => (e.source as Node).x!)
				.attr('y1', e => (e.source as Node).y!)
				.attr('x2', e => (e.target as Node).x!)
				.attr('y2', e => (e.target as Node).y!);
			node.attr('transform', d => `translate(${d.x},${d.y})`);
		});

		// Resize
		const ro = new ResizeObserver(() => {
			width = container.clientWidth;
			height = container.clientHeight;
			svg.attr('width', width).attr('height', height);
			sim.force('center', d3.forceCenter(width / 2, height / 2)).alpha(0.3).restart();
		});
		ro.observe(container);

		return () => { sim.stop(); ro.disconnect(); };
	});
</script>

<svelte:head>
	<title>Knowledge Graph — City Pop</title>
</svelte:head>

<div class="page">
	<header>
		<a href="/" class="back">← City Pop</a>
		<h1>Knowledge Graph</h1>
		<p class="subtitle">Drag nodes · Scroll to zoom · Click to inspect</p>
	</header>

	<div class="workspace">
		<div class="canvas">
			<svg bind:this={svgEl}></svg>
		</div>

		<aside class="panel" class:open={selected !== null}>
			{#if selected}
				<div class="panel-inner">
					<button class="close" onclick={() => selected = null} aria-label="Close">✕</button>

					{#if selected.key_colours}
						<div class="colour-bar">
							{#each selected.key_colours.split(/,|\//).map(s => s.trim()).filter(Boolean).slice(0, 6) as c}
								<span class="cswatch" style="background: {firstColour(c)}" title={c}></span>
							{/each}
						</div>
					{/if}

					<h2>{selected.name}</h2>
					{#if selected.decade}
						<span class="decade">{selected.decade}</span>
					{/if}

					{#if selected.intro}
						<p class="intro">{selected.intro}</p>
					{/if}

					{#if selected.key_motifs}
						<div class="field">
							<span class="label">Key motifs</span>
							<span class="value">{selected.key_motifs}</span>
						</div>
					{/if}

					<div class="field">
						<span class="label">Connections</span>
						<span class="value">{selected.degree}</span>
					</div>

					<a href="/aesthetics/{selected.id}" class="full-link">
						View full page →
					</a>
				</div>
			{/if}
		</aside>
	</div>

	<div class="legend">
		<span class="legend-item">
			<svg width="30" height="8">
				<line x1="0" y1="4" x2="30" y2="4" stroke="var(--text-muted)" stroke-width="2.5"/>
			</svg>
			Bidirectional link
		</span>
		<span class="legend-item">
			<svg width="30" height="8">
				<line x1="0" y1="4" x2="30" y2="4" stroke="var(--text-faint)" stroke-width="1"/>
			</svg>
			One-way link
		</span>
		<span class="legend-item">
			<svg width="20" height="20">
				<circle cx="10" cy="10" r="9" fill="var(--accent)" fill-opacity="0.8"/>
			</svg>
			Node size = connections
		</span>
	</div>
</div>

<style>
	.page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--bg);
		color: var(--text);
		overflow: hidden;
	}

	header {
		padding: 1.25rem 1.5rem 0.75rem;
		flex-shrink: 0;
	}

	.back {
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.8rem;
		letter-spacing: 0.04em;
		font-family: Georgia, serif;
	}

	.back:hover { color: var(--accent); }

	h1 {
		font-size: 1.5rem;
		font-weight: 400;
		color: var(--accent);
		letter-spacing: 0.06em;
		margin: 0.25rem 0 0.2rem;
		font-family: Georgia, serif;
	}

	.subtitle {
		font-size: 0.75rem;
		color: var(--text-faint);
		font-style: italic;
		font-family: Georgia, serif;
		margin: 0;
	}

	.workspace {
		flex: 1;
		display: flex;
		min-height: 0;
		position: relative;
	}

	.canvas {
		flex: 1;
		overflow: hidden;
	}

	svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	/* Side panel */
	.panel {
		width: 0;
		overflow: hidden;
		transition: width 0.25s ease;
		border-left: 1px solid transparent;
		background: var(--bg-card);
		flex-shrink: 0;
	}

	.panel.open {
		width: 300px;
		border-left-color: var(--border);
	}

	.panel-inner {
		width: 300px;
		padding: 1.5rem;
		overflow-y: auto;
		height: 100%;
		box-sizing: border-box;
		font-family: Georgia, serif;
	}

	.close {
		float: right;
		background: none;
		border: none;
		color: var(--text-faint);
		cursor: pointer;
		font-size: 0.85rem;
		padding: 0;
		line-height: 1;
	}

	.close:hover { color: var(--accent); }

	.colour-bar {
		display: flex;
		height: 5px;
		border-radius: 2px;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	.cswatch { flex: 1; }

	h2 {
		font-size: 1.4rem;
		font-weight: 400;
		color: var(--accent);
		margin: 0 0 0.3rem;
		letter-spacing: 0.03em;
	}

	.decade {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-dim);
	}

	.intro {
		font-size: 0.82rem;
		line-height: 1.6;
		color: var(--text-muted);
		margin: 0.75rem 0;
		font-style: italic;
	}

	.field {
		padding: 0.5rem 0;
		border-top: 1px solid var(--border);
	}

	.label {
		display: block;
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--accent);
		margin-bottom: 0.2rem;
	}

	.value {
		font-size: 0.8rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	.full-link {
		display: inline-block;
		margin-top: 1.25rem;
		font-size: 0.8rem;
		color: var(--accent);
		text-decoration: none;
		border: 1px solid var(--border);
		padding: 0.4rem 0.9rem;
		border-radius: 3px;
		transition: border-color 0.15s, background 0.15s;
	}

	.full-link:hover {
		border-color: var(--accent);
		background: var(--bg-hover);
	}

	/* Legend */
	.legend {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		padding: 0.6rem 1.5rem;
		border-top: 1px solid var(--border);
		font-size: 0.72rem;
		color: var(--text-faint);
		font-family: Georgia, serif;
		flex-shrink: 0;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
</style>
