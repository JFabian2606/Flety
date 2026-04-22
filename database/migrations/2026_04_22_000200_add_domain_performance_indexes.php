<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->index(['transporter_id', 'status'], 'vehicles_transporter_status_index');
        });

        Schema::table('transport_routes', function (Blueprint $table) {
            $table->index(['transporter_id', 'status', 'departure_at'], 'transport_routes_owner_status_departure_index');
        });

        Schema::table('transport_requests', function (Blueprint $table) {
            $table->index(['producer_id', 'status', 'requested_at'], 'transport_requests_producer_status_requested_index');
            $table->index(['transport_route_id', 'status'], 'transport_requests_route_status_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transport_requests', function (Blueprint $table) {
            $table->dropIndex('transport_requests_route_status_index');
            $table->dropIndex('transport_requests_producer_status_requested_index');
        });

        Schema::table('transport_routes', function (Blueprint $table) {
            $table->dropIndex('transport_routes_owner_status_departure_index');
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropIndex('vehicles_transporter_status_index');
        });
    }
};
