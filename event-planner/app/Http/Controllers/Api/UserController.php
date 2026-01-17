<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\UpdateProfileRequest;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {
        $this->middleware('auth:sanctum');
    }

    /**
     * Get all users (admin only)
     */
    public function index(Request $request): JsonResponse
    {
        if($request->user() === null){
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $users = $this->userService->getAllUsers($request->all());

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    /**
     * Get user by ID (admin only)
     */
    public function show(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->isAdmin() && $request->user()->id !== $id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = $this->userService->getUserById($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user->toArray()
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->userService->updateProfile(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user->toArray()
        ]);
    }

    /**
     * Delete user (admin only)
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($request->user()->id === $id) {
            return response()->json(['message' => 'Cannot delete your own account'], 400);
        }

        $user = $this->userService->getUserById($id);
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        try {
            $this->userService->deleteUser($user->id);
            
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}