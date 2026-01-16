<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Services\RegistrationService;
use App\Services\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Event;

class RegistrationController extends Controller
{
    public function __construct(
        protected RegistrationService $registrationService,
        protected EventService $eventService
    ) {}

    /**
     * Get user's registrations
     */
    public function index(Request $request): JsonResponse
    {
        $registrations = $this->registrationService->getUserRegistrations(
            $request->user(),
            $request->all()
        );

        return response()->json([
            'success' => true,
            'data' => $registrations->items(),
            'meta' => [
                'current_page' => $registrations->currentPage(),
                'last_page' => $registrations->lastPage(),
                'per_page' => $registrations->perPage(),
                'total' => $registrations->total(),
            ]
        ]);
    }

    /**
     * Register user to event
     */
    public function store(Request $request, Event $event): JsonResponse
    {
        // Check if user can register
        $canRegister = $this->eventService->canRegisterToEvent($request->user(), $event);
        
        if (!$canRegister['can_register']) {
            return response()->json([
                'success' => false,
                'message' => $canRegister['message']
            ], 400);
        }

        try {
            $registration = $this->registrationService->registerUserToEvent(
                $request->user(), 
                $event
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully registered for event',
                'data' => $registration->toArray(),
                'available_spots' => $canRegister['available_spots'] ?? null,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Cancel registration
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            // Get registration
            $registration = $this->registrationService->getRegistrationById($id);
            
            if (!$registration) {
                return response()->json([
                    'success' => false,
                    'message' => 'Registration not found'
                ], 404);
            }
            
            // Check if user owns this registration
            if ($request->user()->id !== $registration->user_id && !$request->user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to cancel this registration'
                ], 403);
            }
            
            // Check if event has already started
            $event = Event::find($registration->event_id);
            if ($event && $event->start_date < now()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot cancel registration for event that has already started'
                ], 400);
            }
            
            $this->registrationService->unregisterById($id);
            
            return response()->json([
                'success' => true,
                'message' => 'Registration cancelled successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Unregister from event (alternative method using event ID)
     */
    public function unregister(Request $request, int $eventId): JsonResponse
    {
        try {
            $this->registrationService->unregisterUserFromEvent($request->user(), $eventId);
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully unregistered from event'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Check if user is registered for event
     */
    public function check(Request $request, int $eventId): JsonResponse
    {
        $isRegistered = $this->registrationService->checkIfUserIsRegistered(
            $request->user(), 
            $eventId
        );
        
        return response()->json([
            'success' => true,
            'data' => [
                'is_registered' => $isRegistered,
            ],
            'message' => $isRegistered ? 'User is registered for this event' : 'User is not registered'
        ]);
    }

    /**
     * Get event registrations (admin only)
     */
    public function eventRegistrations(Request $request, int $eventId): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $registrations = $this->registrationService->getEventRegistrations($eventId);

        return response()->json([
            'success' => true,
            'data' => $registrations->items(),
            'meta' => [
                'current_page' => $registrations->currentPage(),
                'last_page' => $registrations->lastPage(),
                'per_page' => $registrations->perPage(),
                'total' => $registrations->total(),
            ]
        ]);
    }

    /**
     * Get all registrations (admin only)
     */
    public function all(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $registrations = $this->registrationService->getAllRegistrations($request->all());

        return response()->json([
            'success' => true,
            'data' => $registrations->items(),
            'meta' => [
                'current_page' => $registrations->currentPage(),
                'last_page' => $registrations->lastPage(),
                'per_page' => $registrations->perPage(),
                'total' => $registrations->total(),
            ]
        ]);
    }
}