<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('transport_requests', 'product_category')) {
            return;
        }

        Schema::table('transport_requests', function (Blueprint $table) {
            $table
                ->string('product_category', 30)
                ->default('resistant')
                ->after('product_type');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('transport_requests', 'product_category')) {
            return;
        }

        Schema::table('transport_requests', function (Blueprint $table) {
            $table->dropColumn('product_category');
        });
    }
};
