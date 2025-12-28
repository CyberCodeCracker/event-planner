<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Administrateur',
            'email' => 'admin@eventplanner.com',
            'password' => Hash::make('admin123'),
            'role' => UserRole::ADMIN->value,
            'phone' => '0600000000',
        ]);

        // Create some test users (optional)
        User::create([
            'name' => 'Souhail Amouri',
            'email' => 'souhail@gmail.com',
            'password' => Hash::make('Souhail123'),
            'role' => UserRole::USER->value,
            'phone' => '54545454',
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => Hash::make('password123'),
            'role' => UserRole::USER->value,
            'phone' => '0698765432',
        ]);

        $this->command->info('Admin user created successfully!');
        $this->command->info('Email: admin@eventplanner.com');
        $this->command->info('Password: admin123');
    }
}