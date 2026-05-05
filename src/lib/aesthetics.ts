import type { AestheticData } from './types';

// Import all aesthetic JSON files
import bodikon from './data/bodikon.json';
import cityPop from './data/city-pop.json';
import cyberpunk from './data/cyberpunk.json';
import futureFunk from './data/future-funk.json';
import loFi from './data/lo-fi.json';
import memphisDesign from './data/memphis-design.json';
import newRomantic from './data/new-romantic.json';
import newWave from './data/new-wave.json';
import shibuya from './data/shibuya-kei.json';
import synthwave from './data/synthwave.json';
import vaporwave from './data/vaporwave.json';
import yeYe from './data/ye-ye.json';
import wamono from './data/wamono.json';

export const aesthetics: AestheticData[] = [
	cityPop,
	bodikon,
	cyberpunk,
	futureFunk,
	loFi,
	memphisDesign,
	newRomantic,
	newWave,
	shibuya,
	synthwave,
	vaporwave,
	yeYe,
	wamono
] as AestheticData[];

export const aestheticsBySlug = Object.fromEntries(
	aesthetics.map((a) => [a.slug, a])
);
