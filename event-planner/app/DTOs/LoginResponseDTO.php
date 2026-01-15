<?php

namespace App\DTOs;

class LoginResponseDTO
{
    public function __construct(
        public readonly UserDTO $user,
        public readonly string $token,  // Add token parameter
        public readonly bool $success = true,
        public readonly string $message = 'Login successful',
    ) {}

    public function toArray(): array
    {
        return [
            'success' => $this->success,
            'message' => $this->message,
            'user' => $this->user->toArray(),
            'token' => $this->token,  // Include token in response
        ];
    }
}