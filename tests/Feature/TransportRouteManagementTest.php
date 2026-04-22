<?php

namespace Tests\Feature;

use App\Models\Producer;
use App\Models\Role;
use App\Models\TransportRequest;
use App\Models\TransportRoute;
use App\Models\Transporter;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class TransportRouteManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_validated_transporter_can_register_a_vehicle_and_publish_a_route(): void
    {
        $user = $this->createTransporterUser(Transporter::STATUS_APPROVED);

        $this->actingAs($user)
            ->post(route('transporter.vehicles.store'), [
                'plate' => 'abc123',
                'vehicle_type' => 'Camion',
                'capacity_kg' => 2500,
            ])
            ->assertRedirect();

        $vehicle = Vehicle::query()->firstOrFail();

        $this->actingAs($user)
            ->post(route('transporter.routes.store'), [
                'vehicle_id' => $vehicle->id,
                'origin' => 'Tunja',
                'destination' => 'Bogota',
                'departure_at' => now()->addDays(2)->format('Y-m-d H:i:s'),
                'available_capacity_kg' => 1800,
                'permitted_cargo_type' => 'Papa',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('vehicles', [
            'id' => $vehicle->id,
            'plate' => 'ABC123',
            'transporter_id' => $user->transporterProfile->id,
        ]);

        $this->assertDatabaseHas('transport_routes', [
            'transporter_id' => $user->transporterProfile->id,
            'vehicle_id' => $vehicle->id,
            'origin' => 'Tunja',
            'destination' => 'Bogota',
            'status' => TransportRoute::STATUS_PUBLISHED,
        ]);
    }

    public function test_pending_transporter_cannot_publish_routes(): void
    {
        $user = $this->createTransporterUser(Transporter::STATUS_PENDING);
        $vehicle = Vehicle::query()->create([
            'transporter_id' => $user->transporterProfile->id,
            'plate' => 'ZZZ999',
            'vehicle_type' => 'Camioneta',
            'capacity_kg' => 1200,
            'status' => Vehicle::STATUS_AVAILABLE,
        ]);

        $this->actingAs($user)
            ->from(route('transporter.routes.index'))
            ->post(route('transporter.routes.store'), [
                'vehicle_id' => $vehicle->id,
                'origin' => 'Yopal',
                'destination' => 'Sogamoso',
                'departure_at' => now()->addDay()->format('Y-m-d H:i:s'),
                'available_capacity_kg' => 1000,
                'permitted_cargo_type' => 'Insumos',
            ])
            ->assertRedirect(route('transporter.routes.index'));

        $this->assertDatabaseCount('transport_routes', 0);
    }

    public function test_producer_can_create_a_transport_request_for_a_published_route(): void
    {
        $route = $this->createPublishedRoute();
        $producer = $this->createProducerUser();

        $this->actingAs($producer)
            ->post(route('producer.transport-requests.store'), [
                'transport_route_id' => $route->id,
                'cargo_weight_kg' => 450,
                'product_type' => 'Cafe',
                'delivery_destination' => 'Mosquera',
                'estimated_cost' => 180000,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('transport_requests', [
            'transport_route_id' => $route->id,
            'producer_id' => $producer->producerProfile->id,
            'product_type' => 'Cafe',
            'status' => TransportRequest::STATUS_PENDING,
        ]);
    }

    public function test_producer_cannot_request_more_weight_than_available_capacity(): void
    {
        $route = $this->createPublishedRoute([
            'available_capacity_kg' => 400,
        ]);
        $producer = $this->createProducerUser();

        $this->actingAs($producer)
            ->from(route('producer.routes.index'))
            ->post(route('producer.transport-requests.store'), [
                'transport_route_id' => $route->id,
                'cargo_weight_kg' => 550,
                'product_type' => 'Platano',
                'delivery_destination' => 'Funza',
            ])
            ->assertRedirect(route('producer.routes.index'));

        $this->assertDatabaseCount('transport_requests', 0);
    }

    public function test_route_index_only_exposes_future_routes_from_validated_transporters(): void
    {
        $visibleRoute = $this->createPublishedRoute([
            'origin' => 'Visible Origin',
            'destination' => 'Visible Destination',
        ]);

        $hiddenPendingTransporter = $this->createTransporterUser(Transporter::STATUS_PENDING, 'pending@example.com');
        $hiddenVehicle = Vehicle::query()->create([
            'transporter_id' => $hiddenPendingTransporter->transporterProfile->id,
            'plate' => 'HID321',
            'vehicle_type' => 'Camion',
            'capacity_kg' => 3000,
            'status' => Vehicle::STATUS_AVAILABLE,
        ]);

        TransportRoute::query()->create([
            'transporter_id' => $hiddenPendingTransporter->transporterProfile->id,
            'vehicle_id' => $hiddenVehicle->id,
            'origin' => 'Hidden Pending',
            'destination' => 'Hidden Pending Destination',
            'departure_at' => now()->addDays(3),
            'available_capacity_kg' => 600,
            'permitted_cargo_type' => 'Yuca',
            'status' => TransportRoute::STATUS_PUBLISHED,
        ]);

        $pastRoute = $this->createPublishedRoute([
            'origin' => 'Hidden Past',
            'destination' => 'Hidden Past Destination',
            'departure_at' => Carbon::now()->subDay(),
        ], 'past@example.com');

        $producer = $this->createProducerUser('viewer@example.com');

        $response = $this->actingAs($producer)->get(route('producer.routes.index'));

        $response->assertOk();
        $response->assertSee($visibleRoute->origin);
        $response->assertSee($visibleRoute->destination);
        $response->assertDontSee('Hidden Pending');
        $response->assertDontSee($pastRoute->origin);
    }

    private function createTransporterUser(string $validationStatus, string $email = 'transporter@example.com'): User
    {
        $roleId = Role::query()->where('slug', Role::TRANSPORTER)->value('id');

        $user = User::factory()->create([
            'role_id' => $roleId,
            'email' => $email,
            'phone' => fake()->unique()->numerify('3#########'),
        ]);

        Transporter::query()->create([
            'user_id' => $user->id,
            'identity_document' => fake()->unique()->numerify('##########'),
            'driver_license' => fake()->unique()->bothify('LIC#####'),
            'validation_status' => $validationStatus,
            'rating_average' => 0,
        ]);

        return $user->fresh('transporterProfile');
    }

    private function createProducerUser(string $email = 'producer@example.com'): User
    {
        $roleId = Role::query()->where('slug', Role::PRODUCER)->value('id');

        $user = User::factory()->create([
            'role_id' => $roleId,
            'email' => $email,
            'phone' => fake()->unique()->numerify('3#########'),
        ]);

        Producer::query()->create([
            'user_id' => $user->id,
            'farm_name' => 'Finca La Esperanza',
            'farm_location' => 'Boyaca',
            'production_type' => 'Tuberculos',
            'rating_average' => 0,
        ]);

        return $user->fresh('producerProfile');
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function createPublishedRoute(array $attributes = [], string $transporterEmail = 'approved-route@example.com'): TransportRoute
    {
        $user = $this->createTransporterUser(Transporter::STATUS_APPROVED, $transporterEmail);
        $vehicle = Vehicle::query()->create([
            'transporter_id' => $user->transporterProfile->id,
            'plate' => strtoupper(fake()->unique()->bothify('???###')),
            'vehicle_type' => 'Camion',
            'capacity_kg' => 3000,
            'status' => Vehicle::STATUS_AVAILABLE,
        ]);

        return TransportRoute::query()->create(array_merge([
            'transporter_id' => $user->transporterProfile->id,
            'vehicle_id' => $vehicle->id,
            'origin' => 'Duitama',
            'destination' => 'Bogota',
            'departure_at' => now()->addDays(4),
            'available_capacity_kg' => 900,
            'permitted_cargo_type' => 'Papa',
            'status' => TransportRoute::STATUS_PUBLISHED,
        ], $attributes));
    }
}
