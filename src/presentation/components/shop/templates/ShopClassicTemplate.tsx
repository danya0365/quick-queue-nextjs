'use client';

import { DEFAULT_SHOP_CONFIG } from '@/src/config/shop.config';
import { Clock, MapPin, Navigation, Phone } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef, useState } from 'react';

export function ShopClassicTemplate() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Default shop coordinates (e.g., Bangkok, Thailand)
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
            maxzoom: 19
          }
        ]
      },
      center: [shopLng, shopLat],
      zoom: 5 // Start zoomed out to show Thailand
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    const initializeMapLayers = async () => {
      if (!map.current) return;

      try {
        // Fetch Thailand GeoJSON
        const response = await fetch('https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json');
        if (!response.ok) throw new Error('Failed to load GeoJSON');
        const geojsonData = await response.json();

        // Add Thailand boundary source
        map.current.addSource('thailand-boundary', {
          type: 'geojson',
          data: geojsonData
        });

        // Add fill layer for Thailand
        map.current.addLayer({
          id: 'thailand-fill',
          type: 'fill',
          source: 'thailand-boundary',
          paint: {
            'fill-color': '#3b82f6', // blue-500
            'fill-opacity': 0.1
          }
        });

        // Add border layer for Thailand
        map.current.addLayer({
          id: 'thailand-line',
          type: 'line',
          source: 'thailand-boundary',
          paint: {
            'line-color': '#2563eb', // blue-600
            'line-width': 2,
            'line-opacity': 0.8
          }
        });
      } catch (error) {
        console.error('Error loading Thailand GeoJSON:', error);
      }

      // Add a custom HTML marker for the shop pin
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <div class="relative flex items-center justify-center w-10 h-10">
          <div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
          <div class="relative z-10 w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
        </div>
      `;

      new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([shopLng, shopLat])
        .setPopup(
          new maplibregl.Popup({ offset: 35, closeButton: false }).setHTML(
            `<div class="font-sans p-2">
               <h3 class="font-bold text-lg mb-1">${DEFAULT_SHOP_CONFIG.shopName}</h3>
               <p class="text-sm text-gray-600">${DEFAULT_SHOP_CONFIG.shopDescription}</p>
             </div>`
          )
        )
        .addTo(map.current);

      setIsMapLoaded(true);

      // Smooth zoom to the marker after a short delay
      setTimeout(() => {
        if (map.current) {
          map.current.flyTo({
            center: [shopLng, shopLat],
            zoom: 12,
            speed: 1.2,
            curve: 1.42,
            easing(t) {
              return t;
            }
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
    <div className="w-full flex-1 flex flex-col bg-background text-foreground pt-4 pb-12 sm:pt-8 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto w-full space-y-6 sm:space-y-8">
        
        {/* Header Section */}
        <div className="space-y-2 mt-4 md:mt-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">ข้อมูลร้านค้า (Shop Info)</h1>
          <p className="text-muted text-sm sm:text-base max-w-2xl">
            ตรวจสอบข้อมูลสถานที่ตั้ง เวลาทำการ และข้อมูลการติดต่อของเราผ่านแผนที่แบบ Interactive
          </p>
        </div>

        {/* Map Section */}
        <div className="w-full h-full min-h-[600px] flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden bg-surface border border-border">
          {/* Sidebar Info */}
          <div className="w-full md:w-1/3 bg-surface-alt p-6 sm:p-8 flex flex-col border-b md:border-b-0 md:border-r border-border z-10 shrink-0">
            <div className="mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 tracking-tight">{DEFAULT_SHOP_CONFIG.shopName}</h2>
              <p className="text-muted text-sm leading-relaxed">{DEFAULT_SHOP_CONFIG.shopDescription}</p>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-border/50">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">เวลาทำการ</p>
                  <p className="text-sm text-muted">
                    เปิด {DEFAULT_SHOP_CONFIG.operatingHours.open} น. - ปิด {DEFAULT_SHOP_CONFIG.operatingHours.close} น.
                  </p>
                  <p className="text-xs text-emerald-500 mt-1 font-medium bg-emerald-500/10 inline-block px-2 py-0.5 rounded-full">เปิดให้บริการทุกวัน</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-border/50">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">ติดต่อสอบถาม</p>
                  <p className="text-sm text-muted">02-XXX-XXXX</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-border/50">
                <Navigation className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">สถานที่ตั้ง</p>
                  <p className="text-sm text-muted leading-relaxed">
                    ใจกลางกรุงเทพมหานคร เดินทางสะดวกด้วยรถไฟฟ้า BTS
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                if (map.current) {
                  map.current.flyTo({ center: [shopLng, shopLat], zoom: 16 });
                }
              }}
              className="w-full mt-6 py-3.5 bg-foreground text-background font-semibold rounded-xl hover:bg-foreground/90 transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" /> ดูตำแหน่งร้านค้า
            </button>
          </div>

          {/* Map Container */}
          <div className="w-full md:w-2/3 h-[400px] md:h-auto relative bg-slate-100 dark:bg-slate-800">
            {!isMapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-surface/80 backdrop-blur-sm">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div ref={mapContainer} className="w-full h-full absolute inset-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
