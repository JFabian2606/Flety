<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isTransporter() ?? false;
    }

    /**
     * @return array<string, array<int, \Illuminate\Contracts\Validation\ValidationRule|string>>
     */
    public function rules(): array
    {
        return [
            'plate' => ['required', 'string', 'max:20', Rule::unique('vehicles', 'plate')],
            'vehicle_type' => ['required', 'string', 'max:50'],
            'capacity_kg' => ['required', 'numeric', 'gt:0', 'max:99999999.99'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'plate' => strtoupper(trim((string) $this->input('plate'))),
        ]);
    }
}
