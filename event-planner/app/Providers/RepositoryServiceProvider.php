<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Bind interfaces to implementations
        $this->app->bind(
            \App\Repositories\Contracts\UserRepositoryInterface::class,
            \App\Repositories\Eloquent\UserRepository::class
        );
        
        $this->app->bind(
            \App\Repositories\Contracts\CategoryRepositoryInterface::class,
            \App\Repositories\Eloquent\CategoryRepository::class
        );
        
        $this->app->bind(
            \App\Repositories\Contracts\EventRepositoryInterface::class,
            \App\Repositories\Eloquent\EventRepository::class
        );
        
        $this->app->bind(
            \App\Repositories\Contracts\RegistrationRepositoryInterface::class,
            \App\Repositories\Eloquent\RegistrationRepository::class
        );
    }
}