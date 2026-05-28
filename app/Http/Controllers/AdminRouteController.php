<?php

namespace App\Http\Controllers;

use App\Models\TransportRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminRouteController extends Controller
{
    public function index(Request $request): Response
    {
        // Cancel expired routes first so the view is clean
        TransportRoute::cancelExpiredUnstartedRoutes();

        $filters = [
            'origin' => trim($request->string('origin')->toString()),
            'destination' => trim($request->string('destination')->toString()),
            'status' => $request->string('status')->toString(),
        ];

        $routesQuery = TransportRoute::query()
            ->with(['vehicle.transporter.user:id,name,phone'])
            ->when($filters['origin'] !== '', fn ($q) => $q->where('origin', 'like', '%'.$filters['origin'].'%'))
            ->when($filters['destination'] !== '', fn ($q) => $q->where('destination', 'like', '%'.$filters['destination'].'%'))
            ->when($filters['status'] !== '', fn ($q) => $q->where('status', $filters['status']));

        $routes = $routesQuery->latest('created_at')->get();

        return Inertia::render('Admin/Routes/Index', [
            'filters' => $filters,
            'routes' => $routes->map(function (TransportRoute $route) {
                return [
                    'id' => $route->id,
                    'origin' => $route->origin,
                    'origin_lat' => $route->origin_lat,
                    'origin_lng' => $route->origin_lng,
                    'destination' => $route->destination,
                    'destination_lat' => $route->destination_lat,
                    'destination_lng' => $route->destination_lng,
                    'route_geometry' => $route->route_geometry,
                    'departure_at' => $route->departure_at->format('d/m/Y h:i A'),
                    'arrival_at' => $route->arrival_at ? $route->arrival_at->format('d/m/Y h:i A') : 'No especificada',
                    'available_capacity_kg' => (float) $route->available_capacity_kg,
                    'price_per_kg' => (float) $route->price_per_kg,
                    'status' => $route->operationalStatus(),
                    'transporter_name' => $route->vehicle?->transporter?->user?->name ?? 'Transportista',
                    'transporter_phone' => $route->vehicle?->transporter?->user?->phone ?? 'Sin teléfono',
                    'vehicle_plate' => $route->vehicle?->plate ?? 'N/A',
                    'cancel_url' => route('admin.routes.cancel', $route->id),
                ];
            })->values(),
        ]);
    }

    public function cancel(Request $request, TransportRoute $route)
    {
        $route->update(['status' => TransportRoute::STATUS_CANCELLED]);
        
        // Aquí se notificaría a los productores (simulado por ahora)

        return back()->with('success', 'Ruta administrativa cancelada correctamente por orden central.');
    }
}
