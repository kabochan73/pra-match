<?php

// 企業の認証コントローラー：登録・ログイン・ログアウトを担当する

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class CompanyAuthController extends Controller
{
    // 企業の新規登録
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:companies,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $company = Company::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $company->createToken('company-token')->plainTextToken;

        return response()->json([
            'company' => $company,
            'token'   => $token,
        ], 201);
    }

    // 企業のログイン
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $company = Company::where('email', $request->email)->first();

        if (!$company || !Hash::check($request->password, $company->password)) {
            throw ValidationException::withMessages([
                'email' => ['メールアドレスまたはパスワードが正しくありません。'],
            ]);
        }

        $token = $company->createToken('company-token')->plainTextToken;

        return response()->json([
            'company' => $company,
            'token'   => $token,
        ]);
    }

    // プロフィール取得
    public function profile(Request $request)
    {
        return response()->json($request->user('company'));
    }

    // プロフィール更新
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'industry'    => 'nullable|string|max:255',
            'prefecture'  => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $request->user('company')->update($validated);

        return response()->json($request->user('company')->fresh());
    }

    // 企業のログアウト
    public function logout(Request $request)
    {
        $request->user('company')->currentAccessToken()->delete();

        return response()->json(['message' => 'ログアウトしました。']);
    }
}
