<?php

namespace App\Repositories\Contracts;

use App\Models\Category;
use Illuminate\Pagination\LengthAwarePaginator;

interface CategoryRepositoryInterface extends RepositoryInterface
{
    public function findByName(string $name): ?Category;
    public function getCategoriesWithCounts(): array;
    public function getPopularCategories(int $limit = 5): array;
}