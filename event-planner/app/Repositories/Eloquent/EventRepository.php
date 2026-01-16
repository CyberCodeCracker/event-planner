<?php

namespace App\Repositories\Eloquent;

use App\Models\Event;
use App\Repositories\Contracts\EventRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EventRepository extends BaseRepository implements EventRepositoryInterface
{
    public function __construct(Event $model)
    {
        parent::__construct($model);
    }

    public function getActiveEvents(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = $this->model->with(['category', 'creator'])
            ->where('is_active', true)
            ->where('start_date', '>', now());

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'LIKE', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'LIKE', '%' . $filters['search'] . '%')
                  ->orWhere('place', 'LIKE', '%' . $filters['search'] . '%');
            });
        }

        // Price filter
        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }
        
        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        // Date filters
        if (!empty($filters['start_date_from'])) {
            $query->where('start_date', '>=', $filters['start_date_from']);
        }

        return $query->orderBy('start_date')->paginate($perPage);
    }

    public function getUpcomingEvents(int $limit = 5): array
    {
        return $this->model
            ->with(['category'])
            ->where('is_active', true)
            ->where('start_date', '>', now())
            ->orderBy('start_date')
            ->limit($limit)
            ->get()
            ->all();
    }

    public function getEventsByCategory(int $categoryId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model
            ->with(['category', 'creator'])
            ->where('category_id', $categoryId)
            ->where('is_active', true)
            ->orderBy('start_date')
            ->paginate($perPage);
    }

    public function getEventsByUser(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return $this->model
            ->with(['category'])
            ->where('created_by', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function checkUserRegistration(int $userId, int $eventId): bool
    {
        return $this->model->where('id', $eventId)
            ->whereHas('registrations', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->exists();
    }

    public function delete($identifier): bool
    {
        $event = $this->resolveIdentifier($identifier);
        
        if (!$event) {
            return false;
        }
        
        // Delete all registrations for this event first (cascade delete)
        $event->registrations()->delete();
        
        // Delete the event image if it exists
        if ($event->image) {
            $storagePath = str_replace('storage/', '', $event->image);
            if (\Illuminate\Support\Facades\Storage::disk('public')->exists($storagePath)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($storagePath);
            }
        }
        
        return parent::delete($event->id);
    }
}