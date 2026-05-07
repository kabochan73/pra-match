<?php

use App\Http\Controllers\CompanyAuthController;
use App\Http\Controllers\JobPostingController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\MatchingController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserAuthController;
use Illuminate\Support\Facades\Route;

// 求職者認証
Route::prefix('user')->group(function () {
    Route::post('/register', [UserAuthController::class, 'register']);
    Route::post('/login',    [UserAuthController::class, 'login']);
    Route::post('/logout',   [UserAuthController::class, 'logout'])->middleware('auth:sanctum');
});

// 企業認証
Route::prefix('company')->group(function () {
    Route::post('/register', [CompanyAuthController::class, 'register']);
    Route::post('/login',    [CompanyAuthController::class, 'login']);
    Route::post('/logout',   [CompanyAuthController::class, 'logout'])->middleware('auth:company');
});

// 求人（認証不要）
Route::get('/job-postings',      [JobPostingController::class, 'index']);
Route::get('/job-postings/{jobPosting}', [JobPostingController::class, 'show']);

// 求職者向けルート
Route::middleware('auth:sanctum')->group(function () {
    // いいね
    Route::post('/job-postings/{jobPosting}/like', [LikeController::class, 'store']);
    Route::get('/likes',                           [LikeController::class, 'index']);

    // メッセージ（求職者側）
    Route::get('/matchings/{matching}/messages',  [MessageController::class, 'index']);
    Route::post('/matchings/{matching}/messages', [MessageController::class, 'store']);
});

// 企業向けルート
Route::middleware('auth:company')->group(function () {
    // 求人CRUD
    Route::post('/job-postings',               [JobPostingController::class, 'store']);
    Route::put('/job-postings/{jobPosting}',   [JobPostingController::class, 'update']);
    Route::delete('/job-postings/{jobPosting}',[JobPostingController::class, 'destroy']);

    // いいね確認（企業側）
    Route::get('/job-postings/{jobPosting}/likes', [LikeController::class, 'companyIndex']);

    // マッチング操作
    Route::post('/matchings/{matching}/like',     [MatchingController::class, 'companyLike']);
    Route::post('/matchings/{matching}/progress', [MatchingController::class, 'progressStatus']);
    Route::post('/matchings/{matching}/reject',   [MatchingController::class, 'reject']);
});
