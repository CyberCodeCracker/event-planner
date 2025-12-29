<?php

namespace App\Repositories\Eloquent;

use App\Models\Registration;
use App\Models\User;
use App\Models\Event;
use App\Repositories\Contracts\RegistrationRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class RegistrationRepository extends BaseRepository implements RegistrationRepositoryInterface
{
    public function __construct(Registration $model)
    {
        parent::__construct($model);
    }

    public function findByUserAndEvent(int $userId, int $eventId): ?Registration
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('event_id', $eventId)
            ->first();
    }

    public function getUserRegistrations(int $userId, array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = $this->model
            ->with(['event.category', 'event.creator'])
            ->where('user_id', $userId);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getEventRegistrations(int $eventId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model
            ->with(['user'])
            ->where('event_id', $eventId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function countRegistrationsForEvent(int $eventId): int
    {
        return $this->model->where('event_id', $eventId)->count();
    }

    public function registerUserToEvent(User $user, Event $event): Registration
    {
        // Check if already registered
        $existing = $this->findByUserAndEvent($user->id, $event->id);
        if ($existing) {
            throw new \Exception('User is already registered for this event');
        }

        // Check if event is full
        $currentRegistrations = $this->countRegistrationsForEvent($event->id);
        if ($currentRegistrations >= $event->capacity) {
            throw new \Exception('Event is full');
        }

        // Create registration
        return $this->create([
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
    }

    public function unregisterUserFromEvent(int $userId, int $eventId): bool
    {
        $registration = $this->findByUserAndEvent($userId, $eventId);
        
        if (!$registration) {
            throw new \Exception('Registration not found');
        }

        return $registration->delete();
    }

    // Override create to ensure uniqueness
    public function create(array $data): Registration
    {
        // Check for duplicate
        $existing = $this->findByUserAndEvent($data['user_id'], $data['event_id']);
        if ($existing) {
            throw new \Exception('User is already registered for this event');
        }

        return parent::create($data);
    }
}