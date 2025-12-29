<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository implements RepositoryInterface
{
    protected Model $model;
    protected array $with = [];
    protected array $where = [];
    protected array $orderBy = [];

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(array $columns = ['*']): array
    {
        $query = $this->model->with($this->with)->select($columns);

        foreach ($this->where as $condition) {
            $query->where(...$condition);
        }

        foreach ($this->orderBy as $order) {
            $query->orderBy(...$order);
        }

        return $query->get()->all();
    }

    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        $query = $this->model->with($this->with)->select($columns);

        foreach ($this->where as $condition) {
            $query->where(...$condition);
        }

        foreach ($this->orderBy as $order) {
            $query->orderBy(...$order);
        }

        return $query->paginate($perPage);
    }

    public function find(int $id, array $columns = ['*']): ?Model
    {
        $query = $this->model->with($this->with)->select($columns);

        foreach ($this->where as $condition) {
            $query->where(...$condition);
        }

        foreach ($this->orderBy as $order) {
            $query->orderBy(...$order);
        }

        return $query->find($id);
    }

    public function findBy(string $field, $value, array $columns = ['*']): ?Model
    {
        $query = $this->model->with($this->with)->select($columns);

        $query->where($field, $value);

        foreach ($this->where as $condition) {
            $query->where(...$condition);
        }

        foreach ($this->orderBy as $order) {
            $query->orderBy(...$order);
        }

        return $query->first();
    }

    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        $model = $this->find($id);

        if (!$model) {
            return false;
        }

        return $model->update($data);
    }

    public function delete(int $id): bool
    {
        $model = $this->find($id);

        if (!$model) {
            return false;
        }

        return $model->delete();
    }

    public function with(array $relations): self
    {
        $this->with = $relations;
        return $this;
    }

    public function where(string $column, $operator = null, $value = null): self
    {
        if (func_num_args() === 2) {
            $value = $operator;
            $operator = '=';
        }

        $this->where[] = [$column, $operator, $value];
        return $this;
    }

    public function orderBy(string $column, string $direction = 'asc'): self
    {
        $this->orderBy[] = [$column, $direction];
        return $this;
    }

    // Reset query builder for new queries
    protected function resetQuery(): void
    {
        $this->with = [];
        $this->where = [];
        $this->orderBy = [];
    }

    protected function resolveIdentifier($identifier)
    {
        if ($identifier instanceof \Illuminate\Database\Eloquent\Model) {
            return $identifier;
        }

        if (is_int($identifier) || is_numeric($identifier)) {
            return $this->find((int) $identifier);
        }

        return null;
    }
}
