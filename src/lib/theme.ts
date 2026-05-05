import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Theme = 'dark' | 'light';

function getInitial(): Theme {
	if (!browser) return 'dark';
	return (localStorage.getItem('theme') as Theme) ?? 'dark';
}

function createThemeStore() {
	const { subscribe, set, update } = writable<Theme>(getInitial());

	return {
		subscribe,
		toggle() {
			update((t) => {
				const next = t === 'dark' ? 'light' : 'dark';
				localStorage.setItem('theme', next);
				document.documentElement.setAttribute('data-theme', next);
				return next;
			});
		},
		init() {
			if (!browser) return;
			const saved = (localStorage.getItem('theme') as Theme) ?? 'dark';
			set(saved);
			document.documentElement.setAttribute('data-theme', saved);
		}
	};
}

export const theme = createThemeStore();
