<?php

namespace App\DTOs;

use App\Models\Event;
use App\DTOs\CategoryDTO;
use App\DTOs\UserDTO;

class EventDTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $title,
        public readonly string $description,
        public readonly string $start_date,
        public readonly string $end_date,
        public readonly string $place,
        public readonly float $price,
        public readonly int $category_id,
        public readonly int $capacity,
        public readonly ?string $image,
        public readonly int $created_by,
        public readonly bool $is_active,
        public readonly string $created_at,
        public readonly string $updated_at,
        public readonly ?CategoryDTO $category = null,
        public readonly ?UserDTO $creator = null,
        public readonly ?int $available_spots = null,
        public readonly ?int $registrations_count = null,
        public readonly ?bool $is_registered = null,
    ) {}

    public static function fromModel(Event $event, ?bool $isRegistered = null): self
    {
        return new self(
            id: $event->id,
            title: $event->title,
            description: $event->description,
            start_date: $event->start_date->toIso8601String(),
            end_date: $event->end_date->toIso8601String(),
            place: $event->place,
            price: (float) $event->price,
            category_id: $event->category_id,
            capacity: $event->capacity,
            image: $event->image,
            created_by: $event->created_by,
            is_active: $event->is_active,
            created_at: $event->created_at->toIso8601String(),
            updated_at: $event->updated_at->toIso8601String(),
            category: $event->relationLoaded('category') && $event->category 
                ? CategoryDTO::fromModel($event->category) 
                : null,
            creator: $event->relationLoaded('creator') && $event->creator 
                ? UserDTO::fromModel($event->creator) 
                : null,
            available_spots: $event->availableSpots(),
            registrations_count: $event->registrations_count ?? $event->registrations()->count(),
            is_registered: $isRegistered,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'place' => $this->place,
            'price' => $this->price,
            'category_id' => $this->category_id,
            'capacity' => $this->capacity,
            'image' => $this->image,
            'created_by' => $this->created_by,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'category' => $this->category?->toArray(),
            'creator' => $this->creator?->toArray(),
            'available_spots' => $this->available_spots,
            'registrations_count' => $this->registrations_count,
            'is_registered' => $this->is_registered,
            'is_free' => $this->price == 0,
        ];
    }
}