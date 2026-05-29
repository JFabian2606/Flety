<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        // Cargamos al usuario con su perfil de transportista (si lo tiene)
        $user = $request->user()->load('transporterProfile');

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            
            // --- NUEVO: Le enviamos la info del transportista a React ---
            'transporter' => $user->transporterProfile,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // 1. Guarda la información básica del usuario (Nombre, Correo)
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        // --- NUEVO: Guarda los métodos de pago del transportista ---
        // Verificamos si la petición trae métodos de pago y si el usuario es transportista
        if ($request->has('payment_methods') && $request->user()->transporterProfile) {
            
            // Validamos que la información sea un arreglo seguro
            $request->validate([
                'payment_methods' => ['nullable', 'array']
            ]);

            // Actualizamos la tabla transporters
            $request->user()->transporterProfile->update([
                'payment_methods' => $request->input('payment_methods')
            ]);
        }
        // -----------------------------------------------------------

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}