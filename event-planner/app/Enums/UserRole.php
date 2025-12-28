<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case USER = 'user';

    /**
     * Get the human-readable label for the role
     */
    public function label(): string
    {
        return match($this) {
            self::ADMIN => 'Administrateur',
            self::USER => 'Utilisateur',
        };
    }

    /**
     * Get all role values as array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Check if role is admin
     */
    public function isAdmin(): bool
    {
        return $this === self::ADMIN;
    }

    /**
     * Check if role is user
     */
    public function isUser(): bool
    {
        return $this === self::USER;
    }
}