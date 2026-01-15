<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'start_date',
        'end_date',
        'place',
        'price',
        'category_id',
        'capacity',
        'image',
        'created_by',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'price' => 'decimal:2',
        'capacity' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the category of the event
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the user who created the event
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all registrations for this event
     */
    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    /**
     * Get all users registered for this event
     */
    public function registeredUsers()
    {
        return $this->belongsToMany(User::class, 'registrations')
                    ->withPivot('created_at')
                    ->withTimestamps();
    }

    /**
     * Check if event is free
     */
    public function isFree(): bool
    {
        return $this->price == 0;
    }

    /**
     * Check if event is active
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Get number of available spots
     */
    public function availableSpots(): int
    {
        return max(0, $this->capacity - $this->registrations()->count());
    }

    /**
     * Check if event is full
     */
    public function isFull(): bool
    {
        return $this->availableSpots() === 0;
    }

    /**
     * Check if user is registered for this event
     */
    public function isRegisteredBy(User $user): bool
    {
        return $this->registrations()->where('user_id', $user->id)->exists();
    }
}