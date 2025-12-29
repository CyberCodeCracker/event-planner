<?php

namespace App\Services;

use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\DTOs\CategoryDTO;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoryService
{
    public function __construct(
        protected CategoryRepositoryInterface $categoryRepository
    ) {}

    public function getAllCategories(array $filters = []): LengthAwarePaginator
    {
        $categories = $this->categoryRepository->paginate(15);
        
        // Transform to DTOs
        $categories->getCollection()->transform(function ($category) {
            return CategoryDTO::fromModel($category);
        });
        
        return $categories;
    }

    public function getCategoryById(int $id): ?CategoryDTO
    {
        $category = $this->categoryRepository->find($id);
        
        return $category ? CategoryDTO::fromModel($category) : null;
    }

    public function createCategory(array $data): CategoryDTO
    {
        // Check if category with same name exists
        $existing = $this->categoryRepository->findByName($data['name']);
        if ($existing) {
            throw new \Exception('Category with this name already exists');
        }

        $category = $this->categoryRepository->create($data);
        
        return CategoryDTO::fromModel($category);
    }

    public function updateCategory(int $id, array $data): CategoryDTO
    {
        $category = $this->categoryRepository->find($id);
        
        if (!$category) {
            throw new \Exception('Category not found');
        }

        // Check name uniqueness (if name is being changed)
        if (isset($data['name']) && $data['name'] !== $category->name) {
            $existing = $this->categoryRepository->findByName($data['name']);
            if ($existing) {
                throw new \Exception('Category with this name already exists');
            }
        }

        $this->categoryRepository->update($id, $data);
        
        return CategoryDTO::fromModel($category->fresh());
    }

    public function deleteCategory(int $id): bool
    {
        return $this->categoryRepository->delete($id);
    }

    public function getCategoriesWithCounts(): array
    {
        $categories = $this->categoryRepository->getCategoriesWithCounts();
        
        return array_map(function ($category) {
            return CategoryDTO::fromModel($category);
        }, $categories);
    }

    public function getPopularCategories(int $limit = 5): array
    {
        $categories = $this->categoryRepository->getPopularCategories($limit);
        
        return array_map(function ($category) {
            return CategoryDTO::fromModel($category);
        }, $categories);
    }
}