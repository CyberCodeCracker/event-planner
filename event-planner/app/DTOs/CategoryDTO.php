<?php

namespace App\DTOs;

use App\Models\Category;

class CategoryDTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $created_at,
        public readonly string $updated_at,
        public readonly ?int $events_count = null,
    ) {}

    public static function fromModel(Category $category): self
    {
        return new self(
            id: $category->id,
            name: $category->name,
            created_at: $category->created_at->toIso8601String(),
            updated_at: $category->updated_at->toIso8601String(),
            events_count: $category->events_count ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'events_count' => $this->events_count,
        ];
    }
}