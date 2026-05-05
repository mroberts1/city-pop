export interface Infobox {
	decade_of_origin?: string;
	location_of_origin?: string;
	'creator/s'?: string;
	coined_by?: string;
	key_motifs?: string;
	key_colours?: string;
	key_values?: string;
	related_aesthetics?: string[];
	related_media?: string;
	iconic_figures?: string;
	[key: string]: string | string[] | undefined;
}

export interface Source {
	label: string;
	url: string;
	type: 'wiki' | 'academic' | 'community' | 'database' | 'radio' | 'other';
}

export interface AestheticData {
	name: string;
	slug: string;
	url: string;
	intro: string[];
	infobox: Infobox;
	sections: string[];
	lists: Record<string, string[]>;
	gallery_count: number;
	categories: string[];
	scraped_at: string | null;
	note?: string;
	sources?: Source[];
}
