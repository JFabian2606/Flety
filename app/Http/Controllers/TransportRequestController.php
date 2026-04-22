<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransportRequestRequest;
use App\Models\TransportRequest;
use Illuminate\Http\RedirectResponse;

class TransportRequestController extends Controller
{
    public function store(StoreTransportRequestRequest $request): RedirectResponse
    {
        $producer = $request->user()->producerProfile;

        TransportRequest::create([
            'transport_route_id' => $request->integer('transport_route_id'),
            'producer_id' => $producer->id,
            'cargo_weight_kg' => $request->input('cargo_weight_kg'),
            'product_type' => $request->string('product_type')->toString(),
            'delivery_destination' => $request->string('delivery_destination')->toString(),
            'estimated_cost' => $request->input('estimated_cost'),
            'status' => TransportRequest::STATUS_PENDING,
            'requested_at' => now(),
        ]);

        return back()->with('success', 'Solicitud registrada correctamente.');
    }
}
