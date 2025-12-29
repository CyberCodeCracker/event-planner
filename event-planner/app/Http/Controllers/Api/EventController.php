<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Services\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event = $this->eventService->createEvent($request->validated(), $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Event created successfully',
            'data' => $event->toArray()
        ], 201);
    }

    /**
     * Get event by ID
     */
    public function show(Request $request, int $id): JsonResponse
    {
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
        $events = $this->eventService->getUpcomingEvents(5);

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