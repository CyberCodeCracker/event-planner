<?php

namespace App\DTOs;

use App\Enums\UserRole;

class UserDTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $email,
        public readonly UserRole $role,
        public readonly ?string $profile_image,
        public readonly ?string $phone,
        public readonly string $created_at,
        public readonly string $updated_at,
    ) {}

    public static function fromModel(\App\Models\User $user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            role: $user->role,
            profile_image: $user->profile_image,
            phone: $user->phone,
            created_at: $user->created_at->toIso8601String(),
            updated_at: $user->updated_at->toIso8601String(),
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role->value,
            'role_label' => $this->role->label(),
            'profile_image' => $this->profile_image,
            'phone' => $this->phone,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}