<?php

namespace App\Repositories\Eloquent;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Support\Facades\DB;

class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    public function findByName(string $name): ?Category
    {
        return $this->model->where('name', $name)->first();
    }

    public function getCategoriesWithCounts(): array
    {
        return $this->model
            ->select('categories.*', DB::raw('COUNT(events.id) as events_count'))
            ->leftJoin('events', 'categories.id', '=', 'events.category_id')
            ->where('events.is_active', true)
            ->groupBy('categories.id')
            ->orderBy('events_count', 'desc')
            ->get()
            ->all();
    }

    public function getPopularCategories(int $limit = 5): array
    {
        return $this->model
            ->select('categories.*', DB::raw('COUNT(events.id) as events_count'))
            ->leftJoin('events', 'categories.id', '=', 'events.category_id')
            ->where('events.is_active', true)
            ->where('events.start_date', '>', now())
            ->groupBy('categories.id')
            ->orderBy('events_count', 'desc')
            ->limit($limit)
            ->get()
            ->all();
    }

    // Override delete to check for events
    public function delete(int $id): bool
    {
        $category = $this->find($id);
        
        if (!$category) {
            return false;
        }
        
        // Check if category has events
        if ($category->events()->exists()) {
            throw new \Exception('Cannot delete category with associated events');
        }
        
        return parent::delete($id);
    }
}