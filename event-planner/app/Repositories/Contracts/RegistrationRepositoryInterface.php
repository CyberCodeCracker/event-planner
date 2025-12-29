<?php

namespace App\Repositories\Contracts;

use App\Models\Registration;
use App\Models\User;
use App\Models\Event;
use Illuminate\Pagination\LengthAwarePaginator;

interface RegistrationRepositoryInterface extends RepositoryInterface
{
    public function findByUserAndEvent(int $userId, int $eventId): ?Registration;
    public function getUserRegistrations(int $userId, array $filters = [], int $perPage = 10): LengthAwarePaginator;
    public function getEventRegistrations(int $eventId, int $perPage = 10): LengthAwarePaginator;
    public function countRegistrationsForEvent(int $eventId): int;
    public function registerUserToEvent(User $user, Event $event): Registration;
    public function unregisterUserFromEvent(int $userId, int $eventId): bool;
}