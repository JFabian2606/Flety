<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TransportRequest extends Model
{
    use HasFactory;

    protected static function booted()
    {
        static::created(function (TransportRequest $request) {
            TransactionLog::create([
                'transport_request_id' => $request->id,
                'user_id' => auth()->id(),
                'action' => 'created',
                'new_status' => $request->status,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        });

        static::updated(function (TransportRequest $request) {
            if ($request->isDirty('status')) {
                TransactionLog::create([
                    'transport_request_id' => $request->id,
                    'user_id' => auth()->id(),
                    'action' => 'status_changed',
                    'old_status' => $request->getOriginal('status'),
                    'new_status' => $request->status,
                    'ip_address' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ]);
            }
        });
    }

    public const STATUS_PENDING = 'pending';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'transport_route_id',
        'producer_id',
        'cargo_weight_kg',
        'product_type',
        'product_category',
        'delivery_destination',
        'estimated_cost',
        'requested_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'requested_at' => 'datetime',
            'cargo_weight_kg' => 'decimal:2',
            'estimated_cost' => 'decimal:2',
        ];
    }

    public function route(): BelongsTo
    {
        return $this->belongsTo(TransportRoute::class, 'transport_route_id');
    }

    public function producer(): BelongsTo
    {
        return $this->belongsTo(Producer::class);
    }

    public function service(): HasOne
    {
        return $this->hasOne(Service::class);
    }
}
