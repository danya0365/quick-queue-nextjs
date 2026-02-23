'use client';

import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';
import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';

export function ShopEditorialTemplate() {
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
          'osm': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
            // Add grayscale filter using inline CSS on container since MapLibre raster filters are limited
          }
        ]
      },
      center: [shopLng, shopLat],
      zoom: 5
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

        // Brutalist black fill
        map.current.addLayer({
          id: 'thailand-fill',
          type: 'fill',
          source: 'thailand-boundary',
          paint: {
            'fill-color': '#000000',
            'fill-opacity': 0.1
          }
        });

        // Hard black border
        map.current.addLayer({
          id: 'thailand-line',
          type: 'line',
          source: 'thailand-boundary',
          paint: {
            'line-color': '#000000',
            'line-width': 3,
            'line-opacity': 1
          }
        });
      } catch (error) {
        console.error('Error loading Thailand GeoJSON:', error);
      }

      // Editorial marker
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute inset-0 bg-black animate-ping opacity-50"></div>
          <div class="relative z-10 w-6 h-6 flex items-center justify-center bg-black text-white shadow-[4px_4px_0_0_rgba(150,150,150,1)] border-2 border-white">
          </div>
        </div>
      `;

      new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([shopLng, shopLat])
        .setPopup(
          new maplibregl.Popup({ offset: 35, closeButton: false }).setHTML(
            `<div class="font-serif p-2 border-2 border-black bg-white">
               <h3 class="font-black text-lg uppercase tracking-tighter mb-1">${DEFAULT_SHOP_CONFIG.shopName}</h3>
               <p class="text-xs font-bold uppercase tracking-widest leading-tight opacity-70">${DEFAULT_SHOP_CONFIG.shopDescription}</p>
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
    <div className="w-full flex-1 bg-white text-black font-serif flex flex-col pt-4 pb-16 p-3 sm:p-6 lg:p-10 selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto w-full space-y-6 sm:space-y-10 flex flex-col">
        
        {/* Header Section */}
        <header className="border-b-[4px] sm:border-b-[8px] border-black pb-4 sm:pb-8 mt-4 md:mt-8">
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2">INFORMATION DIRECTORATE</div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4">SHOP<br />LOCATION.</h1>
          <p className="text-sm sm:text-lg font-bold tracking-widest max-w-3xl leading-relaxed bg-black text-white inline-block px-3 py-1">
            แผนที่ร้านค้าและเวลาทำการ // OFFICIAL DETAILS
          </p>
        </header>

        {/* Info & Map Split */}
        <div className="w-full h-full min-h-[700px] flex flex-col lg:flex-row border-[4px] sm:border-[8px] border-black bg-white">
          
          {/* Info Sidebar */}
          <div className="w-full lg:w-[400px] border-b-[4px] lg:border-b-0 lg:border-r-[4px] sm:border-b-[8px] sm:border-r-[8px] border-black p-6 sm:p-10 flex flex-col shrink-0">
            <div className="mb-8 border-b-[4px] border-black pb-6">
              <MapPin className="w-12 h-12 mb-4" strokeWidth={3} />
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-2">{DEFAULT_SHOP_CONFIG.shopName}</h2>
              <p className="text-sm font-bold uppercase tracking-widest leading-relaxed opacity-70">{DEFAULT_SHOP_CONFIG.shopDescription}</p>
            </div>

            <div className="space-y-6 flex-1">
              <div className="flex gap-4 items-start">
                <Clock className="w-6 h-6 shrink-0 mt-1" strokeWidth={3} />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">OPERATING HOURS</div>
                  <div className="text-lg sm:text-xl font-bold uppercase">
                    {DEFAULT_SHOP_CONFIG.operatingHours.open} - {DEFAULT_SHOP_CONFIG.operatingHours.close}
                  </div>
                  <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest mt-2 border-[2px] border-black px-2 py-0.5 inline-block">OPEN EVERYDAY</div>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <Phone className="w-6 h-6 shrink-0 mt-1" strokeWidth={3} />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">CONTACT DESK</div>
                  <div className="text-lg sm:text-xl font-bold font-mono">02-XXX-XXXX</div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Navigation className="w-6 h-6 shrink-0 mt-1" strokeWidth={3} />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50">ADDRESS</div>
                  <div className="text-sm sm:text-base font-bold leading-relaxed uppercase">
                    ใจกลางกรุงเทพมหานคร<br />เดินทางสะดวกด้วยรถไฟฟ้า BTS
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
              className="w-full mt-10 py-4 bg-black text-white font-black uppercase tracking-[0.2em] border-[4px] border-black hover:bg-white hover:text-black transition-colors text-sm sm:text-base flex items-center justify-center gap-3"
            >
              <Navigation className="w-5 h-5" strokeWidth={3} /> RECENTER MAP
            </button>
          </div>

          {/* Map Area */}
          <div className="w-full lg:flex-1 h-[500px] lg:h-auto relative bg-gray-200 grayscale contrast-125">
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 backdrop-blur-md">
                <div className="text-2xl font-black uppercase tracking-widest animate-pulse">LOADING MAP...</div>
              </div>
            )}
            <div ref={mapContainer} className="w-full h-full absolute inset-0" style={{ mixBlendMode: 'multiply' }} />
          </div>

        </div>
      </div>
    </div>
  );
}
