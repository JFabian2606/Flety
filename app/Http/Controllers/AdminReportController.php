<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\TransportRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminReportController extends Controller
{
    public function index(Request $request): Response
    {
        $productType = $request->input('product_type');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        // Extract available product types for the filter select
        $availableProductTypes = TransportRequest::query()
            ->select('product_type')
            ->distinct()
            ->whereNotNull('product_type')
            ->orderBy('product_type')
            ->pluck('product_type');

        // Base query: Services that are considered "concretados" (confirmed)
        $query = Service::query()
            ->with(['route.vehicle.transporter.user', 'transportRequest.producer.user'])
            ->where('status', Service::STATUS_CONFIRMED);

        // Apply filters
        if ($dateFrom) {
            $query->whereDate('confirmed_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('confirmed_at', '<=', $dateTo);
        }

        if ($productType) {
            $query->whereHas('transportRequest', function ($q) use ($productType) {
                $q->where('product_type', $productType);
            });
        }

        $services = $query->latest('confirmed_at')->get();

        // Calculate aggregates dynamically based on the filtered results
        $totalWeight = $services->reduce(function ($carry, $service) {
            return $carry + (float) ($service->transportRequest->cargo_weight_kg ?? 0);
        }, 0);

        $totalAmount = $services->reduce(function ($carry, $service) {
            return $carry + (float) ($service->agreed_amount ?? 0);
        }, 0);

        $totalTrips = $services->count();

        return Inertia::render('Admin/Reports/Index', [
            'filters' => [
                'product_type' => $productType,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'available_products' => $availableProductTypes,
            'summary' => [
                'total_trips' => $totalTrips,
                'total_weight_kg' => round($totalWeight, 2),
                'total_amount' => round($totalAmount, 2),
            ],
            'reports' => $services->map(function ($service) {
                $origin = $service->route->origin ?? 'N/A';
                $destination = $service->transportRequest->delivery_destination ?? $service->route->destination ?? 'N/A';
                
                return [
                    'id' => $service->id,
                    'confirmed_at' => $service->confirmed_at ? $service->confirmed_at->format('d/m/Y') : 'N/A',
                    'product_type' => $service->transportRequest->product_type ?? 'Desconocido',
                    'weight_kg' => (float) ($service->transportRequest->cargo_weight_kg ?? 0),
                    'origin' => $origin,
                    'destination' => $destination,
                    'transporter' => $service->route->vehicle->transporter->user->name ?? 'Desconocido',
                    'producer' => $service->transportRequest->producer->user->name ?? 'Desconocido',
                    'amount' => (float) $service->agreed_amount,
                ];
            })->values(),
        ]);
    }
}
