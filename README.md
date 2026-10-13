# SPEZZANO SILA AMBIENTI VIRTUALI

Portale turistico indipendente per Spezzano della Sila, Camigliatello e dintorni. React + Vite + React Router + Leaflet. Nessun backend, account, database, analytics o servizio a pagamento.

## Avvio

Node.js 22.12+ (oppure 24).

```sh
npm install
npm run dev
npm run build
npm run check
```

Produzione: `dist`. La build prerenderizza 25 pagine HTML con testi e metadati; React gestisce la navigazione. `public/_redirects` mantiene il fallback per le rotte. `404.html` gestisce gli indirizzi sconosciuti. Mappa caricata separatamente e attivata su richiesta.

## Cloudflare Pages gratuito

Collegare questo repository a un progetto **Pages** con integrazione Git. Ramo produzione `main`, directory radice `/`, comando `npm run build`, output `dist`, variabile `NODE_VERSION=22`. Nessuna Pages Function o Worker necessario. Cloudflare assegna l'indirizzo gratuito del progetto `pages.dev`; non occorre acquistare un dominio.

Dopo aver ottenuto l'URL reale, impostare `VITE_SITE_URL` su quell'origin HTTPS, senza slash finale, e ricostruire. Sono generati canonical, Open Graph assoluti, `sitemap.xml` e robots. Finché l'URL non è noto, robots sospende l'indicizzazione per evitare URL inventati. `.env.example` documenta la variabile; in locale usare `.env.local`.

L'integrazione GitHub non prova che sia già configurato un progetto Cloudflare. Verificare nella dashboard l'esito della build e l'URL pubblico, incluse le pagine aperte direttamente. Non abilitare Web Analytics o Zaraz senza aggiornare la gestione privacy.

## Aggiornare i contenuti

- `src/data/attractions.js`: 14 identificativi stabili, categoria, testi, fonti, coordinate e immagini.
- Coordinate sconosciute: `null`, senza segnaposto; la scheda resta consultabile nell'elenco accessibile.
- `videoUrl`: `null` oggi; inserire successivamente un URL YouTube (`youtu.be/ID`, `watch?v=ID` o `/embed/ID`). L'iframe privacy-enhanced viene creato soltanto dopo consenso per quel video; la revoca lo rimuove. Nessuna preferenza persistente.
- `src/data/events.js`: racconti delle tradizioni, senza calendario permanente. Le date 2026 sono identificate come riferimenti a quell'edizione.
- `src/data/site.js`: dati del gestore, origin e crediti/licenze fotografici.
- `public/images`: fotografie reali ottimizzate in WebP e ospitate localmente; licenze e modifiche sono riportate nelle note editoriali.

## Verifiche e limiti editoriali

Recapiti comunali riscontrati sulla pagina dell'Ufficio Protocollo il 13 ottobre 2026. Il portale non si presenta come sito ufficiale né patrocinato.

9 mete hanno un punto cartografico riscontrato. Da georeferenziare: Piazza Quattro Fontane, Vicoli di Corso Umberto, Palazzo Giudicessa, Rione San Marco e Chiesa di San Pietro. Non sostituire i punti mancanti con coordinate generiche del paese. Croce di Magara è segnalata come località nei dintorni (Casali del Manco secondo la cartografia).

Per Cupone, la vecchia pagina del Parco indica un punto discordante; la mappa usa il punto OSM dell'edificio attuale. Per il Cecita il punto è rappresentativo del bacino: la navigazione porta invece al Centro visita Cupone. Coordinate di centri abitati e riserve non garantiscono l'accesso a parcheggi.

Sono presenti 6 fotografie dedicate; le altre schede dichiarano fotografie in preparazione. Storia di alcuni rioni e itinerari è ancora da documentare. Le fonti discordano sulla data di fondazione del Convento: nessuna data viene assunta come certa.

**Prima della pubblicazione definitiva:** completare nome/ragione sociale, sede, email del titolare e contatti editoriali; confermare basi giuridiche, ruoli contrattuali, conservazione dei log e trasferimenti del fornitore. Privacy e cookie sono bozze esplicite, non una certificazione legale. I recapiti comunali non sono quelli del titolare.

`npm run check` controlla le 25 pagine prodotte, i collegamenti interni, i file media, le fonti, i 14 identificativi e i punti geografici. Workflow GitHub Actions incluso. Il layout contiene breakpoint mobile, menu accessibile, focus visibile e lista alternativa alla mappa; la verifica visuale su dispositivi reali e con tecnologie assistive resta necessaria. Non è dichiarata certificazione WCAG.

La cartografia rispetta attribuzione OSM, richieste HTTPS e caching del browser. Nessun prefetch/offline. In caso di crescita del traffico scegliere un fornitore cartografico adeguato alla relativa policy. Non modificare la Referrer-Policy in modo da sopprimere il Referer verso OSM.
