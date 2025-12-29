<?php

namespace App\Repositories\Contracts;

use App\Models\Event;
use Illuminate\Pagination\LengthAwarePaginator;

interface EventRepositoryInterface extends RepositoryInterface
{
    public function getActiveEvents(array $filters = [], int $perPage = 10): LengthAwarePaginator;
    public function getUpcomingEvents(int $limit = 5): array;
    public function getEventsByCategory(int $categoryId, int $perPage = 10): LengthAwarePaginator;
    public function getEventsByUser(int $userId, int $perPage = 10): LengthAwarePaginator;
    public function checkUserRegistration(int $userId, int $eventId): bool;
}