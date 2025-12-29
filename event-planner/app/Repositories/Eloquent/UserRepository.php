<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function getAdmins(): array
    {
        return $this->model->where('role', 'admin')->get()->all();
    }

    public function searchUsers(string $keyword, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->where(function ($query) use ($keyword) {
                $query->where('name', 'LIKE', "%{$keyword}%")
                      ->orWhere('email', 'LIKE', "%{$keyword}%");
            })
            ->paginate($perPage);
    }

    // Override parent method for specific logic
    public function delete(int $id): bool
    {
        $user = $this->find($id);
        
        if (!$user) {
            return false;
        }
        
        // Prevent deleting users with created events
        if ($user->createdEvents()->exists()) {
            throw new \Exception('Cannot delete user with created events');
        }
        
        return parent::delete($id);
    }
}