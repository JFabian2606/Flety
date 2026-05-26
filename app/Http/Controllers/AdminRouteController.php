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

        $routes = TransportRoute::query()
            ->with(['vehicle.transporter.user:id,name,phone'])
            ->latest('created_at')
            ->get();

        return Inertia::render('Admin/Routes/Index', [
            'routes' => $routes->map(function (TransportRoute $route) {
                return [
                    'id' => $route->id,
                    'origin' => $route->origin,
                    'destination' => $route->destination,
                    'departure_at' => $route->departure_at->format('d/m/Y h:i A'),
                    'arrival_at' => $route->arrival_at ? $route->arrival_at->format('d/m/Y h:i A') : 'No especificada',
                    'available_capacity_kg' => (float) $route->available_capacity_kg,
                    'price_per_kg' => (float) $route->price_per_kg,
                    'status' => $route->operationalStatus(),
                    'transporter_name' => $route->vehicle?->transporter?->user?->name ?? 'Transportista',
                    'transporter_phone' => $route->vehicle?->transporter?->user?->phone ?? 'Sin teléfono',
                    'vehicle_plate' => $route->vehicle?->plate ?? 'N/A',
                ];
            })->values(),
        ]);
    }
}
