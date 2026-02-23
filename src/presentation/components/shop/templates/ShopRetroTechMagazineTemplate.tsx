'use client';

import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';
import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';

export function ShopRetroTechMagazineTemplate() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const shopLng = 100.5018;
  const shopLat = 13.7563;

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto': {
            type: 'raster',
            tiles: [
              'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
              'https://cartodb-basemaps-b.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
              'https://cartodb-basemaps-c.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
          }
        },
        layers: [
          {
            id: 'carto-dark-tiles',
            type: 'raster',
            source: 'carto',
            minzoom: 0,
            maxzoom: 19,
          }
        ]
      },
      center: [shopLng, shopLat],
      zoom: 4
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    const initializeMapLayers = async () => {
      if (!map.current) return;

      try {
        const response = await fetch('https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json');
        if (!response.ok) throw new Error('Failed to load GeoJSON');
        const geojsonData = await response.json();

        map.current.addSource('thailand-boundary', {
          type: 'geojson',
          data: geojsonData
        });

        // Neon cyberpunk fill
        map.current.addLayer({
          id: 'thailand-fill',
          type: 'fill',
          source: 'thailand-boundary',
          paint: {
            'fill-color': '#00FFFF',
            'fill-opacity': 0.15
          }
        });

        // Neon borders
        map.current.addLayer({
          id: 'thailand-line',
          type: 'line',
          source: 'thailand-boundary',
          paint: {
            'line-color': '#FF00FF',
            'line-width': 3,
            'line-opacity': 0.8
          }
        });
      } catch (error) {
        console.error('Error loading Thailand GeoJSON:', error);
      }

      // Retro marker
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <div class="relative flex items-center justify-center w-12 h-12">
          <div class="absolute inset-0 bg-[#FF00FF] animate-ping opacity-60 rounded-none border-2 border-[#00FFFF]"></div>
          <div class="relative z-10 w-8 h-8 flex items-center justify-center bg-[#39FF14] text-black shadow-[4px_4px_0_0_rgba(255,0,255,1)] border-4 border-black font-black text-xl">
            >
          </div>
        </div>
      `;

      new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([shopLng, shopLat])
        .setPopup(
          new maplibregl.Popup({ offset: 35, closeButton: false }).setHTML(
            `<div class="font-sans p-2 border-4 border-black bg-[#00FFFF] shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
               <h3 class="font-black text-xl uppercase tracking-widest mb-1 text-black">${DEFAULT_SHOP_CONFIG.shopName}_</h3>
               <p class="text-xs font-bold uppercase tracking-widest opacity-80 text-black border-2 border-black bg-white px-1 inline-block">${DEFAULT_SHOP_CONFIG.shopDescription}</p>
             </div>`
          )
        )
        .addTo(map.current);

      setIsMapLoaded(true);

      setTimeout(() => {
        if (map.current) {
          map.current.flyTo({
            center: [shopLng, shopLat],
            zoom: 12,
            speed: 1.2,
            curve: 1.42,
            easing(t) { return t; }
          });
        }
      }, 1500);
    };

    map.current.on('load', initializeMapLayers);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full flex-1 font-sans flex flex-col pt-4 sm:pt-8 pb-16 p-3 sm:p-6 lg:p-8 selection:bg-[#FF00FF] selection:text-white"
        style={{ backgroundColor: '#f4f4f0', backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px', color: '#111' }}>
      
      <div className="max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 flex flex-col pt-4">
        
        <header className="border-b-4 sm:border-b-8 border-black pb-4 sm:pb-4 bg-white p-4 sm:p-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)] inline-block mx-auto w-full">
          <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter">
            SHOP MAP<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#FF00FF]" style={{ WebkitTextStroke: '2px black' }}>COORDINATES_</span>
          </h1>
          <p className="font-bold text-xs sm:text-sm uppercase tracking-widest mt-3 sm:mt-4 px-2 bg-black text-[#39FF14] inline-block border-2 border-black">
            TARGET LOCATED: {DEFAULT_SHOP_CONFIG.shopName}
          </p>
        </header>

        <div className="w-full h-full min-h-[600px] flex flex-col lg:flex-row bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          
          <div className="w-full lg:w-[400px] border-b-4 lg:border-b-0 lg:border-r-4 border-black p-6 sm:p-8 flex flex-col bg-[#FF00FF] text-white shrink-0">
            <div className="mb-8 border-b-4 border-black pb-6">
              <div className="w-16 h-16 bg-[#00FFFF] border-4 border-black text-black flex items-center justify-center mb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <MapPin className="w-8 h-8" strokeWidth={3} />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-2" style={{ WebkitTextStroke: '1px black' }}>{DEFAULT_SHOP_CONFIG.shopName}</h2>
              <p className="text-xs font-bold uppercase tracking-widest leading-relaxed bg-black px-2 py-1 inline-block border-2 border-white">{DEFAULT_SHOP_CONFIG.shopDescription}</p>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex gap-4 items-start bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <Clock className="w-6 h-6 shrink-0 mt-1" strokeWidth={3} />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">TIME_CYCLE</div>
                  <div className="text-lg font-black uppercase">
                    {DEFAULT_SHOP_CONFIG.operatingHours.open} - {DEFAULT_SHOP_CONFIG.operatingHours.close}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest mt-2 border-2 border-black bg-[#39FF14] px-1 py-0.5 inline-block">SYSTEM_ONLINE</div>
                </div>
              </div>
              
              <div className="flex gap-4 items-start bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <Phone className="w-6 h-6 shrink-0 mt-1" strokeWidth={3} />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">COMM_LINK</div>
                  <div className="text-xl font-black font-mono">02-XXX-XXXX</div>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-white text-black p-4 border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                <Navigation className="w-6 h-6 shrink-0 mt-1" strokeWidth={3} />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">GEO_DATA</div>
                  <div className="text-sm font-bold leading-relaxed uppercase">
                    BKK CITY CORE<br />BTS SKYTRAIN ACCESSIBLE
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                if (map.current) {
                  map.current.flyTo({ center: [shopLng, shopLat], zoom: 16 });
                }
              }}
              className="w-full mt-8 py-4 bg-[#00FFFF] text-black font-black uppercase tracking-[0.2em] border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[#39FF14] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-base flex items-center justify-center gap-3 cursor-pointer"
            >
              <Navigation className="w-5 h-5" strokeWidth={3} /> RELOCATE_PIN
            </button>
          </div>

          <div className="w-full lg:flex-1 h-[500px] lg:h-auto relative bg-[#111]">
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/80 backdrop-blur-sm">
                <div className="text-2xl font-black uppercase tracking-widest text-[#39FF14] animate-pulse border-2 border-[#39FF14] p-4">&gt; BOOTING GEO_OS...</div>
              </div>
            )}
            <div ref={mapContainer} className="w-full h-full absolute inset-0" />
            
            {/* Retro Map Overlays */}
            <div className="absolute top-4 left-4 border-2 border-[#00FFFF] bg-black/50 text-[#00FFFF] text-[10px] font-mono p-2 pointer-events-none backdrop-blur-md">
              LAT: {shopLat.toFixed(4)} <br/>
              LNG: {shopLng.toFixed(4)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
