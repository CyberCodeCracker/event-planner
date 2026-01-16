<?php

namespace App\Services;

use App\DTOs\UserDTO;
use App\DTOs\LoginResponseDTO;
use App\Enums\UserRole;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthService
{
    public function __construct(
        protected UserRepository $userRepository
    ) {}

    public function login(string $email, string $password): ?LoginResponseDTO
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || !Hash::check($password, $user->password)) {
            return null;
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return new LoginResponseDTO(
            user: UserDTO::fromModel($user),
            token: $token,  
            success: true,
            message: 'Login successful'
        );
    }

    public function register(array $data): array
    {
        $data['password'] = Hash::make($data['password']);
        $data['role'] = UserRole::USER->value;

        $user = $this->userRepository->create($data);
        
        // Create token for auto-login after registration
        $token = $user->createToken('api-token')->plainTextToken;

        return [
            'user' => UserDTO::fromModel($user),
            'token' => $token
        ];
    }

    public function logout(): bool
    {
        try {
            // Get the token from the Authorization header
            $token = request()->bearerToken();
            
            if (!$token) {
                return false;
            }
            
            // Hash the token to match what's in the database
            $hashedToken = hash('sha256', $token);
            
            // Delete the token from the database
            $deleted = DB::table('personal_access_tokens')
                ->where('token', $hashedToken)
                ->delete();
            
            return $deleted > 0;
            
        } catch (\Exception $e) {
            return false;
        }
    }

    public function getCurrentUser(): ?UserDTO
    {
        if (!Auth::check()) {
            return null;
        }
        
        $user = Auth::user();
        return $user ? UserDTO::fromModel($user) : null;
    }
}