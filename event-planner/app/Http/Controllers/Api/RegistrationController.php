<?php

namespace App\Services;

use App\Repositories\Contracts\RegistrationRepositoryInterface;
use App\Repositories\Contracts\EventRepositoryInterface;
use App\DTOs\RegistrationDTO;
use App\Models\User;
use App\Models\Event;
use App\Models\Registration;
use Illuminate\Pagination\LengthAwarePaginator;

class RegistrationService
{
    public function __construct(
        protected RegistrationRepositoryInterface $registrationRepository,
        protected EventRepositoryInterface $eventRepository
    ) {}

    /**
     * Get registration by ID
     */
    public function getRegistrationById(int $registrationId): ?RegistrationDTO
    {
        $registration = $this->registrationRepository->find($registrationId);
        
        return $registration ? RegistrationDTO::fromModel($registration) : null;
    }

    /**
     * Get registration by ID (returns Model)
     */
    public function getRegistrationModel(int $registrationId): ?Registration
    {
        return $this->registrationRepository->find($registrationId);
    }

    /**
     * Unregister by registration ID
     */
    public function unregisterById(int $registrationId): bool
    {
        return $this->registrationRepository->delete($registrationId);
    }

    /**
     * Register user to event
     */
    public function registerUserToEvent(User $user, Event $event): RegistrationDTO
    {
        $registration = $this->registrationRepository->registerUserToEvent($user, $event);
        
        return RegistrationDTO::fromModel($registration);
    }

    /**
     * Unregister user from event
     */
    public function unregisterUserFromEvent(User $user, int $eventId): bool
    {
        return $this->registrationRepository->unregisterUserFromEvent($user->id, $eventId);
    }

    /**
     * Get user's registrations
     */
    public function getUserRegistrations(User $user, array $filters = []): LengthAwarePaginator
    {
        $registrations = $this->registrationRepository->getUserRegistrations($user->id, $filters);
        
        $registrations->getCollection()->transform(function ($registration) {
            return RegistrationDTO::fromModel($registration);
        });
        
        return $registrations;
    }

    /**
     * Get event registrations
     */
    public function getEventRegistrations(int $eventId): LengthAwarePaginator
    {
        $registrations = $this->registrationRepository->getEventRegistrations($eventId);
        
        $registrations->getCollection()->transform(function ($registration) {
            return RegistrationDTO::fromModel($registration);
        });
        
        return $registrations;
    }

    /**
     * Check if user is registered for event
     */
    public function checkIfUserIsRegistered(User $user, int $eventId): bool
    {
        return $this->registrationRepository->findByUserAndEvent($user->id, $eventId) !== null;
    }

    /**
     * Get registration count for event
     */
    public function getRegistrationCountForEvent(int $eventId): int
    {
        return $this->registrationRepository->countRegistrationsForEvent($eventId);
    }
}