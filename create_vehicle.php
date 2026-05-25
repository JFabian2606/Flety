<?php
$user = App\Models\User::where('email', 'transportista@flety.test')->first();
if ($user && $user->transporterProfile) {
    App\Models\Vehicle::firstOrCreate(
        ['plate' => 'ABC-123'],
        [
            'transporter_id' => $user->transporterProfile->id,
            'vehicle_type' => 'Camión Turbo',
            'brand' => 'Chevrolet',
            'model' => 'NHR',
            'model_year' => 2020,
            'color' => 'Blanco',
            'capacity_kg' => 3500,
            'status' => 'available',
        ]
    );
    echo "Vehiculo listo para ser usado por el transportista.\n";
} else {
    echo "No se encontro el usuario transportista@flety.test o su perfil de transportista.\n";
}
