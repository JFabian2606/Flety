<?php

namespace Database\Seeders;

use App\Models\Producer;
use App\Models\Role;
use App\Models\Service;
use App\Models\Transporter;
use App\Models\TransportRequest;
use App\Models\TransportRoute;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Illuminate\Support\Carbon;

class MassiveSimulationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('es_CO');
        $password = Hash::make('password'); // All users will have 'password' as password

        $roleProducer = Role::where('slug', 'productor')->first();
        $roleTransporter = Role::where('slug', 'transportista')->first();

        if (!$roleProducer || !$roleTransporter) {
            $this->command->error('Roles no encontrados. Ejecuta RoleSeeder primero.');
            return;
        }

        $this->command->info('Limpiando simulación anterior...');
        User::where('email', 'like', '%@flety.com')->delete();

        $this->command->info('Iniciando creación masiva de usuarios y datos...');

        $colombiaCities = [
            ['name' => 'Bogotá', 'lat' => 4.6097, 'lng' => -74.0817],
            ['name' => 'Medellín', 'lat' => 6.2442, 'lng' => -75.5812],
            ['name' => 'Cali', 'lat' => 3.4516, 'lng' => -76.5320],
            ['name' => 'Barranquilla', 'lat' => 10.9685, 'lng' => -74.7813],
            ['name' => 'Cartagena', 'lat' => 10.3910, 'lng' => -75.4794],
            ['name' => 'Bucaramanga', 'lat' => 7.1193, 'lng' => -73.1227],
            ['name' => 'Pereira', 'lat' => 4.8087, 'lng' => -75.6906],
            ['name' => 'Manizales', 'lat' => 5.0689, 'lng' => -75.5174],
            ['name' => 'Cúcuta', 'lat' => 7.8939, 'lng' => -72.5078],
            ['name' => 'Ibagué', 'lat' => 4.4389, 'lng' => -75.2322],
            ['name' => 'Santa Marta', 'lat' => 11.2408, 'lng' => -74.1990],
            ['name' => 'Villavicencio', 'lat' => 4.1420, 'lng' => -73.6266],
            ['name' => 'Pasto', 'lat' => 1.2136, 'lng' => -77.2811],
            ['name' => 'Montería', 'lat' => 8.7480, 'lng' => -75.8814],
            ['name' => 'Valledupar', 'lat' => 10.4742, 'lng' => -73.2436],
        ];

        $productTypes = ['Papa', 'Platano', 'Yuca', 'Cafe', 'Maiz', 'Frijol', 'Hortalizas', 'Cebolla', 'Tomate'];

        $producersCount = 500;
        $transportersCount = 500;
        
        $producers = [];
        $transporters = [];

        // --- 1. SEED PRODUCERS ---
        $this->command->info("Creando {$producersCount} Productores...");
        for ($i = 1; $i <= $producersCount; $i++) {
            $identifier = str_pad($i, 3, '0', STR_PAD_LEFT);
            $user = User::create([
                'name' => 'Productor ' . $identifier . ' ' . $faker->lastName,
                'email' => "productor{$identifier}@flety.com",
                'phone' => '3' . $faker->randomNumber(9, true),
                'password' => $password,
                'role_id' => $roleProducer->id,
                'email_verified_at' => now(),
            ]);

            $producer = Producer::create([
                'user_id' => $user->id,
                'farm_name' => 'Finca ' . $faker->lastName,
                'farm_location' => $colombiaCities[array_rand($colombiaCities)]['name'] . ', ' . $faker->streetAddress,
                'production_type' => $faker->randomElement(['Agrícola', 'Pecuario', 'Mixto']),
                'rating_average' => $faker->randomFloat(2, 3, 5),
            ]);

            $producers[] = $producer;
        }

        // --- 2. SEED TRANSPORTERS ---
        $this->command->info("Creando {$transportersCount} Transportistas y sus Vehículos...");
        for ($i = 1; $i <= $transportersCount; $i++) {
            $identifier = str_pad($i, 3, '0', STR_PAD_LEFT);
            $user = User::create([
                'name' => 'Transportista ' . $identifier . ' ' . $faker->lastName,
                'email' => "transportista{$identifier}@flety.com",
                'phone' => '3' . $faker->randomNumber(9, true),
                'password' => $password,
                'role_id' => $roleTransporter->id,
                'email_verified_at' => now(),
            ]);

            $transporterStatus = $faker->randomElement(['pending', 'approved', 'approved', 'approved', 'rejected']);
            
            $methods = collect(['Efectivo', 'Nequi', 'Daviplata', 'Bancolombia'])
                ->random(rand(1, 3))
                ->values()
                ->toArray();

            $transporter = Transporter::create([
                'user_id' => $user->id,
                'identity_document' => $faker->unique()->randomNumber(9, true),
                'driver_license' => strtoupper($faker->bothify('???###')),
                'validation_status' => $transporterStatus,
                'rating_average' => $faker->randomFloat(2, 3, 5),
                'payment_methods' => $methods,
            ]);

            $transporters[] = $transporter;

            // Only create vehicles if transporter is approved (for realistic simulation, though pending could have vehicles)
            // Let's give vehicles to 80% of transporters
            if ($faker->boolean(80)) {
                $vehicleStatus = $transporterStatus === 'approved' 
                    ? $faker->randomElement(['pending', 'available', 'available', 'rejected']) 
                    : 'pending';

                $vehicle = Vehicle::create([
                    'transporter_id' => $transporter->id,
                    'plate' => strtoupper($faker->bothify('???###')),
                    'brand' => $faker->randomElement(['Chevrolet', 'Kenworth', 'Freightliner', 'Hino', 'Isuzu', 'Foton']),
                    'model' => 'T-' . $faker->randomNumber(3),
                    'model_year' => $faker->numberBetween(2005, 2024),
                    'color' => $faker->randomElement(['Blanco', 'Rojo', 'Azul', 'Amarillo', 'Negro', 'Verde']),
                    'vehicle_type' => $faker->randomElement(['Estacas', 'Furgón', 'Refrigerado', 'Planchón']),
                    'capacity_kg' => $faker->randomElement([3500, 5000, 10000, 35000]),
                    'status' => $vehicleStatus,
                ]);

                // --- 3. SEED ROUTES AND SERVICES (Only for approved transporters with available vehicles) ---
                if ($transporterStatus === 'approved' && $vehicleStatus === 'available') {
                    // Create 1 to 3 routes per approved vehicle
                    $routesCount = $faker->numberBetween(1, 3);
                    for ($r = 0; $r < $routesCount; $r++) {
                        $originCity = $faker->randomElement($colombiaCities);
                        $destCity = $faker->randomElement($colombiaCities);
                        // Make sure origin != dest
                        while($originCity['name'] === $destCity['name']) {
                            $destCity = $faker->randomElement($colombiaCities);
                        }

                        $isHistorical = $faker->boolean(60); // 60% chance the route is in the past (completed)
                        
                        $departureAt = $isHistorical 
                            ? Carbon::now()->subDays($faker->numberBetween(2, 60))
                            : Carbon::now()->addDays($faker->numberBetween(1, 10));

                        $routeStatus = $isHistorical 
                            ? $faker->randomElement([TransportRoute::STATUS_COMPLETED, TransportRoute::STATUS_CANCELLED])
                            : $faker->randomElement([TransportRoute::STATUS_PUBLISHED, TransportRoute::STATUS_IN_PROGRESS]);

                        $route = TransportRoute::create([
                            'transporter_id' => $transporter->id,
                            'vehicle_id' => $vehicle->id,
                            'origin' => $originCity['name'],
                            'origin_lat' => $originCity['lat'] + $faker->randomFloat(4, -0.05, 0.05), // Slight variation
                            'origin_lng' => $originCity['lng'] + $faker->randomFloat(4, -0.05, 0.05),
                            'destination' => $destCity['name'],
                            'destination_lat' => $destCity['lat'] + $faker->randomFloat(4, -0.05, 0.05),
                            'destination_lng' => $destCity['lng'] + $faker->randomFloat(4, -0.05, 0.05),
                            'departure_at' => $departureAt,
                            'available_capacity_kg' => $routeStatus === TransportRoute::STATUS_PUBLISHED ? $vehicle->capacity_kg : 0,
                            'min_cargo_weight_kg' => 500,
                            'distance_km' => $faker->numberBetween(100, 800),
                            'estimated_duration_minutes' => $faker->numberBetween(120, 1440),
                            'permitted_cargo_type' => $faker->randomElement(['Agricola', 'General', 'Perecedero']),
                            'status' => $routeStatus,
                        ]);

                        // --- 4. SEED SERVICES (If completed, generate services and requests) ---
                        if ($routeStatus === TransportRoute::STATUS_COMPLETED) {
                            $requestCount = $faker->numberBetween(1, 3); // 1 to 3 producers sent cargo
                            $remainingWeight = $vehicle->capacity_kg;
                            
                            for ($req = 0; $req < $requestCount; $req++) {
                                $cargoWeight = min($remainingWeight, $faker->numberBetween(500, 4000));
                                if ($cargoWeight < 500) break; // Not enough space left
                                $remainingWeight -= $cargoWeight;

                                $producer = $faker->randomElement($producers);

                                $transportReq = TransportRequest::create([
                                    'transport_route_id' => $route->id,
                                    'producer_id' => $producer->id,
                                    'cargo_weight_kg' => $cargoWeight,
                                    'product_type' => $faker->randomElement($productTypes),
                                    'product_category' => 'Agricola',
                                    'delivery_destination' => $destCity['name'] . ', ' . $faker->streetAddress,
                                    'estimated_cost' => $cargoWeight * $faker->numberBetween(100, 300),
                                    'requested_at' => $departureAt->copy()->subDays($faker->numberBetween(1, 5)),
                                    'status' => TransportRequest::STATUS_ACCEPTED,
                                ]);

                                Service::create([
                                    'transport_request_id' => $transportReq->id,
                                    'transport_route_id' => $route->id,
                                    'status' => Service::STATUS_CONFIRMED,
                                    'confirmed_at' => $departureAt->copy()->subHours($faker->numberBetween(2, 24)),
                                    'agreed_amount' => $transportReq->estimated_cost,
                                ]);
                            }
                        } else if ($routeStatus === TransportRoute::STATUS_PUBLISHED && $faker->boolean(70)) {
                            // Seed some pending/rejected requests for future routes
                            $requestCount = $faker->numberBetween(1, 2); 
                            for ($req = 0; $req < $requestCount; $req++) {
                                $cargoWeight = $faker->numberBetween(500, 2000);
                                $producer = $faker->randomElement($producers);
                                $reqStatus = $faker->randomElement([TransportRequest::STATUS_PENDING, TransportRequest::STATUS_REJECTED]);

                                TransportRequest::create([
                                    'transport_route_id' => $route->id,
                                    'producer_id' => $producer->id,
                                    'cargo_weight_kg' => $cargoWeight,
                                    'product_type' => $faker->randomElement($productTypes),
                                    'product_category' => 'Agricola',
                                    'delivery_destination' => $destCity['name'] . ', ' . $faker->streetAddress,
                                    'estimated_cost' => $cargoWeight * $faker->numberBetween(100, 300),
                                    'requested_at' => Carbon::now()->subHours($faker->numberBetween(1, 48)),
                                    'status' => $reqStatus,
                                ]);
                            }
                        }
                    }
                }
            }
        }

        $this->command->info('Simulación Masiva Completada exitosamente.');
        $this->command->info('- ' . $producersCount . ' Productores creados.');
        $this->command->info('- ' . $transportersCount . ' Transportistas creados.');
        $this->command->info('Las contraseñas de todos los usuarios son: password');
    }
}
