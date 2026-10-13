import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {attractions,categories,directionUrl} from '../src/data/attractions.js';
import {events} from '../src/data/events.js';
assert.equal(attractions.length,14);assert.equal(new Set(attractions.map(a=>a.id)).size,14);
for(const a of attractions){assert.match(a.id,/^[a-z0-9-]+$/);assert(categories.includes(a.category));for(const f of ['title','intro','history','features','see','useful'])assert(a[f]);if(a.coordinates){assert(a.coordinateSource);assert(a.coordinates[0]>39&&a.coordinates[0]<40);assert(a.coordinates[1]>16&&a.coordinates[1]<17);assert(new URL(directionUrl(a)));}for(const s of a.sources)assert.equal(new URL(s).protocol,'https:');const html=await readFile('dist/attrazioni/'+a.id+'/index.html','utf8');assert(html.includes(a.title));assert(html.includes('VIRTUAL TOUR — PROSSIMAMENTE'));for(const p of a.images)await access('public'+p.src)}
for(const e of events)assert(e.sources.length);
const paths=['','contatti','eventi-tradizioni','mappa','attrazioni','dove-mangiare','dove-dormire','privacy','cookie','note-editoriali','accessibilita',...attractions.map(a=>'attrazioni/'+a.id)];
for(const path of paths){const html=await readFile('dist/'+(path?path+'/':'')+'index.html','utf8');assert(html.includes('<html lang="it">'));assert(html.includes('<h1'));for(const match of html.matchAll(/href="(\/[^"#?]*)"/g)){const target=match[1];if(target.startsWith('/assets/')||target.startsWith('/images/'))await access('dist'+target);else assert(paths.includes(target.replace(/^\//,'')),`Broken internal link: ${target}`)}}
assert((await readFile('dist/_redirects','utf8')).includes('/* /index.html 200'));
console.log(`OK: ${paths.length} pagine, 14 schede, fonti, media e collegamenti interni. ${attractions.filter(a=>a.coordinates).length} punti georeferenziati.`);
