<?php

// 求人投稿コントローラー：求人のCRUDを担当する（一覧・詳細は全員、作成・編集・削除は企業のみ）

namespace App\Http\Controllers;

use App\Models\JobPosting;
use Illuminate\Http\Request;

class JobPostingController extends Controller
{
    // 求人一覧（求職者向け・公開中のみ）
    public function index()
    {
        $jobPostings = JobPosting::with('company')
            ->where('is_active', true)
            ->latest()
            ->get();

        return response()->json($jobPostings);
    }

    // 求人詳細
    public function show(JobPosting $jobPosting)
    {
        return response()->json($jobPosting->load('company'));
    }

    // 求人作成（ログイン中の企業のみ）
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'           => 'required|string|max:255',
            'description'     => 'nullable|string',
            'salary'          => 'nullable|string|max:255',
            'employment_type' => 'nullable|string|max:255',
            'prefecture'      => 'nullable|string|max:255',
        ]);

        $jobPosting = $request->user('company')->jobPostings()->create($validated);

        return response()->json($jobPosting, 201);
    }

    // 求人編集（自社の求人のみ）
    public function update(Request $request, JobPosting $jobPosting)
    {
        if ($jobPosting->company_id !== $request->user('company')->id) {
            return response()->json(['message' => '権限がありません。'], 403);
        }

        $validated = $request->validate([
            'title'           => 'sometimes|string|max:255',
            'description'     => 'nullable|string',
            'salary'          => 'nullable|string|max:255',
            'employment_type' => 'nullable|string|max:255',
            'prefecture'      => 'nullable|string|max:255',
            'is_active'       => 'sometimes|boolean',
        ]);

        $jobPosting->update($validated);

        return response()->json($jobPosting);
    }

    // 求人削除（自社の求人のみ）
    public function destroy(Request $request, JobPosting $jobPosting)
    {
        if ($jobPosting->company_id !== $request->user('company')->id) {
            return response()->json(['message' => '権限がありません。'], 403);
        }

        $jobPosting->delete();

        return response()->json(['message' => '求人を削除しました。']);
    }
}
