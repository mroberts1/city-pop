import { aestheticsBySlug } from '$lib/aesthetics';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const aesthetic = aestheticsBySlug[params.slug];
	if (!aesthetic) {
		error(404, `Aesthetic "${params.slug}" not found`);
	}
	return { aesthetic };
};
