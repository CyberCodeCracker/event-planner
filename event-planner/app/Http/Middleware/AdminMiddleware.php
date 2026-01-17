<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {

        // Check if user is authenticated and is admin
        if (!$request->user() || !$request->user()->isAdmin()) {
            Log::warning('=== ADMIN MIDDLEWARE FAILED ===', [
                'has_user' => $request->user() ? 'yes' : 'no',
                'is_admin' => $request->user()?->isAdmin(),
            ]);
            
            return response()->json([
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }

        Log::info('=== ADMIN MIDDLEWARE PASSED ===');

        return $next($request);
    }
}