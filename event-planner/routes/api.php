<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\RegistrationController;
use Illuminate\Support\Facades\Log;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Public read-only routes
Route::apiResource('events', EventController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);

// Protected routes - using Sanctum token authentication
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // User profile
    Route::put('/profile', [UserController::class, 'updateProfile']);

    Route::get('/debug-user', function () {
        $user = \App\Models\User::first();

        if (!$user) {
            return response()->json(['error' => 'No users found']);
        }

        return response()->json([
            'user_id' => $user->id,
            'has_trait' => in_array(\Laravel\Sanctum\HasApiTokens::class, class_uses_recursive($user)),
            'traits' => class_uses_recursive($user),
            'methods' => method_exists($user, 'currentAccessToken') ? 'YES' : 'NO',
            'sanctum_installed' => class_exists(\Laravel\Sanctum\Sanctum::class),
        ]);
    });

    Route::post('/debug-register', function (\Illuminate\Http\Request $request) {
        try {
            // Use \Log:: instead of Log::
            Log::info('Debug register attempt', $request->all());

            // Simple validation
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:8|confirmed',
                'phone' => 'nullable|string'
            ]);

            Log::info('Validation passed', $validated);

            // Create user directly
            $user = \App\Models\User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'role' => \App\Enums\UserRole::USER->value
            ]);

            Log::info('User created', ['user_id' => $user->id]);

            // Create token
            $token = $user->createToken('api-token')->plainTextToken;

            Log::info('Token created');

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email
                ],
                'token' => $token
            ], 201);
        } catch (\Exception $e) {
            dd('Debug register failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    });

    // My registrations
    Route::get('/my-registrations', [RegistrationController::class, 'index']);

    // Event registration
    Route::post('/events/{event}/register', [RegistrationController::class, 'store']);
    Route::delete('/registrations/{registration}', [RegistrationController::class, 'destroy']);

    // Admin-only routes
    Route::middleware('admin')->group(function () {
        // Events (admin CRUD)
        Route::apiResource('events', EventController::class)->except(['index', 'show']);

        // Categories (admin CRUD)
        Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);

        // Users (admin CRUD - except store/register)
        Route::apiResource('users', UserController::class)->except(['store']);
    });
});