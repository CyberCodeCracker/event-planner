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
Route::apiResource('events', EventController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // User profile
    Route::put('/profile', [UserController::class, 'updateProfile']);
    
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