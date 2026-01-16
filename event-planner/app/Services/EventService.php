<?php

namespace App\Services;

use App\Repositories\Contracts\EventRepositoryInterface;
use App\Repositories\Contracts\RegistrationRepositoryInterface;
use App\DTOs\EventDTO;
use App\Models\User;
use App\Models\Event;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


class EventService
{
    public function __construct(
        protected EventRepositoryInterface $eventRepository,
        protected RegistrationRepositoryInterface $registrationRepository
    ) {}

    public function getAllEvents(array $filters = [], ?User $user = null): LengthAwarePaginator
    {
        $events = $this->eventRepository->getActiveEvents($filters);

        $events->getCollection()->transform(function ($event) use ($user) {
            $isRegistered = $user ? $this->eventRepository->checkUserRegistration($user->id, $event->id) : null;
            return EventDTO::fromModel($event, $isRegistered);
        });

        return $events;
    }

    public function getEventById(int $eventId, ?User $user = null): ?EventDTO
    {
        $event = $this->eventRepository->find($eventId);

        if (!$event) {
            return null;
        }

        $isRegistered = $user ? $this->eventRepository->checkUserRegistration($user->id, $eventId) : null;

        return EventDTO::fromModel($event, $isRegistered);
    }

    public function createEvent(array $data, User $user): EventDTO
    {
        $data['created_by'] = $user->id;
        $data['is_active'] = $data['is_active'] ?? true;

        // Handle image file upload
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            $imagePath = $this->storeImage($data['image']);
            $data['image'] = $imagePath;
        }

        try {
            $event = $this->eventRepository->create($data);
            return EventDTO::fromModel($event);
        } catch (\Exception $e) {
            Log::error('EventRepository::create failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function updateEvent(int $eventId, array $data): EventDTO
    {
        // Handle image file upload
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            // Delete old image if exists
            $oldEvent = $this->eventRepository->find($eventId);
            if ($oldEvent && $oldEvent->image) {
                $this->deleteImage($oldEvent->image);
            }
            
            $imagePath = $this->storeImage($data['image']);
            $data['image'] = $imagePath;
        }

        $this->eventRepository->update($eventId, $data);
        $event = $this->eventRepository->find($eventId);

        return EventDTO::fromModel($event);
    }

    /**
     * Store uploaded image and return the path
     */
    private function storeImage(\Illuminate\Http\UploadedFile $file): string
    {
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        
        // Explicitly use the 'public' disk to store in storage/app/public/events
        $path = $file->storeAs('events', $filename, 'public');
        
        // Return the public URL path (storage/events/filename)
        return 'storage/events/' . $filename;
    }

    /**
     * Delete image file
     */
    private function deleteImage(string $imagePath): void
    {
        // Convert storage/events/filename to events/filename for the public disk
        $storagePath = str_replace('storage/', '', $imagePath);
        if (Storage::disk('public')->exists($storagePath)) {
            Storage::disk('public')->delete($storagePath);
        }
    }

    public function deleteEvent(int $eventId): bool
    {
        return $this->eventRepository->delete($eventId);
    }

    public function getUpcomingEvents(int $limit = 5): array
    {
        $events = $this->eventRepository->getUpcomingEvents($limit);

        return array_map(function ($event) {
            return EventDTO::fromModel($event);
        }, $events);
    }

    public function getEventsByCategory(int $categoryId): LengthAwarePaginator
    {
        $events = $this->eventRepository->getEventsByCategory($categoryId);

        $events->getCollection()->transform(function ($event) {
            $user = Auth::user();
            $isRegistered = $user ? $this->eventRepository->checkUserRegistration($user->id, $event->id) : null;
            return EventDTO::fromModel($event, $isRegistered);
        });

        return $events;
    }

    public function getUserEvents(int $userId): LengthAwarePaginator
    {
        $events = $this->eventRepository->getEventsByUser($userId);

        $events->getCollection()->transform(function ($event) {
            return EventDTO::fromModel($event);
        });

        return $events;
    }

    public function canRegisterToEvent(User $user, Event $event): array
    {
        // Check if already registered
        if ($this->eventRepository->checkUserRegistration($user->id, $event->id)) {
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
        $currentRegistrations = $this->registrationRepository->countRegistrationsForEvent($event->id);
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
