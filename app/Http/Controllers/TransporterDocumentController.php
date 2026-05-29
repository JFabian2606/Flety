<?php

namespace App\Http\Controllers;

use App\Models\DocumentVerification;
use App\Models\Transporter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TransporterDocumentController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        $transporter = Transporter::query()
            ->with('documentVerifications')
            ->where('user_id', $user->id)
            ->firstOrFail();

        return Inertia::render('Transporter/Documents/Index', [
            'transporter' => [
                'id' => $transporter->id,
                'identity_document' => $transporter->identity_document,
                'identity_document_expedition_date' => $transporter->identity_document_expedition_date?->format('Y-m-d'),
                'identity_document_expedition_place' => $transporter->identity_document_expedition_place,
                'driver_license' => $transporter->driver_license,
                'driver_license_category' => $transporter->driver_license_category,
                'driver_license_expiration_date' => $transporter->driver_license_expiration_date?->format('Y-m-d'),
                'validation_status' => $transporter->validation_status,
            ],
            'documents' => $transporter->documentVerifications
                ->map(fn (DocumentVerification $document) => [
                    'id' => $document->id,
                    'document_type' => $document->document_type,
                    'review_status' => $document->review_status,
                    'review_notes' => $document->review_notes,
                    'uploaded_at' => $document->uploaded_at?->format('Y-m-d H:i:s'),
                ])
                ->values(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'document_type' => ['required', 'in:identity_document,driver_license'],
            'document_number' => ['required', 'string', 'max:50'],
            'document_file' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:10240'],
            // Colombian specific fields
            'identity_document_expedition_date' => ['nullable', 'required_if:document_type,identity_document', 'date'],
            'identity_document_expedition_place' => ['nullable', 'required_if:document_type,identity_document', 'string', 'max:255'],
            'driver_license_category' => ['nullable', 'required_if:document_type,driver_license', 'string', 'max:10'],
            'driver_license_expiration_date' => ['nullable', 'required_if:document_type,driver_license', 'date'],
        ]);

        $user = $request->user();
        $transporter = Transporter::where('user_id', $user->id)->firstOrFail();

        // Subir archivo
        $path = $request->file('document_file')->store('transporter_documents');

        // Actualizar datos
        if ($request->document_type === DocumentVerification::TYPE_IDENTITY_DOCUMENT) {
            $transporter->identity_document = $request->document_number;
            $transporter->identity_document_expedition_date = $request->identity_document_expedition_date;
            $transporter->identity_document_expedition_place = $request->identity_document_expedition_place;
        } else {
            $transporter->driver_license = $request->document_number;
            $transporter->driver_license_category = $request->driver_license_category;
            $transporter->driver_license_expiration_date = $request->driver_license_expiration_date;
        }
        $transporter->validation_status = Transporter::STATUS_PENDING;
        $transporter->save();

        // Buscar si ya existe una verificación previa de este tipo y actualizarla, o crearla
        $verification = $transporter->documentVerifications()
            ->where('document_type', $request->document_type)
            ->first();

        if ($verification) {
            // Eliminar archivo viejo si existe
            if (Storage::exists($verification->file_path)) {
                Storage::delete($verification->file_path);
            }

            $verification->update([
                'file_path' => $path,
                'review_status' => DocumentVerification::STATUS_PENDING,
                'review_notes' => null,
                'uploaded_at' => now(),
            ]);
        } else {
            $transporter->documentVerifications()->create([
                'document_type' => $request->document_type,
                'file_path' => $path,
                'review_status' => DocumentVerification::STATUS_PENDING,
                'uploaded_at' => now(),
            ]);
        }

        return back()->with('success', 'Documento cargado exitosamente. Ahora está pendiente de revisión administrativa.');
    }
}
