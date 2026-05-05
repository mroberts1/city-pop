import { aesthetics } from '$lib/aesthetics';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		aesthetics: aesthetics.map((a) => ({
			name: a.name,
			slug: a.slug,
			decade: a.infobox.decade_of_origin ?? null,
			key_colours: a.infobox.key_colours ?? null,
			key_motifs: a.infobox.key_motifs ?? null,
			related_count: a.infobox.related_aesthetics?.length ?? 0
		}))
	};
};
