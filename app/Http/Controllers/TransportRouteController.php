<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransportRouteRequest;
use App\Models\TransportRoute;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransportRouteController extends Controller
{
    public function transporterIndex(Request $request): Response
    {
        $user = $request->user()->loadMissing([
            'role:id,name,slug',
            'transporterProfile.vehicles',
            'transporterProfile.routes.vehicle',
        ]);

        $transporter = $user->transporterProfile;

        $myRoutes = $transporter
            ? $transporter->routes()
                ->with('vehicle:id,plate,vehicle_type,capacity_kg')
                ->withCount('transportRequests')
                ->orderByDesc('departure_at')
                ->get()
                ->map(fn (TransportRoute $route) => [
                    'id' => $route->id,
                    'origin' => $route->origin,
                    'destination' => $route->destination,
                    'departure_at' => $route->departure_at?->toIso8601String(),
                    'available_capacity_kg' => (float) $route->available_capacity_kg,
                    'permitted_cargo_type' => $route->permitted_cargo_type,
                    'status' => $route->status,
                    'transport_requests_count' => $route->transport_requests_count,
                    'vehicle' => $route->vehicle ? [
                        'plate' => $route->vehicle->plate,
                        'vehicle_type' => $route->vehicle->vehicle_type,
                    ] : null,
                ])
            : [];

        return Inertia::render('Routes/Index', [
            'role' => 'transportista',
            'transporterProfile' => $transporter ? [
                'id' => $transporter->id,
                'validation_status' => $transporter->validation_status,
            ] : null,
            'vehicles' => $transporter
                ? $transporter->vehicles->map(fn ($vehicle) => [
                    'id' => $vehicle->id,
                    'plate' => $vehicle->plate,
                    'vehicle_type' => $vehicle->vehicle_type,
                    'capacity_kg' => (float) $vehicle->capacity_kg,
                    'status' => $vehicle->status,
                ])->values()
                : [],
            'myRoutes' => $myRoutes,
            'availableRoutes' => [],
            'myRequests' => [],
        ]);
    }

    public function producerIndex(Request $request): Response
    {
        $user = $request->user()->loadMissing([
            'role:id,name,slug',
            'producerProfile',
        ]);

        $producer = $user->producerProfile;

        $availableRoutes = TransportRoute::query()
            ->with([
                'vehicle:id,plate,vehicle_type,capacity_kg',
                'transporter.user:id,name,phone',
            ])
            ->where('status', TransportRoute::STATUS_PUBLISHED)
            ->where('departure_at', '>', now())
            ->whereHas('transporter', fn ($query) => $query->where('validation_status', 'approved'))
            ->orderBy('departure_at')
            ->get()
            ->map(fn (TransportRoute $route) => [
                'id' => $route->id,
                'origin' => $route->origin,
                'destination' => $route->destination,
                'departure_at' => $route->departure_at?->toIso8601String(),
                'available_capacity_kg' => (float) $route->available_capacity_kg,
                'permitted_cargo_type' => $route->permitted_cargo_type,
                'status' => $route->status,
                'vehicle' => $route->vehicle ? [
                    'plate' => $route->vehicle->plate,
                    'vehicle_type' => $route->vehicle->vehicle_type,
                    'capacity_kg' => (float) $route->vehicle->capacity_kg,
                ] : null,
                'transporter' => $route->transporter?->user ? [
                    'name' => $route->transporter->user->name,
                    'phone' => $route->transporter->user->phone,
                ] : null,
            ]);

        $myRequests = $producer
            ? $producer->transportRequests()
                ->with(['route.vehicle:id,plate,vehicle_type', 'route.transporter.user:id,name,phone'])
                ->latest('requested_at')
                ->get()
                ->map(fn ($transportRequest) => [
                    'id' => $transportRequest->id,
                    'cargo_weight_kg' => (float) $transportRequest->cargo_weight_kg,
                    'product_type' => $transportRequest->product_type,
                    'delivery_destination' => $transportRequest->delivery_destination,
                    'estimated_cost' => $transportRequest->estimated_cost !== null ? (float) $transportRequest->estimated_cost : null,
                    'status' => $transportRequest->status,
                    'requested_at' => $transportRequest->requested_at?->toIso8601String(),
                    'route' => $transportRequest->route ? [
                        'origin' => $transportRequest->route->origin,
                        'destination' => $transportRequest->route->destination,
                        'departure_at' => $transportRequest->route->departure_at?->toIso8601String(),
                        'vehicle' => $transportRequest->route->vehicle ? [
                            'plate' => $transportRequest->route->vehicle->plate,
                            'vehicle_type' => $transportRequest->route->vehicle->vehicle_type,
                        ] : null,
                        'transporter' => $transportRequest->route->transporter?->user ? [
                            'name' => $transportRequest->route->transporter->user->name,
                            'phone' => $transportRequest->route->transporter->user->phone,
                        ] : null,
                    ] : null,
                ])
            : [];

        return Inertia::render('Routes/Index', [
            'role' => 'productor',
            'transporterProfile' => null,
            'vehicles' => [],
            'myRoutes' => [],
            'availableRoutes' => $availableRoutes,
            'myRequests' => $myRequests,
        ]);
    }

    public function store(StoreTransportRouteRequest $request): RedirectResponse
    {
        $transporter = $request->user()->transporterProfile;

        TransportRoute::create([
            'transporter_id' => $transporter->id,
            'vehicle_id' => $request->integer('vehicle_id'),
            'origin' => $request->string('origin')->toString(),
            'destination' => $request->string('destination')->toString(),
            'departure_at' => $request->date('departure_at'),
            'available_capacity_kg' => $request->input('available_capacity_kg'),
            'permitted_cargo_type' => $request->string('permitted_cargo_type')->toString(),
            'status' => TransportRoute::STATUS_PUBLISHED,
        ]);

        return back()->with('success', 'Ruta publicada correctamente.');
    }
}
