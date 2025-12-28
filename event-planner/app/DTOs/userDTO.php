<?php

namespace App\DTOs;

class UserDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public string $role,
        public ?string $profile_image = null,
        public ?string $phone = null,
        public string $created_at,
    ) {}

    public static function fromModel(\App\Models\User $user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            role: $user->role->value,
            profile_image: $user->profile_image,
            phone: $user->phone,
            created_at: $user->created_at->toDateTimeString(),
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'profile_image' => $this->profile_image,
            'phone' => $this->phone,
            'created_at' => $this->created_at,
        ];
    }
}