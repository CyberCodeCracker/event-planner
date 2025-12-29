<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface RepositoryInterface
{
    public function all(array $columns = ['*']): array;
    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator;
    public function find(int $id, array $columns = ['*']): ?Model;
    public function findBy(string $field, $value, array $columns = ['*']): ?Model;
    public function create(array $data): Model;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function with(array $relations): self;
    public function where(string $column, $operator = null, $value = null): self;
    public function orderBy(string $column, string $direction = 'asc'): self;
}