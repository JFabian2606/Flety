<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'transport_request_id',
        'user_id',
        'action',
        'old_status',
        'new_status',
        'ip_address',
        'user_agent',
        'details',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'array',
        ];
    }

    public function transportRequest()
    {
        return $this->belongsTo(TransportRequest::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
