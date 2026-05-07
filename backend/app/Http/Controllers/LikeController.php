<?php

// いいねコントローラー：求職者のいいね送信・一覧、企業への受信いいね一覧を担当する

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\JobPosting;
use App\Models\Matching;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LikeController extends Controller
{
    // 求職者が求人にいいねする
    public function store(Request $request, JobPosting $jobPosting)
    {
        $user = $request->user();

        // すでにいいね済みの場合はエラー
        $exists = Like::where('user_id', $user->id)
            ->where('job_posting_id', $jobPosting->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'すでにいいね済みです。'], 409);
        }

        $like = Like::create([
            'user_id'        => $user->id,
            'job_posting_id' => $jobPosting->id,
            'expires_at'     => Carbon::now()->addWeek(),
        ]);

        // マッチングレコードをpendingで作成
        Matching::create([
            'user_id'        => $user->id,
            'job_posting_id' => $jobPosting->id,
            'status'         => 'pending',
        ]);

        return response()->json($like, 201);
    }

    // 求職者がいいねした求人一覧
    public function index(Request $request)
    {
        $likes = Like::with('jobPosting.company')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($likes);
    }

    // 企業が自社求人へのいいね一覧を取得（マッチング情報も付与）
    public function companyIndex(Request $request, JobPosting $jobPosting)
    {
        if ($jobPosting->company_id !== $request->user('company')->id) {
            return response()->json(['message' => '権限がありません。'], 403);
        }

        $likes = Like::with('user')
            ->where('job_posting_id', $jobPosting->id)
            ->latest()
            ->get();

        // 各いいねに対応するマッチングをまとめて取得してN+1を回避
        $matchings = Matching::where('job_posting_id', $jobPosting->id)
            ->whereIn('user_id', $likes->pluck('user_id'))
            ->get()
            ->keyBy('user_id');

        $likes = $likes->map(function ($like) use ($matchings) {
            $like->matching = $matchings->get($like->user_id);
            return $like;
        });

        return response()->json($likes);
    }
}
