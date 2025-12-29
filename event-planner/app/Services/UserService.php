<?php

namespace App\Services;

use App\DTOs\UserDTO;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        protected UserRepositoryInterface $userRepository
    ) {}

    // Methods now use interface methods
    public function getAllUsers(array $filters = []): LengthAwarePaginator
    {
        return $this->userRepository
            ->with(['createdEvents', 'registrations.event'])
            ->paginate(15);
    }

    public function getUserById(int $id): ?UserDTO
    {
        $user = $this->userRepository->find($id);
        
        return $user ? UserDTO::fromModel($user) : null;
    }

    public function createUser(array $data): UserDTO
    {
        $data['password'] = Hash::make($data['password']);
        
        $user = $this->userRepository->create($data);
        
        return UserDTO::fromModel($user);
    }

    public function updateUser(User $user, array $data): UserDTO
    {
        // If password is being updated, hash it
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $this->userRepository->update($user->id, $data);
        
        return UserDTO::fromModel($user->fresh());
    }

    public function deleteUser(int $id): bool
    {
        return $this->userRepository->delete($id);
    }

    public function updateProfile(User $user, array $data): UserDTO
    {
        // Remove role from data if present (users can't change their own role)
        unset($data['role']);
        
        return $this->updateUser($user, $data);
    }
}