<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('transport_routes', 'min_cargo_weight_kg')) {
            return;
        }

        Schema::table('transport_routes', function (Blueprint $table) {
            $table
                ->decimal('min_cargo_weight_kg', 10, 2)
                ->default(1)
                ->after('available_capacity_kg');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('transport_routes', 'min_cargo_weight_kg')) {
            return;
        }

        Schema::table('transport_routes', function (Blueprint $table) {
            $table->dropColumn('min_cargo_weight_kg');
        });
    }
};
