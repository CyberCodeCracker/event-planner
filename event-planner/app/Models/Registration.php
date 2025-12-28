<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'event_id',
    ];

    /**
     * Get the user for this registration
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the event for this registration
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Get the registration date formatted
     */
    public function getFormattedDateAttribute()
    {
        return $this->created_at->format('d/m/Y H:i');
    }
}