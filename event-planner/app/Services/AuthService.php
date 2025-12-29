<?php

namespace App\Services;

use App\DTOs\UserDTO;
use App\DTOs\LoginResponseDTO;
use App\Enums\UserRole;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

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

        // Login using Sanctum (will create session)
        Auth::login($user);
        
        return new LoginResponseDTO(
            user: UserDTO::fromModel($user)
        );
    }

    public function register(array $data): UserDTO
    {
        $data['password'] = Hash::make($data['password']);
        $data['role'] = UserRole::USER->value;
        
        $user = $this->userRepository->create($data);
        
        // Auto-login after registration
        Auth::login($user);
        
        return UserDTO::fromModel($user);
    }

    public function logout(): void
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }

    public function getCurrentUser(): ?UserDTO
    {
        $user = Auth::user();
        
        return $user ? UserDTO::fromModel($user) : null;
    }
}