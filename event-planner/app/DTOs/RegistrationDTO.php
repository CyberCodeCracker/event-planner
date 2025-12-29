<?php

namespace App\DTOs;

use App\Models\Registration;

class RegistrationDTO
{
    public function __construct(
        public readonly int $id,
        public readonly int $user_id,
        public readonly int $event_id,
        public readonly string $created_at,
        public readonly string $updated_at,
        public readonly ?UserDTO $user = null,
        public readonly ?EventDTO $event = null,
    ) {}

    public static function fromModel(Registration $registration): self
    {
        return new self(
            id: $registration->id,
            user_id: $registration->user_id,
            event_id: $registration->event_id,
            created_at: $registration->created_at->toIso8601String(),
            updated_at: $registration->updated_at->toIso8601String(),
            user: $registration->relationLoaded('user') && $registration->user 
                ? UserDTO::fromModel($registration->user) 
                : null,
            event: $registration->relationLoaded('event') && $registration->event 
                ? EventDTO::fromModel($registration->event) 
                : null,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'event_id' => $this->event_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => $this->user?->toArray(),
            'event' => $this->event?->toArray(),
        ];
    }
}