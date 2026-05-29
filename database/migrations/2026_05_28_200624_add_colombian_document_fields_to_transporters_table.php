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
        Schema::table('transporters', function (Blueprint $table) {
            $table->date('identity_document_expedition_date')->nullable()->after('identity_document');
            $table->string('identity_document_expedition_place')->nullable()->after('identity_document_expedition_date');
            $table->string('driver_license_category')->nullable()->after('driver_license');
            $table->date('driver_license_expiration_date')->nullable()->after('driver_license_category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transporters', function (Blueprint $table) {
            $table->dropColumn([
                'identity_document_expedition_date',
                'identity_document_expedition_place',
                'driver_license_category',
                'driver_license_expiration_date',
            ]);
        });
    }
};
