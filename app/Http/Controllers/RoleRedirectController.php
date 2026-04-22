<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RoleRedirectController extends Controller
{
    public function dashboard(Request $request): RedirectResponse
    {
        return redirect()->route($request->user()->homeRouteName());
    }

    public function routes(Request $request): RedirectResponse
    {
        $routeName = $request->user()->routesRouteName();

        if ($routeName === null) {
            return redirect()->route($request->user()->homeRouteName());
        }

        return redirect()->route($routeName);
    }
}
