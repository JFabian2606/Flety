<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transporter extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'user_id',
        'identity_document',
        'identity_document_expedition_date',
        'identity_document_expedition_place',
        'driver_license',
        'driver_license_category',
        'driver_license_expiration_date',
        'validation_status',
        'rating_average',
    ];

    protected function casts(): array
    {
        return [
            'identity_document_expedition_date' => 'date',
            'driver_license_expiration_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function documentVerifications(): HasMany
    {
        return $this->hasMany(DocumentVerification::class);
    }

    public function routes(): HasMany
    {
        return $this->hasMany(TransportRoute::class);
    }

    public function services(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(
            Service::class,
            TransportRoute::class,
            'transporter_id',
            'transport_route_id',
            'id',
            'id',
        );
    }

    public function isValidated(): bool
    {
        return $this->validation_status === self::STATUS_APPROVED;
    }
}
