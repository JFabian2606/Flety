import {
    MapContainer,
    Marker,
    Polygon,
    Polyline,
    Popup,
    TileLayer,
    useMap,
    useMapEvents,
} from 'react-leaflet';
import { Fragment, useEffect, useState } from 'react';
import L from 'leaflet';
import { colombiaBoundary } from '@/Data/colombiaBoundary';

const defaultCenter = [4.5709, -74.2973];
const colombiaBounds = [
    [-4.5, -82.2],
    [13.8, -66.7],
];

const markerIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const colombiaBoundaryStyle = {
    color: '#16733c',
    dashArray: '8 7',
    fillColor: '#4f9547',
    fillOpacity: 0.08,
    opacity: 0.95,
    weight: 2.4,
};

const routeColors = [
    '#1677ff',
    '#f97316',
    '#8b5cf6',
    '#dc2626',
    '#0891b2',
    '#65a30d',
    '#be123c',
    '#7c3aed',
    '#0f766e',
    '#ca8a04',
];

function isInsideColombiaBounds(lat, lng) {
    const numericLat = Number(lat);
    const numericLng = Number(lng);

    return (
        Number.isFinite(numericLat) &&
        Number.isFinite(numericLng) &&
        numericLat >= colombiaBounds[0][0] &&
        numericLat <= colombiaBounds[1][0] &&
        numericLng >= colombiaBounds[0][1] &&
        numericLng <= colombiaBounds[1][1]
    );
}

function MapClickSelector({ mode, onSelectPoint }) {
    useMapEvents({
        click(event) {
            if (!onSelectPoint) {
                return;
            }

            if (!isInsideColombiaBounds(event.latlng.lat, event.latlng.lng)) {
                return;
            }

            onSelectPoint({
                type: mode,
                lat: Number(event.latlng.lat.toFixed(7)),
                lng: Number(event.latlng.lng.toFixed(7)),
            });
        },
    });

    return null;
}

function hasPoint(lat, lng) {
    return Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));
}

function routePositions(route) {
    if (Array.isArray(route.route_geometry) && route.route_geometry.length >= 2) {
        return route.route_geometry
            .map((point) => [Number(point[1]), Number(point[0])])
            .filter(([lat, lng]) => hasPoint(lat, lng));
    }
    return [];
}

// Global cache for OSRM routes to avoid duplicate fetches
const osrmCache = new Map();

function useOsrmGeometry(route) {
    const [geometry, setGeometry] = useState(null);

    useEffect(() => {
        const hasGeom = Array.isArray(route.route_geometry) && route.route_geometry.length >= 2;
        if (hasGeom) {
            setGeometry(route.route_geometry);
            return;
        }

        if (!hasPoint(route.origin_lat, route.origin_lng) || !hasPoint(route.destination_lat, route.destination_lng)) {
            return;
        }

        const cacheKey = `${route.origin_lng},${route.origin_lat};${route.destination_lng},${route.destination_lat}`;
        
        if (osrmCache.has(cacheKey)) {
            setGeometry(osrmCache.get(cacheKey));
            return;
        }

        // Fetch from public OSRM
        const url = `https://router.project-osrm.org/route/v1/driving/${route.origin_lng},${route.origin_lat};${route.destination_lng},${route.destination_lat}?overview=full&geometries=geojson`;
        
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.code === 'Ok' && data.routes?.[0]?.geometry?.coordinates) {
                    const coords = data.routes[0].geometry.coordinates;
                    osrmCache.set(cacheKey, coords);
                    setGeometry(coords);
                }
            })
            .catch(() => {});
    }, [route]);

    if (!geometry) return [];
    
    return geometry
        .map((point) => [Number(point[1]), Number(point[0])])
        .filter(([lat, lng]) => hasPoint(lat, lng));
}

function RoutePolyline({ route, color }) {
    const positions = useOsrmGeometry(route);
    
    if (positions.length < 2) return null;

    return (
        <Polyline
            positions={positions}
            pathOptions={{
                color,
                opacity: 0.92,
                weight: 5,
            }}
        />
    );
}

function routeColor(index) {
    return routeColors[index % routeColors.length];
}

function createNumberedMarkerIcon(color, number) {
    return L.divIcon({
        className: '',
        html: `
            <div style="
                align-items:center;
                background:${color};
                border:2px solid white;
                border-radius:999px;
                box-shadow:0 10px 24px rgba(15,23,42,.28);
                color:white;
                display:flex;
                font-size:12px;
                font-weight:800;
                height:28px;
                justify-content:center;
                line-height:1;
                width:28px;
            ">${number}</div>
        `,
        iconAnchor: [14, 14],
        iconSize: [28, 28],
    });
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function createEndpointMarkerIcon(color, label, title, align = 'right') {
    const safeLabel = escapeHtml(label);
    const safeTitle = escapeHtml(title);
    const isLeftAligned = align === 'left';

    return L.divIcon({
        className: '',
        html: `
            <div style="
                align-items:center;
                display:flex;
                flex-direction:${isLeftAligned ? 'row-reverse' : 'row'};
                gap:10px;
                justify-content:${isLeftAligned ? 'flex-end' : 'flex-start'};
                max-width:190px;
                pointer-events:none;
            ">
                <div style="
                    align-items:center;
                    background:${color};
                    border:3px solid white;
                    border-radius:999px;
                    box-shadow:0 12px 28px rgba(15,23,42,.24);
                    display:flex;
                    height:34px;
                    justify-content:center;
                    width:34px;
                ">
                    <div style="
                        background:white;
                        border-radius:999px;
                        height:10px;
                        width:10px;
                    "></div>
                </div>
                <div style="
                    background:white;
                    border:1px solid rgba(17,94,49,.14);
                    border-radius:10px;
                    box-shadow:0 14px 32px rgba(15,23,42,.16);
                    color:#203029;
                    min-width:108px;
                    padding:8px 10px;
                ">
                    <div style="
                        color:#087443;
                        font-size:11px;
                        font-weight:800;
                        line-height:1;
                        margin-bottom:5px;
                    ">${safeLabel}</div>
                    <div style="
                        font-size:12px;
                        font-weight:700;
                        line-height:1.25;
                        max-width:132px;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                    ">${safeTitle}</div>
                </div>
            </div>
        `,
        iconAnchor: [isLeftAligned ? 173 : 17, 17],
        iconSize: [190, 52],
    });
}

function FitRouteBounds({ routes, originPoint, destinationPoint, draftRoute }) {
    const map = useMap();

    useEffect(() => {
        const points = routes.flatMap((route) => routePositions(route));
        points.push(...routePositions(draftRoute ?? {}));

        if (hasPoint(originPoint?.lat, originPoint?.lng)) {
            points.push([Number(originPoint.lat), Number(originPoint.lng)]);
        }

        if (hasPoint(destinationPoint?.lat, destinationPoint?.lng)) {
            points.push([Number(destinationPoint.lat), Number(destinationPoint.lng)]);
        }

        if (points.length === 0) {
            return;
        }

        if (points.length === 1) {
            map.setView(points[0], 9);

            return;
        }

        map.fitBounds(L.latLngBounds(points), {
            maxZoom: 11,
            padding: [32, 32],
        });
    }, [destinationPoint, draftRoute, map, originPoint, routes]);

    return null;
}

export default function RouteMap({
    routes = [],
    selectedRouteId = null,
    originPoint = null,
    destinationPoint = null,
    selectable = false,
    selectionMode = 'origin',
    onSelectPoint = null,
    draftRoute = null,
    height = '360px',
    markerDisplay = 'numbered',
}) {
    const validRoutes = routes.filter(
        (route) =>
            hasPoint(route.origin_lat, route.origin_lng) &&
            hasPoint(route.destination_lat, route.destination_lng),
    );

    let center = defaultCenter;

    if (hasPoint(originPoint?.lat, originPoint?.lng)) {
        center = [Number(originPoint.lat), Number(originPoint.lng)];
    } else if (validRoutes.length > 0) {
        center = [
            Number(validRoutes[0].origin_lat),
            Number(validRoutes[0].origin_lng),
        ];
    }

    return (
        <div className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
            <MapContainer
                center={center}
                zoom={6}
                minZoom={5}
                maxBounds={colombiaBounds}
                maxBoundsViscosity={1}
                scrollWheelZoom={true}
                className="z-0"
                style={{ height, width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Polygon
                    positions={colombiaBoundary}
                    pathOptions={colombiaBoundaryStyle}
                    interactive={false}
                />

                {selectable ? (
                    <MapClickSelector
                        mode={selectionMode}
                        onSelectPoint={onSelectPoint}
                    />
                ) : null}

                <FitRouteBounds
                    routes={validRoutes}
                    originPoint={originPoint}
                    destinationPoint={destinationPoint}
                    draftRoute={draftRoute}
                />

                {hasPoint(originPoint?.lat, originPoint?.lng) ? (
                    <Marker
                        position={[Number(originPoint.lat), Number(originPoint.lng)]}
                        icon={markerIcon}
                    >
                        <Popup>Punto de salida seleccionado</Popup>
                    </Marker>
                ) : null}

                {hasPoint(destinationPoint?.lat, destinationPoint?.lng) ? (
                    <Marker
                        position={[
                            Number(destinationPoint.lat),
                            Number(destinationPoint.lng),
                        ]}
                        icon={markerIcon}
                    >
                        <Popup>Punto de llegada seleccionado</Popup>
                    </Marker>
                ) : null}

                {draftRoute ? (
                    <RoutePolyline route={draftRoute} color="#1677ff" />
                ) : null}

                {validRoutes.map((route, index) => {
                    const straightPositions = [
                        [Number(route.origin_lat), Number(route.origin_lng)],
                        [
                            Number(route.destination_lat),
                            Number(route.destination_lng),
                        ],
                    ];

                    const color = routeColor(index);
                    const routeNumber = index + 1;
                    const useEndpointLabels =
                        markerDisplay === 'endpoint-labels' &&
                        validRoutes.length === 1;
                    const originIcon = useEndpointLabels
                        ? createEndpointMarkerIcon(color, 'Origen', route.origin)
                        : createNumberedMarkerIcon(color, routeNumber);
                    const destinationIcon = useEndpointLabels
                        ? createEndpointMarkerIcon(
                            color,
                            'Destino',
                            route.destination,
                            'left',
                        )
                        : originIcon;

                    return (
                        <Fragment key={route.id}>
                            <Marker position={straightPositions[0]} icon={originIcon}>
                                <Popup>
                                    <strong>Salida:</strong> {route.origin}
                                    <br />
                                    <strong>Destino:</strong>{' '}
                                    {route.destination}
                                    <br />
                                    <strong>Capacidad:</strong>{' '}
                                    {route.available_capacity_kg} kg
                                </Popup>
                            </Marker>

                            <Marker
                                position={straightPositions[1]}
                                icon={destinationIcon}
                            >
                                <Popup>
                                    <strong>Llegada:</strong>{' '}
                                    {route.destination}
                                    <br />
                                    <strong>Ruta desde:</strong> {route.origin}
                                </Popup>
                            </Marker>

                            {(selectedRouteId === route.id || validRoutes.length === 1) && (
                                <RoutePolyline route={route} color={color} />
                            )}
                        </Fragment>
                    );
                })}
            </MapContainer>
        </div>
    );
}
