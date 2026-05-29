<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transporters', function (Blueprint $table) {
            // Agregamos la columna tipo JSON para los métodos de pago
            $table->json('payment_methods')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('transporters', function (Blueprint $table) {
            // Eliminamos la columna si hacemos un rollback
            $table->dropColumn('payment_methods');
        });
    }
};