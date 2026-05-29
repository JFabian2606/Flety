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

        $logs = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/TransactionLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only('search'),
        ]);
    }
}
