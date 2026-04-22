<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVehicleRequest;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;

class VehicleController extends Controller
{
    public function store(StoreVehicleRequest $request): RedirectResponse
    {
        $transporter = $request->user()->transporterProfile;

        Vehicle::create([
            'transporter_id' => $transporter->id,
            'plate' => $request->string('plate')->toString(),
            'vehicle_type' => $request->string('vehicle_type')->toString(),
            'capacity_kg' => $request->input('capacity_kg'),
            'status' => Vehicle::STATUS_AVAILABLE,
        ]);

        return back()->with('success', 'Vehiculo registrado correctamente.');
    }
}
