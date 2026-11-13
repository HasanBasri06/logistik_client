<template>
  <div class="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100" :style="{ height: `${height}px` }">
    <div ref="mapEl" class="absolute inset-0 z-0" :class="{ 'pointer-events-none': !interactive }"></div>
    <div
      v-if="caption"
      class="absolute left-2.5 bottom-2.5 z-[400] max-w-[75%] truncate rounded-full bg-slate-900/80 px-3 py-1 text-xs font-bold text-white"
    >
      {{ caption }}
    </div>
  </div>
</template>

<script setup>
/**
 * Yük sahibinin ilan detayında: onaylanmış işin rotası ve aracın anlık konumu (Leaflet / OpenStreetMap).
 * Nereden → nereye il/ilçe merkezlerinden, rota OSRM'den; araç `vehicle` değiştikçe yerinde hareket eder.
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  /** "İl / İlçe" */
  from: { type: String, required: true },
  to: { type: String, required: true },
  /** { lat, lng } ya da null */
  vehicle: { type: Object, default: null },
  caption: { type: String, default: '' },
  /** false: resim gibi (sürükleme / yakınlaştırma yok) — İşlerin Durumu kartları */
  interactive: { type: Boolean, default: true },
  /** Araç konumu yoksa ikon yükleme noktasında (yük sahibi: yükü orada bekliyor) */
  vehicleAtOriginWhenUnknown: { type: Boolean, default: true },
  /** Araç işaretinin ipucu yazısı */
  vehicleLabel: { type: String, default: 'Yükünüz' },
  /** Harita yüksekliği (px) */
  height: { type: Number, default: 220 },
});

const mapEl = ref(null);
let map = null;
let vehicleMarker = null;
let routeBounds = null;

const dot = (color, size = 14) =>
  L.divIcon({
    className: '',
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

const vehicleIcon = L.divIcon({
  className: '',
  html: '<span style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#FF4F6D;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);color:#fff"><i class="pi pi-truck" style="font-size:14px"></i></span>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

async function geocode(label) {
  const [city, district] = String(label ?? '').split(' / ').map((s) => s.trim());
  if (!city) return null;
  const queries = [[city, district, 'Türkiye'].filter(Boolean).join(', '), `${city}, Türkiye`];
  for (const q of [...new Set(queries)]) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=tr`,
        { headers: { 'Accept-Language': 'tr' } }
      );
      const item = (await res.json())?.[0];
      if (item?.lat != null && item?.lon != null) return [parseFloat(item.lat), parseFloat(item.lon)];
    } catch (_) {
      /* sonraki sorgu */
    }
  }
  return null;
}

async function routeLine(a, b) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=simplified&geometries=geojson`;
    const data = await (await fetch(url)).json();
    const coords = data?.routes?.[0]?.geometry?.coordinates;
    if (Array.isArray(coords) && coords.length > 1) return coords.map(([lng, lat]) => [lat, lng]);
  } catch (_) {
    /* düz çizgiye düş */
  }
  return [a, b];
}

/** Yükleme noktası: araç konumu henüz yoksa (iş başlamadı / ilk konum gelmedi) araç ikonu burada durur */
let originLatLng = null;

function placeVehicle() {
  if (!map) return;
  const v = props.vehicle;
  const ll =
    v?.lat != null && v?.lng != null
      ? [Number(v.lat), Number(v.lng)]
      : props.vehicleAtOriginWhenUnknown
        ? originLatLng
        : null;
  if (!ll) {
    vehicleMarker?.remove();
    vehicleMarker = null;
    return;
  }
  if (vehicleMarker) vehicleMarker.setLatLng(ll);
  else {
    vehicleMarker = L.marker(ll, { icon: vehicleIcon, zIndexOffset: 1000 }).addTo(map);
    vehicleMarker.bindTooltip(props.vehicleLabel);
  }
}

function fitAll() {
  if (!map) return;
  const pts = [];
  if (routeBounds) pts.push(routeBounds.getSouthWest(), routeBounds.getNorthEast());
  if (vehicleMarker) pts.push(vehicleMarker.getLatLng());
  if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding: [28, 28] });
}

onMounted(async () => {
  const interactive = props.interactive;
  map = L.map(mapEl.value, {
    zoomControl: interactive,
    attributionControl: false,
    scrollWheelZoom: false,
    dragging: interactive,
    doubleClickZoom: interactive,
    touchZoom: interactive,
    boxZoom: interactive,
    keyboard: interactive,
  }).setView([39, 35], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

  const [a, b] = await Promise.all([geocode(props.from), geocode(props.to)]);
  if (!map) return;
  originLatLng = a;
  if (a && b) {
    const line = await routeLine(a, b);
    if (!map) return;
    const poly = L.polyline(line, { color: '#00A0AE', weight: 5, opacity: 0.85 }).addTo(map);
    routeBounds = poly.getBounds();
    L.marker(a, { icon: dot('#00A0AE') }).addTo(map).bindTooltip(props.from);
    L.marker(b, { icon: dot('#FF4F6D') }).addTo(map).bindTooltip(props.to);
  }
  placeVehicle();
  fitAll();
});

// Araç hareket ettikçe yalnızca işaret taşınır (kullanıcı haritayı serbestçe gezebilir)
watch(
  () => [props.vehicle?.lat, props.vehicle?.lng],
  () => placeVehicle()
);

onBeforeUnmount(() => {
  map?.remove();
  map = null;
  vehicleMarker = null;
});
</script>
