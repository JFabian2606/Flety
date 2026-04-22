<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function transporter(Request $request): Response
    {
        return Inertia::render('Dashboard', [
            'dashboardRole' => 'transportista',
            'entryRoute' => route('transporter.routes.index'),
        ]);
    }

    public function producer(Request $request): Response
    {
        return Inertia::render('Dashboard', [
            'dashboardRole' => 'productor',
            'entryRoute' => route('producer.routes.index'),
        ]);
    }

    public function admin(Request $request): Response
    {
        return Inertia::render('Dashboard', [
            'dashboardRole' => 'administrador',
            'entryRoute' => null,
        ]);
    }
}
