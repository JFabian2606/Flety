<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TransactionLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionLogController extends Controller
{
    public function index(Request $request)
    {
        $query = TransactionLog::with(['user', 'transportRequest.route', 'transportRequest.producer.user'])
            ->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                // Buscar por ID de la solicitud
                $q->where('transport_request_id', 'like', "%{$search}%")
                  // O buscar por el nombre del usuario que ejecutó la acción
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->input('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->input('end_date'));
        }

        $logs = $query->paginate(20)->withQueryString();

        // Calculate Stats for the top cards (for today by default)
        $todayStats = TransactionLog::whereDate('created_at', today())->get();
        
        $stats = [
            'total_today' => $todayStats->count(),
            'accepted_today' => $todayStats->where('new_status', 'accepted')->count(),
            'rejected_today' => $todayStats->where('new_status', 'rejected')->count(),
            'failed_today' => $todayStats->where('action', 'failed')->count(),
        ];

        return Inertia::render('Admin/TransactionLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only('search', 'start_date', 'end_date'),
            'stats' => $stats,
        ]);
    }
}
