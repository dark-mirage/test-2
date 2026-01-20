"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import Button from "@/components/ui/Button";
import {
  CalendarDays,
  Clock,
  CreditCard,
  Hourglass,
  MapPin,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import cn from "clsx";

/**
 * @typedef {Object} DaDataSuggestAddressResponse
 * @property {{ value?: string, data?: { geo_lat?: (string|null), geo_lon?: (string|null), region_with_type?: string, city_with_type?: string, settlement_with_type?: string, area_with_type?: string, country?: string } }[]=} suggestions
 *
 * @typedef {{ id: string, title: string, subtitle: string, lat: (number|null), lon: (number|null) }} SuggestItem
 * @typedef {{ id: string, provider: string, address: string, deliveryText: string, priceText: string, lat: number, lon: number }} PvzPoint
 * @typedef {{ lat: number, lon: number }} LatLon
 */

function distanceKm(a, b) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

const PVZ_PROVIDERS = ["Яндекс Доставка", "CDEK", "Boxberry", "Почта России"];

function generateTestPvzPoints(count) {
  const cities = [
    { city: "Москва", lat: 55.751244, lon: 37.618423 },
    { city: "Санкт-Петербург", lat: 59.938732, lon: 30.316229 },
    { city: "Новосибирск", lat: 55.030199, lon: 82.92043 },
    { city: "Екатеринбург", lat: 56.838011, lon: 60.597465 },
    { city: "Казань", lat: 55.796127, lon: 49.106414 },
    { city: "Нижний Новгород", lat: 56.326944, lon: 44.0075 },
    { city: "Самара", lat: 53.195873, lon: 50.100193 },
    { city: "Омск", lat: 54.989342, lon: 73.368212 },
    { city: "Ростов-на-Дону", lat: 47.235713, lon: 39.701505 },
    { city: "Уфа", lat: 54.738762, lon: 55.972055 },
    { city: "Красноярск", lat: 56.010563, lon: 92.852572 },
    { city: "Воронеж", lat: 51.660781, lon: 39.200269 },
    { city: "Пермь", lat: 58.010455, lon: 56.229443 },
    { city: "Волгоград", lat: 48.708048, lon: 44.513303 },
    { city: "Краснодар", lat: 45.03547, lon: 38.975313 },
    { city: "Саратов", lat: 51.533103, lon: 46.034158 },
    { city: "Тюмень", lat: 57.153033, lon: 65.534328 },
    { city: "Тольятти", lat: 53.507836, lon: 49.420393 },
    { city: "Ижевск", lat: 56.852744, lon: 53.211396 },
    { city: "Барнаул", lat: 53.347997, lon: 83.779806 },
    { city: "Иркутск", lat: 52.286387, lon: 104.28066 },
    { city: "Хабаровск", lat: 48.480223, lon: 135.071917 },
    { city: "Владивосток", lat: 43.115536, lon: 131.885485 },
    { city: "Ярославль", lat: 57.626074, lon: 39.88447 },
    { city: "Сочи", lat: 43.585472, lon: 39.723098 },
    { city: "Калининград", lat: 54.710426, lon: 20.452214 },
    { city: "Мурманск", lat: 68.970682, lon: 33.074981 },
    { city: "Севастополь", lat: 44.61665, lon: 33.525367 },
  ];

  const streets = [
    "Ленина ул",
    "Советская ул",
    "Мира ул",
    "Победы ул",
    "Школьная ул",
    "Набережная ул",
    "Садовая ул",
    "Центральная ул",
    "Парковая ул",
    "Зеленая ул",
  ];

  const deliveryTextByProvider = {
    "Яндекс Доставка": "Доставка 1-3 дня",
    CDEK: "Доставка 2-5 дней",
    Boxberry: "Доставка 2-6 дней",
    "Почта России": "Доставка 3-7 дней",
  };

  const points = [];

  const mulberry32 = (seed) => {
    let t = seed >>> 0;
    return () => {
      t += 0x6d2b79f5;
      let x = Math.imul(t ^ (t >>> 15), 1 | t);
      x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  };

  const perCityBase = Math.floor(count / cities.length);
  const remainder = count % cities.length;
  let globalIndex = 0;

  for (let cityIndex = 0; cityIndex < cities.length; cityIndex++) {
    const city = cities[cityIndex];
    const cityCount = perCityBase + (cityIndex < remainder ? 1 : 0);

    for (let j = 0; j < cityCount; j++) {
      if (globalIndex >= count) break;

      // Cycle providers inside each city so every city has all 4 types.
      const provider = PVZ_PROVIDERS[j % PVZ_PROVIDERS.length];
      const street = streets[(globalIndex + cityIndex) % streets.length];
      const house = 1 + ((globalIndex * 7) % 140);
      const building = 1 + (globalIndex % 5);

      const rand = mulberry32(cityIndex * 10_000 + j + 1);
      const angle = rand() * Math.PI * 2;
      const radius = 0.01 + rand() * 0.18; // ~1km..20km (rough)
      const dLat = Math.sin(angle) * radius;
      const dLon =
        Math.cos(angle) * radius * Math.cos((city.lat * Math.PI) / 180);

      const lat = city.lat + dLat;
      const lon = city.lon + dLon;

      const price = 199 + ((globalIndex * 37) % 1200);

      points.push({
        id: `pvz-${globalIndex + 1}`,
        provider,
        address: `${city.city}, ${street}, д. ${house}, стр. ${building}`,
        deliveryText: deliveryTextByProvider[provider],
        priceText: `Стоимость — ${price}₽`,
        lat,
        lon,
      });

      globalIndex++;
    }
  }

  return points;
}

export default function CheckoutPickupPage() {
  return (
    <Suspense fallback={<div className={styles.c1} />}>
      <CheckoutPickupPageInner />
    </Suspense>
  );
}

function CheckoutPickupPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const leafletRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const pvzClusterRef = useRef(null);
  const pvzPointsRef = useRef(null);
  const pvzPointByIdRef = useRef(null);
  const pvzMarkersRef = useRef(new Map());
  const pvzProviderByIdRef = useRef(new Map());
  const prevSelectedPvzIdRef = useRef(null);
  const userMarkerRef = useRef(null);
  const userAccuracyCircleRef = useRef(null);
  const geoWatchIdRef = useRef(null);
  const userEverCenteredRef = useRef(false);
  const initSeqRef = useRef(0);
  const iconFixedRef = useRef(false);

  const ensurePvzPoints = useCallback(() => {
    if (!pvzPointsRef.current) {
      pvzPointsRef.current = generateTestPvzPoints(500);
    }
    return pvzPointsRef.current;
  }, []);

  const ensurePvzIndex = useCallback(() => {
    if (!pvzPointByIdRef.current) {
      const index = new Map();
      for (const p of ensurePvzPoints()) index.set(p.id, p);
      pvzPointByIdRef.current = index;
    }
    return pvzPointByIdRef.current;
  }, [ensurePvzPoints]);

  const initialStep = useMemo(() => {
    const step = new URLSearchParams(searchParamsKey).get("step");
    if (step === "map" || step === "list" || step === "search") return step;
    return "search";
  }, [searchParamsKey]);

  const [step, setStep] = useState(initialStep);

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  const [pvzQuery, setPvzQuery] = useState("");

  const [activeProvider, setActiveProvider] = useState("all");

  const selectedPvzId = useMemo(() => {
    const id = new URLSearchParams(searchParamsKey).get("pvzId");
    return id && id.trim() ? id : null;
  }, [searchParamsKey]);

  const selectedPvz = useMemo(() => {
    if (!selectedPvzId) return null;
    return ensurePvzIndex().get(selectedPvzId) ?? null;
  }, [ensurePvzIndex, selectedPvzId]);

  const [isPvzModalOpen, setIsPvzModalOpen] = useState(() => {
    const initialId = new URLSearchParams(searchParamsKey).get("pvzId");
    return Boolean(initialId && initialId.trim());
  });

  useEffect(() => {
    if (step === "map" && selectedPvzId) {
      setIsPvzModalOpen(true);
    }
  }, [step, selectedPvzId]);

  const [isUserTracking, setIsUserTracking] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const lastUserLocationRef = useRef(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const ctrl = new AbortController();

    const t = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/dadata/suggest/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, count: 10 }),
          signal: ctrl.signal,
        });

        if (!res.ok) {
          setSuggestions([]);
          return;
        }

        const data = await res.json();
        const s = data?.suggestions;
        setSuggestions(Array.isArray(s) ? s : []);
      } catch {
        if (ctrl.signal.aborted) return;
        setSuggestions([]);
      }
    }, 250);

    return () => {
      window.clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  const items = useMemo(() => {
    if (!query.trim()) return [];
    if (suggestions.length === 0) return [];

    return suggestions.map((x, index) => {
      const d = x.data;
      const subtitle =
        d?.city_with_type ||
        d?.settlement_with_type ||
        d?.area_with_type ||
        d?.country ||
        "";

      const latRaw = d?.geo_lat ?? null;
      const lonRaw = d?.geo_lon ?? null;
      const lat = latRaw == null ? null : Number(latRaw);
      const lon = lonRaw == null ? null : Number(lonRaw);

      return {
        id: `dadata-${index}`,
        title: x.value || query,
        subtitle,
        lat: Number.isFinite(lat) ? lat : null,
        lon: Number.isFinite(lon) ? lon : null,
      };
    });
  }, [query, suggestions]);

  const replacePickupUrl = useCallback(
    (update) => {
      const params = new URLSearchParams(searchParamsKey);
      update(params);
      router.replace(`/checkout/pickup?${params.toString()}`);
    },
    [router, searchParamsKey],
  );

  const setStepAndUrl = (next) => {
    setStep(next);
    replacePickupUrl((params) => {
      params.set("step", next);
    });
  };

  const filteredPvz = useMemo(() => {
    if (step !== "list") return [];

    const allPoints = ensurePvzPoints();
    const q = pvzQuery.trim().toLowerCase();
    const base = !q
      ? allPoints
      : allPoints.filter((x) => {
          const hay = `${x.provider} ${x.address}`.toLowerCase();
          return hay.includes(q);
        });

    const providerFiltered =
      activeProvider === "all"
        ? base
        : base.filter((x) => x.provider === activeProvider);

    if (!userLocation) return providerFiltered;

    // Show nearest PVZ first once user's location is known.
    return [...providerFiltered].sort((a, b) => {
      const da = distanceKm(userLocation, { lat: a.lat, lon: a.lon });
      const db = distanceKm(userLocation, { lat: b.lat, lon: b.lon });
      return da - db;
    });
  }, [ensurePvzPoints, activeProvider, pvzQuery, step, userLocation]);

  const stopUserTracking = useCallback(() => {
    if (geoWatchIdRef.current != null) {
      try {
        navigator.geolocation.clearWatch(geoWatchIdRef.current);
      } catch {
        // ignore
      }
      geoWatchIdRef.current = null;
    }

    try {
      userMarkerRef.current?.remove();
    } catch {
      // ignore
    }
    userMarkerRef.current = null;

    try {
      userAccuracyCircleRef.current?.remove();
    } catch {
      // ignore
    }
    userAccuracyCircleRef.current = null;

    userEverCenteredRef.current = false;
    lastUserLocationRef.current = null;
    setUserLocation(null);
    setIsUserTracking(false);
  }, []);

  const selectPvzOnMap = useCallback(
    (pvzId) => {
      setIsPvzModalOpen(true);
      stopUserTracking();
      setStep("map");
      replacePickupUrl((params) => {
        params.set("step", "map");
        params.set("pvzId", pvzId);
        params.delete("address");
        params.delete("lat");
        params.delete("lon");
      });
    },
    [replacePickupUrl, stopUserTracking],
  );

  const openPvzPopup = useCallback(
    (pvzId) => {
      const marker = pvzMarkersRef.current.get(pvzId);
      if (!marker) return;

      if (isUserTracking) return;

      const map = mapRef.current;
      const panToMarker = () => {
        if (!map) return;
        try {
          const latlng = marker.getLatLng?.();
          if (!latlng) return;
          map.panTo(latlng, { animate: true });
        } catch {
          // ignore
        }
      };

      const cluster = pvzClusterRef.current;

      const tryOpen = () => {
        panToMarker();
      };

      if (cluster?.zoomToShowLayer) {
        try {
          cluster.zoomToShowLayer(marker, tryOpen);
          return;
        } catch {
          // ignore and fallback
        }
      }

      tryOpen();
    },
    [isUserTracking],
  );

  useEffect(() => {
    if (step !== "map") return;

    const cluster = pvzClusterRef.current;

    if (!cluster?.clearLayers) return;

    const enabledProviders = new Set(
      activeProvider === "all" ? PVZ_PROVIDERS : [activeProvider],
    );

    // Safety: keep selected PVZ visible even if filter doesn't match yet.
    if (selectedPvzId) {
      const selectedProvider = ensurePvzIndex().get(selectedPvzId)?.provider;
      if (selectedProvider) enabledProviders.add(selectedProvider);
    }

    const markers = [];
    for (const [id, marker] of pvzMarkersRef.current.entries()) {
      const provider = pvzProviderByIdRef.current.get(id);
      if (!provider) continue;
      if (!enabledProviders.has(provider)) continue;
      markers.push(marker);
    }

    try {
      cluster.clearLayers();
    } catch {
      // ignore
    }

    if (cluster.addLayers) {
      cluster.addLayers(markers);
    } else if (cluster.addLayer) {
      for (const m of markers) cluster.addLayer(m);
    }

    if (selectedPvzId) {
      requestAnimationFrame(() => openPvzPopup(selectedPvzId));
    }
  }, [openPvzPopup, activeProvider, ensurePvzIndex, selectedPvzId, step]);

  const startUserTracking = () => {
    setGeoError(null);

    const L = leafletRef.current;
    const map = mapRef.current;

    if (!L || !map) {
      setGeoError("Карта ещё загружается");
      return;
    }

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError("Геолокация недоступна в этом браузере");
      return;
    }

    // Ensure previous session is stopped
    stopUserTracking();
    setIsUserTracking(true);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const accuracy = Math.max(0, pos.coords.accuracy || 0);

        const latlng = [lat, lon];

        // Keep the latest user location for sorting PVZ list.
        const prev = lastUserLocationRef.current;
        const nextLoc = { lat, lon };
        // GPS can be noisy; avoid re-sorting PVZ list on tiny jitter.
        if (!prev || distanceKm(prev, nextLoc) > 0.03) {
          lastUserLocationRef.current = nextLoc;
          setUserLocation(nextLoc);
        }

        try {
          if (!userMarkerRef.current) {
            userMarkerRef.current = L.circleMarker(latlng, {
              radius: 6,
              color: "#111111",
              weight: 2,
              fillColor: "#111111",
              fillOpacity: 1,
            }).addTo(map);
          } else {
            // CircleMarker supports setLatLng
            userMarkerRef.current.setLatLng?.(latlng);
          }

          if (!userAccuracyCircleRef.current) {
            userAccuracyCircleRef.current = L.circle(latlng, {
              radius: accuracy,
              color: "#111111",
              weight: 1,
              opacity: 0.2,
              fillColor: "#111111",
              fillOpacity: 0.06,
            }).addTo(map);
          } else {
            userAccuracyCircleRef.current.setLatLng(latlng);
            userAccuracyCircleRef.current.setRadius(accuracy);
          }
        } catch {
          // ignore
        }

        // Follow user while tracking
        try {
          if (!userEverCenteredRef.current) {
            userEverCenteredRef.current = true;
            map.setView(latlng, Math.max(map.getZoom(), 14), { animate: true });
          } else {
            map.panTo(latlng, { animate: true });
          }
        } catch {
          // ignore
        }
      },
      (err) => {
        setGeoError(err.message || "Не удалось получить геолокацию");
        stopUserTracking();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10_000,
      },
    );

    geoWatchIdRef.current = watchId;
  };

  const destroyMap = useCallback(() => {
    stopUserTracking();

    try {
      markerRef.current?.remove();
    } catch {
      // ignore
    }
    markerRef.current = null;

    try {
      pvzClusterRef.current?.remove();
    } catch {
      // ignore
    }
    pvzClusterRef.current = null;
    pvzMarkersRef.current.clear();
    pvzProviderByIdRef.current.clear();
    prevSelectedPvzIdRef.current = null;

    try {
      mapRef.current?.remove();
    } catch {
      // ignore
    }
    mapRef.current = null;
  }, [stopUserTracking]);

  const getPvzMarkerIcon = useCallback((L, provider, isSelected) => {
    const bubble = isSelected ? 54 : 48;
    const tail = isSelected ? 16 : 14;
    const border = isSelected ? 3 : 2;
    const totalH = bubble + Math.floor(tail / 2);
    const tailTop = bubble - Math.floor(tail / 2);
    const shadow = isSelected
      ? "0 14px 30px rgba(0,0,0,0.30)"
      : "0 10px 22px rgba(0,0,0,0.22)";

    const iconHtml = (() => {
      switch (provider) {
        case "CDEK":
          return `
             <img src="/icons/global/CDEK.svg" alt="CDEK.svg" />
            `;
        case "Boxberry":
          return `
              <img src="/icons/global/boxberry.svg" alt="boxberry.svg" />
            `;
        case "Яндекс Доставка":
          return `
              <div style="
                font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
                font-weight: 800;
                font-size: 22px;
                line-height: 1;
                color: #FFFFFF;
                transform: translateY(-1px);
              ">Я</div>
            `;
        case "Почта России":
          return `
              <div style="
                font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
                font-weight: 800;
                font-size: 8px;
                line-height: 1.05;
                letter-spacing: 0.02em;
                text-transform: uppercase;
                color: #FFFFFF;
                text-align: center;
                transform: translateY(-1px);
              ">ПОЧТА<br/>РОССИИ</div>
            `;
        default:
          return "";
      }
    })();

    return L.divIcon({
      className: "pvz-div-icon",
      iconSize: [bubble, totalH],
      iconAnchor: [bubble / 2, totalH],
      html: `
          <div style="position:relative; width:${bubble}px; height:${totalH}px;">
            <div style="
              position:absolute;
              left:0;
              top:0;
              width:${bubble}px;
              height:${bubble}px;
              border-radius:9999px;
              background:#111111;
              border:${border}px solid #FFFFFF;
              box-shadow:${shadow};
              display:flex;
              align-items:center;
              justify-content:center;
            ">
              <div style=" display:flex; align-items:center; justify-content:center;">
                ${iconHtml}
              </div>
            </div>
            <div style="
              position:absolute;
              left:50%;
              top:${tailTop}px;
              width:${tail}px;
              height:${tail}px;
              background:#111111;
              border:${border}px solid #FFFFFF;
              transform: translateX(-50%) rotate(45deg);
              border-radius: 3px;
              box-shadow:${shadow};
            "></div>
          </div>
        `,
    });
  }, []);

  useEffect(() => {
    if (step !== "map") {
      destroyMap();
      return;
    }

    // If a map already exists, do not redo heavy init / imports.
    if (mapRef.current) return;

    const seq = ++initSeqRef.current;
    let cancelled = false;

    const init = async () => {
      const leafletModule = await import("leaflet");
      const L = leafletModule.default ?? leafletModule;

      // Marker clustering plugin patches Leaflet with markerClusterGroup().
      await import("leaflet.markercluster");

      if (cancelled || initSeqRef.current !== seq) return;

      leafletRef.current = L;

      if (!iconFixedRef.current) {
        try {
          // Fix default marker icon paths under bundlers
          const icon2x = (
            await import("leaflet/dist/images/marker-icon-2x.png")
          ).default;
          const icon1x = (await import("leaflet/dist/images/marker-icon.png"))
            .default;
          const shadow = (await import("leaflet/dist/images/marker-shadow.png"))
            .default;

          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: icon2x,
            iconUrl: icon1x,
            shadowUrl: shadow,
          });
        } catch {
          // ignore
        }

        iconFixedRef.current = true;
      }

      const el = document.getElementById("pickup-leaflet-map");
      if (!el) return;

      // If a map already exists, do not create a new one.
      if (mapRef.current) return;

      // Defensive: if some previous init left a leaflet id on the element.
      const anyEl = el;
      if (anyEl._leaflet_id) {
        try {
          delete anyEl._leaflet_id;
        } catch {
          anyEl._leaflet_id = undefined;
        }
      }

      const params = new URLSearchParams(searchParamsKey);

      const selectedFromUrl = params.get("pvzId");
      const pvzIndex = ensurePvzIndex();
      const selectedPoint = selectedFromUrl
        ? pvzIndex.get(selectedFromUrl)
        : undefined;

      const urlLat = Number(params.get("lat"));
      const urlLon = Number(params.get("lon"));
      const urlHasCenter = Number.isFinite(urlLat) && Number.isFinite(urlLon);

      const centerLat =
        selectedPoint?.lat ?? (urlHasCenter ? urlLat : 55.751244);
      const centerLon =
        selectedPoint?.lon ?? (urlHasCenter ? urlLon : 37.618423);

      const hasMarker = !selectedPoint && urlHasCenter;
      const hasSelectedPvz = Boolean(selectedPoint);

      const initialZoom = hasSelectedPvz ? 14 : hasMarker ? 12 : 10;

      const map = L.map(el, {
        zoomControl: false,
        attributionControl: false,
      }).setView([centerLat, centerLon], initialZoom);

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const markerClusterGroupFactory = L.markerClusterGroup;

      const clusterGroup = markerClusterGroupFactory
        ? markerClusterGroupFactory({
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            zoomToBoundsOnClick: true,
            maxClusterRadius: 52,
            chunkedLoading: true,
            iconCreateFunction: (cluster) => {
              const count = cluster.getChildCount();
              const size = count < 10 ? 34 : count < 100 ? 40 : 46;

              return L.divIcon({
                className: "",
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
                html: `<div style="
                  width:${size}px;
                  height:${size}px;
                  border-radius:9999px;
                  background: rgba(17,17,17,0.92);
                  color: #fff;
                  font-weight: 700;
                  font-size: 14px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  box-shadow: 0 10px 24px rgba(0,0,0,0.20);
                  border: 2px solid rgba(255,255,255,0.8);
                ">${count}</div>`,
              });
            },
          })
        : L.layerGroup();

      pvzClusterRef.current = clusterGroup;
      clusterGroup.addTo(map);

      const allPoints = ensurePvzPoints();
      const markers = [];

      // Create PVZ markers once; clustering will handle zoom-out aggregation.
      for (const point of allPoints) {
        pvzProviderByIdRef.current.set(point.id, point.provider);
        const isSelected = selectedFromUrl === point.id;

        const marker = L.marker([point.lat, point.lon], {
          icon: getPvzMarkerIcon(L, point.provider, isSelected),
          keyboard: false,
          title: `${point.provider} — ${point.address}`,
        }).on("click", () => {
          selectPvzOnMap(point.id);
        });

        pvzMarkersRef.current.set(point.id, marker);

        markers.push(marker);
      }

      const clusterAny = clusterGroup;

      if (clusterAny.addLayers) {
        clusterAny.addLayers(markers);
      } else if (clusterAny.addLayer) {
        for (const m of markers) clusterAny.addLayer(m);
      } else {
        for (const m of markers) m.addTo(clusterGroup);
      }

      // Do not add any non-PVZ marker when coming from Search.

      if (hasSelectedPvz && selectedFromUrl) {
        openPvzPopup(selectedFromUrl);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [
    step,
    searchParamsKey,
    destroyMap,
    ensurePvzIndex,
    ensurePvzPoints,
    getPvzMarkerIcon,
    openPvzPopup,
    selectPvzOnMap,
  ]);

  useEffect(() => {
    if (step !== "map") return;
    const L = leafletRef.current;
    if (!L) return;

    const prev = prevSelectedPvzIdRef.current;
    if (prev && prev !== selectedPvzId) {
      const prevMarker = pvzMarkersRef.current.get(prev);
      const prevProvider = pvzProviderByIdRef.current.get(prev);
      if (prevMarker && prevProvider) {
        try {
          prevMarker.setIcon(getPvzMarkerIcon(L, prevProvider, false));
        } catch {
          // ignore
        }
      }
    }

    if (selectedPvzId) {
      const marker = pvzMarkersRef.current.get(selectedPvzId);
      const provider = pvzProviderByIdRef.current.get(selectedPvzId);
      if (marker && provider) {
        try {
          marker.setIcon(getPvzMarkerIcon(L, provider, true));
        } catch {
          // ignore
        }
      }
    }

    prevSelectedPvzIdRef.current = selectedPvzId;
  }, [step, selectedPvzId, getPvzMarkerIcon]);

  useEffect(() => {
    if (step !== "map") return;

    if (isUserTracking) return;

    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    const params = new URLSearchParams(searchParamsKey);

    const selectedFromUrl = params.get("pvzId");
    const pvzIndex = ensurePvzIndex();
    const selectedPoint = selectedFromUrl
      ? pvzIndex.get(selectedFromUrl)
      : undefined;

    const urlLat = Number(params.get("lat"));
    const urlLon = Number(params.get("lon"));
    const urlHasCenter = Number.isFinite(urlLat) && Number.isFinite(urlLon);

    // When closing the PVZ modal we remove `pvzId`. In that case we must not
    // re-center the map to a default location; keep the current view.
    if (!selectedPoint && !urlHasCenter) return;

    const centerLat = selectedPoint?.lat ?? (urlHasCenter ? urlLat : 55.751244);
    const centerLon = selectedPoint?.lon ?? (urlHasCenter ? urlLon : 37.618423);

    const hasMarker = !selectedPoint && urlHasCenter;
    const hasSelectedPvz = Boolean(selectedPoint);

    // UX: never auto-zoom-out, only zoom-in when needed.
    const desiredZoom = hasSelectedPvz ? 14 : hasMarker ? 12 : 10;
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    const eps = 1e-6;
    const needsMove =
      Math.abs(currentCenter.lat - centerLat) > eps ||
      Math.abs(currentCenter.lng - centerLon) > eps;
    const nextZoom = Math.max(currentZoom, desiredZoom);
    const needsZoomIn = currentZoom < nextZoom;

    if (needsMove || needsZoomIn) {
      map.setView([centerLat, centerLon], nextZoom, { animate: true });
    }

    // Do not add any non-PVZ marker when coming from Search.

    if (hasSelectedPvz && selectedFromUrl) {
      openPvzPopup(selectedFromUrl);
    }
  }, [ensurePvzIndex, openPvzPopup, step, searchParamsKey, isUserTracking]);

  useEffect(() => {
    if (step !== "map") {
      stopUserTracking();
    }

    return () => {
      stopUserTracking();
    };
  }, [step, stopUserTracking]);

  const Toggle = (
    <div className={styles.c2}>
      <button
        type="button"
        aria-pressed={step === "map"}
        className={cn(
          styles.toggleButton,
          step === "map"
            ? styles.toggleButtonActive
            : styles.toggleButtonInactive,
        )}
        onClick={() => setStepAndUrl("map")}
      >
        На карте
      </button>
      <button
        type="button"
        aria-pressed={step === "list"}
        className={cn(
          styles.toggleButton,
          step === "list"
            ? styles.toggleButtonActive
            : styles.toggleButtonInactive,
        )}
        onClick={() => setStepAndUrl("list")}
      >
        Списком
      </button>
    </div>
  );

  if (step === "map") {
    const ProviderIcon = ({ provider }) => {
      if (provider === "CDEK") {
        return (
          <img src="/icons/global/CDEK.svg" alt="" width={16} height={16} />
        );
      }

      if (provider === "Boxberry") {
        return (
          <img src="/icons/global/boxberry.svg" alt="" width={16} height={16} />
        );
      }

      if (provider === "Яндекс Доставка") {
        return (
          <span className={cn(styles.c3, styles.tw1, styles.fontExtraBold)}>
            Я
          </span>
        );
      }

      return (
        <span className={cn(styles.c4, styles.fontExtraBold)}>
          Почта
          <br />
          России
        </span>
      );
    };

    const ProviderChips = (
      <div className={styles.c5}>
        <div className={cn(styles.c6, styles.tw2, styles.noScrollbar)}>
          <button
            type="button"
            aria-pressed={activeProvider === "all"}
            onClick={() => setActiveProvider("all")}
            className={cn(
              styles.providerChip,
              activeProvider === "all"
                ? styles.providerChipActive
                : styles.providerChipInactive,
            )}
          >
            <span className={cn(styles.c7, styles.tw3)}>
              <span className={cn(styles.c8, styles.tw4)}>
                <span className={cn(styles.c9, styles.tw5)} />
                <span className={cn(styles.c10, styles.tw6)} />
                <span className={cn(styles.c11, styles.tw7)} />
                <span className={cn(styles.c12, styles.tw8)} />
              </span>
            </span>
            <span className={cn(styles.c13, styles.nowrap)}>Все</span>
          </button>
          {PVZ_PROVIDERS.map((p) => {
            const isOn = activeProvider === p;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={isOn}
                onClick={() => setActiveProvider(p)}
                className={cn(
                  styles.providerChip,
                  isOn
                    ? styles.providerChipActive
                    : styles.providerChipInactive,
                )}
              >
                <span className={cn(styles.c14, styles.tw9)}>
                  <ProviderIcon provider={p} />
                </span>
                <span className={cn(styles.c15, styles.nowrap)}>
                  {p === "Яндекс Доставка"
                    ? "Яндекс"
                    : p === "Почта России"
                      ? "Почта"
                      : p}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );

    return (
      <div className={styles.c16}>
        <div className={cn(styles.c17, styles.tw10)}>
          <div id="pickup-leaflet-map" className={styles.c18} />

          <button
            type="button"
            aria-label="Определить моё местоположение"
            aria-pressed={isUserTracking}
            onClick={() =>
              isUserTracking ? stopUserTracking() : startUserTracking()
            }
            className={cn(
              styles.geoButton,
              isUserTracking && styles.geoButtonActive,
            )}
          >
            <img src="/icons/global/Vector.svg" alt="" />
          </button>

          {geoError ? (
            <div className={cn(styles.c19, styles.tw11)}>
              <div className={cn(styles.c20, styles.tw12)}>{geoError}</div>
            </div>
          ) : null}

          <div className={cn(styles.c21, styles.tw13)}>
            <div className={cn(styles.c22, styles.tw14)}>{Toggle}</div>
          </div>
        </div>

        {selectedPvz && isPvzModalOpen ? (
          <div
            className={cn(styles.c23, styles.tw15, styles.leftHalf)}
            style={{ zIndex: 2000 }}
          >
            <div className={styles.c24}>
              <div className={cn(styles.c25)}>
                <div className={styles.c26}>
                  <div className={cn(styles.c27, styles.tw16)} />
                </div>

                <div className={styles.c28}>
                  <div className={cn(styles.c29, styles.tw17)}>
                    <div className={cn(styles.c30)}>{selectedPvz.provider}</div>
                    <button
                      type="button"
                      aria-label="Закрыть"
                      onClick={() => setIsPvzModalOpen(false)}
                      className={cn(styles.c31, styles.tw18)}
                    >
                      <img
                        src="/icons/global/xicon.svg"
                        alt=""
                        className={cn(styles.c32, styles.tw19)}
                      />
                    </button>
                  </div>

                  <div className={cn(styles.c33, styles.spaceY3)}>
                    <div className={cn(styles.c34, styles.tw20)}>
                      <MapPin className={cn(styles.c35, styles.tw21)} />
                      <div className={styles.c36}>{selectedPvz.address}</div>
                    </div>

                    <div className={cn(styles.c37, styles.tw22)}>
                      <CalendarDays className={cn(styles.c38, styles.tw23)} />
                      <div className={styles.c39}>
                        {selectedPvz.deliveryText}
                      </div>
                    </div>

                    <div className={cn(styles.c40, styles.tw24)}>
                      <Clock className={cn(styles.c41, styles.tw25)} />
                      <div className={cn(styles.c42, styles.tw26)}>
                        <div>Понедельник</div>
                        <div className={cn(styles.c43, styles.tw27)}>
                          08:30–20:00
                        </div>

                        <div>Вторник</div>
                        <div className={cn(styles.c44, styles.tw28)}>
                          08:30–20:00
                        </div>

                        <div>Среда</div>
                        <div className={cn(styles.c45, styles.tw29)}>
                          08:30–20:00
                        </div>

                        <div>Четверг</div>
                        <div className={cn(styles.c46, styles.tw30)}>
                          08:30–20:00
                        </div>

                        <div>Пятница</div>
                        <div className={cn(styles.c47, styles.tw31)}>
                          08:30–20:00
                        </div>

                        <div>Суббота</div>
                        <div className={cn(styles.c48, styles.tw32)}>
                          08:30–20:00
                        </div>

                        <div>Воскресенье</div>
                        <div className={cn(styles.c49, styles.tw33)}>
                          08:30–20:00
                        </div>
                      </div>
                    </div>

                    <div className={cn(styles.c50, styles.tw34)}>
                      <Hourglass className={cn(styles.c51, styles.tw35)} />
                      <div className={styles.c52}>Срок хранения — 7 дней</div>
                    </div>

                    <div className={cn(styles.c53, styles.tw36)}>
                      <CreditCard className={cn(styles.c54, styles.tw37)} />
                      <div className={styles.c55}>{selectedPvz.priceText}</div>
                    </div>
                  </div>

                  <div className={styles.c56}>
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      className={styles.c57}
                      onClick={() => {
                        if (!selectedPvz) return;
                        const params = new URLSearchParams();
                        params.set("pickupPvzId", selectedPvz.id);
                        params.set("pickupProvider", selectedPvz.provider);
                        params.set("pickupAddress", selectedPvz.address);
                        router.push(`/checkout?${params.toString()}`);
                      }}
                    >
                      Доставить сюда
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={cn(styles.c58, styles.tw38, styles.leftHalf)}>
            <div className={styles.c59}>{ProviderChips}</div>
            <Button
              type="button"
              variant="primary"
              size="lg"
              className={styles.c60}
              onClick={() => setStepAndUrl("search")}
            >
              Поиск города
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (step === "search") {
    return (
      <div className={styles.c61}>
        <div className={styles.c62}>
          <div className={cn(styles.c63, styles.tw39)}>
            <img
              src="/icons/global/Search.svg"
              alt="search"
              className={cn(styles.c64, styles.tw40)}
            />
            <input
              value={query}
              onChange={(e) => {
                const next = e.target.value;
                setQuery(next);
                if (!next.trim()) {
                  setSuggestions([]);
                }
              }}
              className={cn(styles.c65, styles.tw41)}
              placeholder="Адрес"
            />
            {query.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                }}
                className={cn(styles.c66, styles.tw42)}
                aria-label="Clear"
              >
                <img
                  src="/icons/global/xicon.svg"
                  alt="clear"
                  className={cn(styles.c67, styles.tw43)}
                />
              </button>
            ) : null}
          </div>
        </div>

        <div className={styles.c68}>
          {items.map((p, idx) => (
            <button
              type="button"
              key={p.id}
              onClick={() => {
                stopUserTracking();
                const params = new URLSearchParams();
                params.set("step", "map");
                params.set("address", p.title);
                if (p.lat != null) params.set("lat", String(p.lat));
                if (p.lon != null) params.set("lon", String(p.lon));

                router.replace(`/checkout/pickup?${params.toString()}`);
                setStep("map");
              }}
              className={cn(
                styles.searchItem,
                idx === items.length - 1 ? null : styles.searchItemBorder,
              )}
            >
              <img
                src="/icons/global/location.svg"
                alt="location"
                className={cn(styles.c69, styles.tw44)}
              />
              <div className={cn(styles.c70, styles.tw45)}>
                <div className={styles.c71}>{p.title}</div>
                {p.subtitle ? (
                  <div className={styles.c72}>{p.subtitle}</div>
                ) : null}
              </div>
            </button>
          ))}

          {query.trim() && items.length === 0 ? (
            <div className={styles.c73}>Ничего не найдено</div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.c74}>
      <div className={styles.c75}>
        <div className={styles.c76}>{Toggle}</div>
        <div className={cn(styles.c77, styles.tw46)}>
          <img
            src="/icons/global/Search.svg"
            alt="search"
            className={cn(styles.c78, styles.tw47)}
          />
          <input
            value={pvzQuery}
            onChange={(e) => setPvzQuery(e.target.value)}
            className={cn(styles.c79, styles.tw48)}
            placeholder="Адрес"
          />
          {pvzQuery.length > 0 ? (
            <button
              type="button"
              onClick={() => setPvzQuery("")}
              className={cn(styles.c80, styles.tw49)}
              aria-label="Clear"
            >
              <img
                src="/icons/global/xicon.svg"
                alt="clear"
                className={cn(styles.c81, styles.tw50)}
              />
            </button>
          ) : null}
        </div>
      </div>

      <div className={styles.c82}>
        {filteredPvz.map((p, idx) => {
          const isActive = selectedPvzId === p.id;

          return (
            <button
              type="button"
              key={p.id}
              aria-pressed={isActive}
              onClick={() => {
                selectPvzOnMap(p.id);
              }}
              className={cn(
                styles.pvzListItem,
                isActive
                  ? styles.pvzListItemActive
                  : styles.pvzListItemInactive,
                idx === filteredPvz.length - 1
                  ? null
                  : styles.pvzListItemBorder,
              )}
            >
              <div className={cn(styles.c83, styles.tw51)}>
                <div className={cn(styles.c84)}>{p.provider}</div>
                <div className={styles.c85}>{p.address}</div>
                <div className={styles.c86}>{p.deliveryText}</div>
                <div className={styles.c87}>{p.priceText}</div>
              </div>
            </button>
          );
        })}

        {filteredPvz.length === 0 ? (
          <div className={styles.c88}>Ничего не найдено</div>
        ) : null}
      </div>
    </div>
  );
}
