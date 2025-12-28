<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

    /**
     * Get all events in this category
     */
    public function events()
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Get active events in this category
     */
    public function activeEvents()
    {
        return $this->hasMany(Event::class)->where('is_active', true);
    }
}