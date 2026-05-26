<?php

namespace App\Http\Controllers;

use App\Models\Producer;
use App\Models\Service;
use App\Models\Transporter;
use App\Models\TransportRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminStatsController extends Controller
{
    public function index(Request $request): Response
    {
        // Total Users
        $producersCount = Producer::query()->count();
        $transportersCount = Transporter::query()->count();
        $totalUsers = $producersCount + $transportersCount;

        // Trips (Services confirmed)
        $completedTripsCount = Service::query()
            ->where('status', Service::STATUS_CONFIRMED)
            ->count();

        // Top Cargo Types
        $topCargoTypes = TransportRequest::query()
            ->selectRaw('product_type, count(*) as total_requests, sum(cargo_weight_kg) as total_weight')
            ->groupBy('product_type')
            ->orderByDesc('total_requests')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Stats/Index', [
            'metrics' => [
                'total_users' => $totalUsers,
                'producers_count' => $producersCount,
                'transporters_count' => $transportersCount,
                'completed_trips' => $completedTripsCount,
            ],
            'topCargoTypes' => $topCargoTypes,
        ]);
    }
}
