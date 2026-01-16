<?php

namespace App\Services;

use App\Repositories\Contracts\RegistrationRepositoryInterface;
use App\Repositories\Contracts\EventRepositoryInterface;
use App\DTOs\RegistrationDTO;
use App\Models\User;
use App\Models\Event;
use Illuminate\Pagination\LengthAwarePaginator;

class RegistrationService
{
    public function __construct(
        protected RegistrationRepositoryInterface $registrationRepository,
        protected EventRepositoryInterface $eventRepository
    ) {}

    public function getRegistrationById(int $registrationId): ?RegistrationDTO
    {
        $registration = $this->registrationRepository->find($registrationId);

        return $registration ? RegistrationDTO::fromModel($registration) : null;
    }

    public function registerUserToEvent(User $user, Event $event): RegistrationDTO
    {
        $registration = $this->registrationRepository->registerUserToEvent($user, $event);

        return RegistrationDTO::fromModel($registration);
    }

    public function unregisterUserFromEvent(User $user, int $eventId): bool
    {
        return $this->registrationRepository->unregisterUserFromEvent($user->id, $eventId);
    }

    public function getUserRegistrations(User $user, array $filters = []): LengthAwarePaginator
    {
        $registrations = $this->registrationRepository->getUserRegistrations($user->id, $filters);

        // Transform to DTOs
        $registrations->getCollection()->transform(function ($registration) {
            return RegistrationDTO::fromModel($registration);
        });

        return $registrations;
    }

    public function getEventRegistrations(int $eventId): LengthAwarePaginator
    {
        $registrations = $this->registrationRepository->getEventRegistrations($eventId);

        // Transform to DTOs
        $registrations->getCollection()->transform(function ($registration) {
            return RegistrationDTO::fromModel($registration);
        });

        return $registrations;
    }

    public function getAllRegistrations(array $filters = []): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? 15;
        $registrations = $this->registrationRepository
            ->with(['event', 'user'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Transform to DTOs
        $registrations->getCollection()->transform(function ($registration) {
            return RegistrationDTO::fromModel($registration);
        });

        return $registrations;
    }

    public function unregisterById(int $registrationId): bool
    {
        return $this->registrationRepository->delete($registrationId);
    }

    public function checkIfUserIsRegistered(User $user, int $eventId): bool
    {
        return $this->registrationRepository->findByUserAndEvent($user->id, $eventId) !== null;
    }

    public function getRegistrationCountForEvent(int $eventId): int
    {
        return $this->registrationRepository->countRegistrationsForEvent($eventId);
    }

    public function canRegisterToEvent(User $user, Event $event): array
    {
        // Check if already registered
        if ($this->checkIfUserIsRegistered($user, $event->id)) {
            return [
                'can_register' => false,
                'message' => 'You are already registered for this event'
            ];
        }

        // Check if event is active
        if (!$event->is_active) {
            return [
                'can_register' => false,
                'message' => 'Event is not active'
            ];
        }

        // Check if event has passed
        if ($event->start_date < now()) {
            return [
                'can_register' => false,
                'message' => 'Event has already started or passed'
            ];
        }

        // Check capacity
        $currentRegistrations = $this->getRegistrationCountForEvent($event->id);
        if ($currentRegistrations >= $event->capacity) {
            return [
                'can_register' => false,
                'message' => 'Event is full'
            ];
        }

        return [
            'can_register' => true,
            'message' => 'You can register for this event',
            'available_spots' => $event->capacity - $currentRegistrations
        ];
    }
}
