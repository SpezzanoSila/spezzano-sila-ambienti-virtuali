import {build,createServer,loadEnv} from 'vite';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import {attractions} from '../src/data/attractions.js';
await build();
const env=loadEnv('production',process.cwd(),'');
const origin=env.VITE_SITE_URL?.replace(/\/$/,'');
if(origin&&!/^https:\/\/[^/]+$/.test(origin))throw Error('VITE_SITE_URL deve essere un origin HTTPS senza percorso');
const routes=[['/','Scopri la Sila'],['/contatti','Contatti'],['/eventi-tradizioni','Eventi e tradizioni'],['/mappa','Mappa interattiva'],['/attrazioni','Cosa vedere a Spezzano della Sila e Camigliatello Silano'],['/dove-mangiare','Dove mangiare'],['/dove-dormire','Dove dormire'],['/privacy','Privacy Policy'],['/cookie','Cookie Policy'],['/note-editoriali','Note editoriali e licenze'],['/accessibilita','Accessibilità'],...attractions.map(a=>['/attrazioni/'+a.id,a.title])];
const server=await createServer({server:{middlewareMode:true},appType:'custom',mode:'production'});
const {App}=await server.ssrLoadModule('/src/main.jsx');
const template=await readFile('dist/index.html','utf8');
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
try{for(const [path,title] of routes){const a=attractions.find(a=>path==='/attrazioni/'+a.id);const desc=a?.intro||'Spezzano della Sila e Camigliatello Silano: natura, borghi, tradizioni e mappa interattiva. Scopri il territorio della Sila.';const markup=renderToString(React.createElement(StaticRouter,{location:path},React.createElement(App)));let html=template.replace('<div id="root"></div>',`<div id="root">${markup}</div>`).replace(/<title>.*?<\/title>/,`<title>${esc(title)} | Spezzano Sila Ambienti Virtuali</title>`).replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${esc(desc)}">`);const og=`<meta property="og:title" content="${esc(title)} | Spezzano Sila Ambienti Virtuali"><meta property="og:description" content="${esc(desc)}"><meta property="og:type" content="website"><meta property="og:locale" content="it_IT">`;const absolute=origin?`<link rel="canonical" href="${origin}${path}"><meta property="og:url" content="${origin}${path}"><meta property="og:image" content="${origin}/images/cecita.webp">`:'';html=html.replace('</head>',og+absolute+'</head>');const dir=path==='/'?'dist':'dist'+path;await mkdir(dir,{recursive:true});await writeFile(dir+'/index.html',html)}
await writeFile('dist/404.html',template.replace('<div id="root"></div>',`<div id="root">${renderToString(React.createElement(StaticRouter,{location:'/404'},React.createElement(App)))}</div>`));
if(origin){await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(([p])=>`<url><loc>${origin}${p}</loc></url>`).join('')}</urlset>`);await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`)}else{await writeFile('dist/robots.txt','User-agent: *\nDisallow: /\n');console.warn('VITE_SITE_URL assente: indicizzazione sospesa finché non è noto il dominio pubblico.')}console.log(`Prerender: ${routes.length} pagine.`);
}finally{await server.close()}
