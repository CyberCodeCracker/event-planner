<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\RegistrationController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Public read-only routes
// Add specific routes BEFORE resource routes to avoid route conflicts
Route::get('/events/upcoming', [EventController::class, 'upcoming']);
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

    // My registrations
    Route::get('/my-registrations', [RegistrationController::class, 'index']);

    // Event registration
    Route::post('/events/{event}/register', [RegistrationController::class, 'store']);
    Route::delete('/registrations/{registration}', [RegistrationController::class, 'destroy']);
    
    // Check registration status and unregister by event ID
    Route::get('/registrations/check/{eventId}', [RegistrationController::class, 'check']);
    Route::delete('/registrations/unregister/{eventId}', [RegistrationController::class, 'unregister']);

    // Admin-only routes
    Route::middleware('admin')->group(function () {
        // Events (admin CRUD)
        Route::apiResource('events', EventController::class)->except(['index', 'show']);

        // Categories (admin CRUD)
        Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);

        // Users (admin CRUD - except store/register)
        Route::apiResource('users', UserController::class)->except(['store']);

        // All registrations (admin only)
        Route::get('/registrations/all', [RegistrationController::class, 'all']);
    });
});
