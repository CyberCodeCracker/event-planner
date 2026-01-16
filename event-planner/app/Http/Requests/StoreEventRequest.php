<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     * Convert FormData boolean strings to actual booleans
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('is_active')) {
            $value = $this->input('is_active');
            // Convert string '1', 'true', 'on', 'yes' to true, everything else to false
            if (is_string($value)) {
                $this->merge([
                    'is_active' => in_array(strtolower($value), ['1', 'true', 'on', 'yes'], true)
                ]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'start_date' => ['required', 'date', 'after:now'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'place' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'capacity' => ['required', 'integer', 'min:1'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,webp', 'max:5120'], // 5MB max
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'start_date.after' => 'La date de début doit être dans le futur',
            'end_date.after' => 'La date de fin doit être après la date de début',
            'category_id.exists' => 'La catégorie sélectionnée n\'existe pas',
        ];
    }
}