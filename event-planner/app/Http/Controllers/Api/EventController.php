<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Services\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator as FacadesValidator;
use Illuminate\Validation\Validator;

class EventController extends Controller
{
    public function __construct(
        protected EventService $eventService
    ) {}

    /**
     * Get all events
     */
    public function index(Request $request): JsonResponse
    {
        Log::info('=== INDEX METHOD HIT ===', [
            'method' => $request->method(),
        ]);
        $events = $this->eventService->getAllEvents(
            $request->all(),
            $request->user()
        );

        return response()->json([
            'success' => true,
            'data' => $events->items(),
            'meta' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'per_page' => $events->perPage(),
                'total' => $events->total(),
            ]
        ]);
    }

    /**
     * Create a new event
     */
    public function store(StoreEventRequest $request): JsonResponse
    {
        Log::info('=== EVENT STORE START ===');
        Log::info('User:', ['id' => $request->user()->id, 'is_admin' => $request->user()->isAdmin()]);
        Log::info('Request data:', $request->all());

        if (!$request->user()->isAdmin()) {
            Log::warning('User not admin');
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check validation
        Log::info('Validating request...');
        $validator = FacadesValidator::make($request->all(), (new StoreEventRequest())->rules());

        if ($validator->fails()) {
            Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        Log::info('Validation passed');
        Log::info('Validated data:', $request->validated());

        try {
            $event = $this->eventService->createEvent($request->validated(), $request->user());

            Log::info('Event created successfully:', ['event_id' => $event->id]);

            return response()->json([
                'success' => true,
                'message' => 'Event created successfully',
                'data' => $event->toArray()
            ], 201);
        } catch (\Exception $e) {
            Log::error('Event creation error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get event by ID
     */
    public function show(Request $request, int $id): JsonResponse
    {
        Log::info('=== SHOW METHOD HIT ===', [
            'method' => $request->method(),
        ]);
        $event = $this->eventService->getEventById($id, $request->user());

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $event->toArray()
        ]);
    }

    /**
     * Update event
     */
    public function update(UpdateEventRequest $request, int $id): JsonResponse
    {
        Log::info('=== UPDATE METHOD HIT ===', [
            'method' => $request->method(),
        ]);
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $event = $this->eventService->updateEvent($id, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Event updated successfully',
                'data' => $event->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Delete event
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        Log::info('=== DESTROY METHOD HIT ===', [
            'method' => $request->method(),
        ]);
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $this->eventService->deleteEvent($id);

            return response()->json([
                'success' => true,
                'message' => 'Event deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Get upcoming events
     */
    public function upcoming(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 15); // Default to 15, allow override via query parameter
        $events = $this->eventService->getUpcomingEvents((int)$limit);

        return response()->json([
            'success' => true,
            'data' => array_map(function ($event) {
                return $event->toArray();
            }, $events)
        ]);
    }

    /**
     * Get events by category
     */
    public function byCategory(Request $request, int $categoryId): JsonResponse
    {
        $events = $this->eventService->getEventsByCategory($categoryId);

        return response()->json([
            'success' => true,
            'data' => $events->items(),
            'meta' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'per_page' => $events->perPage(),
                'total' => $events->total(),
            ]
        ]);
    }
}
