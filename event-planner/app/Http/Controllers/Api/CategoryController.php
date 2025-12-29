<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}

    /**
     * Get all categories
     */
    public function index(Request $request): JsonResponse
    {
        $categories = $this->categoryService->getAllCategories($request->all());

        return response()->json([
            'success' => true,
            'data' => $categories->items(),
            'meta' => [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
            ]
        ]);
    }

    /**
     * Create a new category
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $category = $this->categoryService->createCategory($request->validated());
            
            return response()->json([
                'success' => true,
                'message' => 'Category created successfully',
                'data' => $category->toArray()
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Get category by ID
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $category = $this->categoryService->getCategoryById($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category->toArray()
        ]);
    }

    /**
     * Update category
     */
    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $category = $this->categoryService->updateCategory($id, $request->validated());
            
            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully',
                'data' => $category->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Delete category
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $this->categoryService->deleteCategory($id);
            
            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Get categories with event counts
     */
    public function withCounts(Request $request): JsonResponse
    {
        $categories = $this->categoryService->getCategoriesWithCounts();

        return response()->json([
            'success' => true,
            'data' => array_map(function ($category) {
                return $category->toArray();
            }, $categories)
        ]);
    }

    /**
     * Get popular categories
     */
    public function popular(Request $request): JsonResponse
    {
        $categories = $this->categoryService->getPopularCategories(5);

        return response()->json([
            'success' => true,
            'data' => array_map(function ($category) {
                return $category->toArray();
            }, $categories)
        ]);
    }
}