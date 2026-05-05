import { aesthetics } from '$lib/aesthetics';
import type { PageServerLoad } from './$types';

function slugify(s: string): string {
	return s
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-zA-Z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
		.toLowerCase();
}

export const load: PageServerLoad = () => {
	const allSlugs = new Set(aesthetics.map((a) => a.slug));
	const slugMap = Object.fromEntries(aesthetics.map((a) => [a.name, a.slug]));

	// Build directed edge list
	const directed: Array<[string, string]> = [];
	for (const a of aesthetics) {
		const related = a.infobox.related_aesthetics ?? [];
		for (const r of related) {
			const targetSlug = slugMap[r] ?? slugify(r);
			if (allSlugs.has(targetSlug)) {
				directed.push([a.slug, targetSlug]);
			}
		}
	}

	// Count bidirectionality
	const pairCount: Record<string, number> = {};
	for (const [src, tgt] of directed) {
		const key = [src, tgt].sort().join('||');
		pairCount[key] = (pairCount[key] ?? 0) + 1;
	}

	// Unique undirected edges with weight
	const seenEdges = new Set<string>();
	const edges: Array<{ source: string; target: string; weight: number }> = [];
	for (const [src, tgt] of directed) {
		const key = [src, tgt].sort().join('||');
		if (!seenEdges.has(key)) {
			seenEdges.add(key);
			edges.push({ source: key.split('||')[0], target: key.split('||')[1], weight: pairCount[key] });
		}
	}

	// Degree per node
	const degree: Record<string, number> = {};
	for (const e of edges) {
		degree[e.source] = (degree[e.source] ?? 0) + 1;
		degree[e.target] = (degree[e.target] ?? 0) + 1;
	}

	// Nodes
	const nodes = aesthetics.map((a) => ({
		id: a.slug,
		name: a.name,
		degree: degree[a.slug] ?? 0,
		decade: a.infobox.decade_of_origin ?? '',
		key_colours: a.infobox.key_colours ?? '',
		key_motifs: a.infobox.key_motifs ?? '',
		intro: a.intro[0] ?? ''
	}));

	return { nodes, edges };
};
