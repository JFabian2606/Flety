<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransportRequestRequest;
use App\Models\Service;
use App\Models\ServiceContact;
use App\Models\TransportRequest;
use App\Models\TransportRoute;
use App\Services\TransportCostEstimator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TransportRequestController extends Controller
{
    public function transporterIndex(Request $request): Response
    {
        $user = $request->user()->loadMissing('transporterProfile');
        $transporter = $user->transporterProfile;

        $activeRouteCount = $transporter
            ? TransportRoute::query()
                ->where('transporter_id', $transporter->id)
                ->where('status', TransportRoute::STATUS_PUBLISHED)
                ->where('departure_at', '>', now())
                ->count()
            : 0;

        $incomingRequests = $transporter
            ? TransportRequest::query()
                ->with([
                    'route.vehicle:id,plate,vehicle_type,capacity_kg',
                    'producer.user:id,name',
                ])
                ->where('status', TransportRequest::STATUS_PENDING)
                ->whereHas(
                    'route',
                    fn (Builder $query) => $query
                        ->where('transporter_id', $transporter->id)
                        ->where('status', TransportRoute::STATUS_PUBLISHED)
                        ->where('departure_at', '>', now())
                )
                ->latest('requested_at')
                ->get()
                ->map(fn (TransportRequest $transportRequest) => [
                    'id' => $transportRequest->id,
                    'cargo_weight_kg' => (float) $transportRequest->cargo_weight_kg,
                    'product_type' => $transportRequest->product_type,
                    'product_category' => $transportRequest->product_category,
                    'delivery_destination' => $transportRequest->delivery_destination,
                    'estimated_cost' => $transportRequest->estimated_cost !== null ? (float) $transportRequest->estimated_cost : null,
                    'status' => $transportRequest->status,
                    'requested_at' => $transportRequest->requested_at?->toIso8601String(),
                    'is_new' => $transportRequest->requested_at?->greaterThanOrEqualTo(now()->subDay()) ?? false,
                    'can_accept' => $transportRequest->route
                        ? (float) $transportRequest->cargo_weight_kg <= (float) $transportRequest->route->available_capacity_kg
                            && (float) $transportRequest->cargo_weight_kg >= (float) $transportRequest->route->min_cargo_weight_kg
                        : false,
                    'route' => $transportRequest->route ? [
                        'id' => $transportRequest->route->id,
                        'origin' => $transportRequest->route->origin,
                        'destination' => $transportRequest->route->destination,
                        'departure_at' => $transportRequest->route->departure_at?->toIso8601String(),
                        'available_capacity_kg' => (float) $transportRequest->route->available_capacity_kg,
                        'min_cargo_weight_kg' => (float) $transportRequest->route->min_cargo_weight_kg,
                        'permitted_cargo_type' => $transportRequest->route->permitted_cargo_type,
                        'vehicle' => $transportRequest->route->vehicle ? [
                            'plate' => $transportRequest->route->vehicle->plate,
                            'vehicle_type' => $transportRequest->route->vehicle->vehicle_type,
                            'capacity_kg' => (float) $transportRequest->route->vehicle->capacity_kg,
                        ] : null,
                    ] : null,
                    'producer' => $transportRequest->producer?->user ? [
                        'name' => $transportRequest->producer->user->name,
                    ] : null,
                ])
            : collect();

        $confirmedServices = $transporter
            ? Service::query()
                ->with([
                    'contact',
                    'route.vehicle:id,plate,vehicle_type',
                    'transportRequest.producer.user:id,name,phone',
                ])
                ->where('status', Service::STATUS_CONFIRMED)
                ->whereHas('route', fn (Builder $query) => $query->where('transporter_id', $transporter->id))
                ->latest('confirmed_at')
                ->get()
                ->map(fn (Service $service) => $this->mapServiceForTransporter($service))
                ->filter()
                ->values()
            : collect();

        return Inertia::render('Transporter/Requests', [
            'incomingRequests' => $incomingRequests,
            'confirmedServices' => $confirmedServices,
            'requestSummary' => [
                'active_route_count' => $activeRouteCount,
                'pending_count' => $incomingRequests->count(),
                'new_count' => $incomingRequests->where('is_new', true)->count(),
                'compatible_count' => $incomingRequests->where('can_accept', true)->count(),
            ],
        ]);
    }

    public function store(StoreTransportRequestRequest $request, TransportCostEstimator $costEstimator): RedirectResponse
    {
        $producer = $request->user()->producerProfile;
        $route = TransportRoute::query()->find($request->integer('transport_route_id'));
        $estimatedCost = $costEstimator->estimate(
            $route?->distance_km,
            $request->input('cargo_weight_kg'),
            $request->string('product_type')->toString(),
            $request->string('product_category')->toString(),
        );

        TransportRequest::create([
            'transport_route_id' => $request->integer('transport_route_id'),
            'producer_id' => $producer->id,
            'cargo_weight_kg' => $request->input('cargo_weight_kg'),
            'product_type' => $request->string('product_type')->toString(),
            'product_category' => $request->string('product_category')->toString(),
            'delivery_destination' => $request->string('delivery_destination')->toString(),
            'estimated_cost' => $estimatedCost ?? $request->input('estimated_cost'),
            'status' => TransportRequest::STATUS_PENDING,
            'requested_at' => now(),
        ]);

        return back()->with('success', 'Solicitud registrada correctamente.');
    }

    public function accept(Request $request, TransportRequest $transportRequest): RedirectResponse
    {
        $transportRequest->loadMissing([
            'route.transporter.user:id,phone',
            'producer.user:id,phone',
            'service.contact',
        ]);

        $transporter = $request->user()?->transporterProfile;

        if (! $transporter || $transportRequest->route?->transporter_id !== $transporter->id) {
            abort(403);
        }

        if ($transportRequest->status !== TransportRequest::STATUS_PENDING) {
            return back()->with('error', 'Solo puedes aceptar solicitudes pendientes.');
        }

        if ($transportRequest->route?->status !== TransportRoute::STATUS_PUBLISHED) {
            return back()->with('error', 'La ruta ya no se encuentra disponible para confirmar este servicio.');
        }

        if ((float) $transportRequest->cargo_weight_kg > (float) $transportRequest->route->available_capacity_kg) {
            return back()->with('error', 'La solicitud supera la capacidad restante de la ruta.');
        }

        if ((float) $transportRequest->cargo_weight_kg < (float) $transportRequest->route->min_cargo_weight_kg) {
            return back()->with('error', 'La solicitud no alcanza el peso minimo definido para esta ruta.');
        }

        $transporterPhone = $transportRequest->route?->transporter?->user?->phone;
        $producerPhone = $transportRequest->producer?->user?->phone;

        if (! $transporterPhone || ! $producerPhone) {
            return back()->with('error', 'Ambas partes deben tener telefono registrado para habilitar el contacto.');
        }

        DB::transaction(function () use ($transportRequest, $transporterPhone) {
            $route = $transportRequest->route;
            $remainingCapacity = max(
                0,
                round((float) $route->available_capacity_kg - (float) $transportRequest->cargo_weight_kg, 2),
            );

            $transportRequest->update([
                'status' => TransportRequest::STATUS_ACCEPTED,
            ]);

            $route->update([
                'available_capacity_kg' => $remainingCapacity,
                'status' => $remainingCapacity >= (float) $route->min_cargo_weight_kg
                    ? TransportRoute::STATUS_PUBLISHED
                    : TransportRoute::STATUS_CLOSED,
            ]);

            $service = Service::query()->updateOrCreate(
                ['transport_request_id' => $transportRequest->id],
                [
                    'transport_route_id' => $route->id,
                    'confirmed_at' => now(),
                    'status' => Service::STATUS_CONFIRMED,
                ],
            );

            ServiceContact::query()->updateOrCreate(
                ['service_id' => $service->id],
                [
                    'shared_phone' => $transporterPhone,
                    'shared_whatsapp' => $this->normalizeWhatsappNumber($transporterPhone),
                    'enabled_at' => now(),
                ],
            );
        });

        return back()->with('success', 'Solicitud aceptada. El contacto entre productor y transportista ya esta habilitado.');
    }

    public function reject(Request $request, TransportRequest $transportRequest): RedirectResponse
    {
        $transportRequest->loadMissing('route');

        $transporter = $request->user()?->transporterProfile;

        if (! $transporter || $transportRequest->route?->transporter_id !== $transporter->id) {
            abort(403);
        }

        if ($transportRequest->status !== TransportRequest::STATUS_PENDING) {
            return back()->with('error', 'Solo puedes rechazar solicitudes pendientes.');
        }

        $transportRequest->update([
            'status' => TransportRequest::STATUS_REJECTED,
        ]);

        return back()->with('success', 'Solicitud rechazada correctamente.');
    }

    private function mapServiceForTransporter(Service $service): ?array
    {
        if (! $service->contact?->enabled_at) {
            return null;
        }

        $producer = $service->transportRequest?->producer?->user;

        if (! $producer?->phone) {
            return null;
        }

        return [
            'id' => $service->id,
            'status' => $service->status,
            'confirmed_at' => $service->confirmed_at?->toIso8601String(),
            'route' => $service->route ? [
                'origin' => $service->route->origin,
                'destination' => $service->route->destination,
                'departure_at' => $service->route->departure_at?->toIso8601String(),
                'vehicle' => $service->route->vehicle ? [
                    'plate' => $service->route->vehicle->plate,
                    'vehicle_type' => $service->route->vehicle->vehicle_type,
                ] : null,
            ] : null,
            'request' => $service->transportRequest ? [
                'product_type' => $service->transportRequest->product_type,
                'product_category' => $service->transportRequest->product_category,
                'cargo_weight_kg' => (float) $service->transportRequest->cargo_weight_kg,
                'delivery_destination' => $service->transportRequest->delivery_destination,
                'estimated_cost' => $service->transportRequest->estimated_cost !== null ? (float) $service->transportRequest->estimated_cost : null,
            ] : null,
            'counterpart' => [
                'role' => 'productor',
                'name' => $producer->name,
                'phone' => $producer->phone,
                'phone_url' => $this->telLink($producer->phone),
                'whatsapp_url' => $this->whatsappLink($producer->phone),
            ],
        ];
    }

    private function telLink(?string $phone): ?string
    {
        $digits = $this->digitsOnly($phone);

        return $digits ? 'tel:'.$digits : null;
    }

    private function whatsappLink(?string $phone): ?string
    {
        $digits = $this->digitsOnly($phone);

        if (! $digits) {
            return null;
        }

        if (strlen($digits) === 10) {
            $digits = '57'.$digits;
        }

        return 'https://wa.me/'.$digits;
    }

    private function normalizeWhatsappNumber(?string $phone): ?string
    {
        if (! $phone) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $phone);

        if (! $digits) {
            return null;
        }

        if (strlen($digits) === 10) {
            return '57'.$digits;
        }

        return ltrim($digits, '0');
    }

    private function digitsOnly(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $value);

        return $digits ?: null;
    }
}
