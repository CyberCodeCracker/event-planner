<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    /**
     * Login user
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $response = $this->authService->login(
            $request->email,
            $request->password
        );

        if (!$response) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        return response()->json($response->toArray());
    }

    /**
     * Register new user
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        // This now returns an array with 'user' and 'token'
        $result = $this->authService->register($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Registration successful',
            'user' => $result['user']->toArray(),  // Access the user from array
            'token' => $result['token']             // Include the token
        ], 201);
    }

    /**
     * Logout user
     */
    public function logout(): JsonResponse
    {
        $success = $this->authService->logout();

        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get current authenticated user
     */
    public function user(): JsonResponse
    {
        $user = $this->authService->getCurrentUser();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Not authenticated'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'user' => $user->toArray()
        ]);
    }
}