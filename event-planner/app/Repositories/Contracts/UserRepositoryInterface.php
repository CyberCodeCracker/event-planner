<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface extends RepositoryInterface
{
    public function findByEmail(string $email): ?User;
    public function getAdmins(): array;
    public function searchUsers(string $keyword, int $perPage = 15): LengthAwarePaginator;
}