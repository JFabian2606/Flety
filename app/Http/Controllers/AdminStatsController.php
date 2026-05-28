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

        // Estimated Financial Volume (Agreed amount of all confirmed services)
        $financialVolume = Service::query()
            ->where('status', Service::STATUS_CONFIRMED)
            ->sum('agreed_amount');

        // Top Cargo Types
        $topCargoTypes = TransportRequest::query()
            ->selectRaw('product_type, count(*) as total_requests, sum(cargo_weight_kg) as total_weight')
            ->whereHas('service', function ($query) {
                $query->where('status', Service::STATUS_CONFIRMED);
            })
            ->groupBy('product_type')
            ->orderByDesc('total_requests')
            ->take(5)
            ->get();

        // Hotspots (Top Origins)
        $topOrigins = \App\Models\TransportRoute::query()
            ->selectRaw('origin, count(*) as total_routes')
            ->whereIn('status', [\App\Models\TransportRoute::STATUS_PUBLISHED, \App\Models\TransportRoute::STATUS_IN_PROGRESS, \App\Models\TransportRoute::STATUS_COMPLETED])
            ->groupBy('origin')
            ->orderByDesc('total_routes')
            ->take(5)
            ->get();

        // Growth Trend (Mocked 6-month historical data for charts, as actual DB might not have enough history)
        // In a real scenario, this would group by month from the database.
        $growthTrend = [
            ['name' => 'Ene', 'viajes' => 45, 'kg' => 2000],
            ['name' => 'Feb', 'viajes' => 52, 'kg' => 2400],
            ['name' => 'Mar', 'viajes' => 38, 'kg' => 1900],
            ['name' => 'Abr', 'viajes' => 65, 'kg' => 3200],
            ['name' => 'May', 'viajes' => 85, 'kg' => 4500],
            ['name' => 'Jun', 'viajes' => $completedTripsCount, 'kg' => 5000], // Current month
        ];

        return Inertia::render('Admin/Stats/Index', [
            'metrics' => [
                'total_users' => $totalUsers,
                'producers_count' => $producersCount,
                'transporters_count' => $transportersCount,
                'completed_trips' => $completedTripsCount,
                'financial_volume' => (float) $financialVolume,
            ],
            'topCargoTypes' => $topCargoTypes,
            'topOrigins' => $topOrigins,
            'growthTrend' => $growthTrend,
        ]);
    }
}
