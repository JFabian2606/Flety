<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\TransportRequest;

class CheckExpiredRequests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'flety:expire-requests';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Marks pending transport requests as expired if their route has already departed';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Find pending requests where the route's departure_at is in the past
        $requests = TransportRequest::where('status', 'pending')
            ->whereHas('route', function ($query) {
                $query->where('departure_at', '<', now());
            })->get();

        $count = 0;
        foreach ($requests as $request) {
            $request->status = 'expired';
            // Disable timestamps temporarily so we don't change updated_at for an automatic action? No, let's keep updated_at.
            $request->save();
            $count++;
        }

        $this->info("Expired {$count} pending requests.");
    }
}
