<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminVehicleController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => trim($request->string('search')->toString()),
            'status' => $request->string('status', Vehicle::STATUS_PENDING)->toString(),
        ];

        $vehicles = Vehicle::query()
            ->with('transporter.user:id,name,phone')
            ->when($filters['status'] !== '', fn ($q) => $q->where('status', $filters['status']))
            ->when($filters['search'] !== '', function ($q) use ($filters) {
                $q->where(function ($sub) use ($filters) {
                    $sub->where('plate', 'like', '%'.$filters['search'].'%')
                        ->orWhere('brand', 'like', '%'.$filters['search'].'%')
                        ->orWhereHas('transporter.user', function ($userQ) use ($filters) {
                            $userQ->where('name', 'like', '%'.$filters['search'].'%');
                        });
                });
            })
            ->latest()
            ->get();

        return Inertia::render('Admin/Vehicles/Index', [
            'filters' => $filters,
            'vehicles' => $vehicles->map(function (Vehicle $vehicle) {
                return [
                    'id' => $vehicle->id,
                    'plate' => $vehicle->plate,
                    'brand' => $vehicle->brand,
                    'model' => $vehicle->model,
                    'vehicle_type' => $vehicle->vehicle_type,
                    'transporter_name' => $vehicle->transporter?->user?->name ?? 'Transportista',
                    'transporter_phone' => $vehicle->transporter?->user?->phone ?? 'Sin teléfono',
                    'capacity_kg' => (float) $vehicle->capacity_kg,
                    'insurance_expires_at' => $vehicle->insurance_expires_at?->format('d/m/Y') ?? 'Sin fecha',
                    'technical_review_expires_at' => $vehicle->technical_review_expires_at?->format('d/m/Y') ?? 'Sin fecha',
                    'links' => $this->vehicleDocumentLinks($vehicle),
                    'approve_url' => route('admin.vehicles.approve', $vehicle),
                    'reject_url' => route('admin.vehicles.reject', $vehicle),
                ];
            })->values(),
        ]);
    }

    /**
     * @return array<int, array{label: string, href: string}>
     */
    private function vehicleDocumentLinks(Vehicle $vehicle): array
    {
        return collect([
            ['label' => 'Foto vehiculo', 'path' => $vehicle->vehicle_photo_path],
            ['label' => 'Licencia transito', 'path' => $vehicle->transit_license_image_path],
            ['label' => 'SOAT', 'path' => $vehicle->insurance_image_path],
            ['label' => 'Tecno-mecanica', 'path' => $vehicle->technical_review_image_path],
        ])
            ->filter(fn (array $document) => filled($document['path']))
            ->map(fn (array $document) => [
                'label' => $document['label'],
                'href' => Storage::disk('public')->url($document['path']),
            ])
            ->values()
            ->all();
    }
}
