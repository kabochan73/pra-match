<?php

// マッチングコントローラー：企業のいいね返し・ステータス進行・不成立処理を担当する

namespace App\Http\Controllers;

use App\Models\Matching;
use Illuminate\Http\Request;

class MatchingController extends Controller
{
    // 求職者のマッチング一覧（メッセージできる状態のもの）
    public function userIndex(Request $request)
    {
        $matchings = Matching::with('jobPosting.company')
            ->where('user_id', $request->user()->id)
            ->whereIn('status', ['matched', 'casual_interview', 'interview'])
            ->latest()
            ->get();

        return response()->json($matchings);
    }

    // 企業のマッチング一覧（メッセージできる状態のもの）
    public function companyIndex(Request $request)
    {
        $matchings = Matching::with(['jobPosting', 'user'])
            ->whereHas('jobPosting', function ($q) use ($request) {
                $q->where('company_id', $request->user('company')->id);
            })
            ->whereIn('status', ['matched', 'casual_interview', 'interview'])
            ->latest()
            ->get();

        return response()->json($matchings);
    }

    // 企業が求職者にいいねを返す（pending → matched）
    public function companyLike(Request $request, Matching $matching)
    {
        if ($matching->jobPosting->company_id !== $request->user('company')->id) {
            return response()->json(['message' => '権限がありません。'], 403);
        }

        if ($matching->status !== 'pending') {
            return response()->json(['message' => 'このマッチングは操作できません。'], 422);
        }

        $matching->update(['status' => 'matched']);

        return response()->json($matching);
    }

    // ステータスを次のフェーズへ進める（企業のみ）
    // matched → casual_interview → interview
    public function progressStatus(Request $request, Matching $matching)
    {
        if ($matching->jobPosting->company_id !== $request->user('company')->id) {
            return response()->json(['message' => '権限がありません。'], 403);
        }

        $nextStatus = [
            'matched'          => 'casual_interview',
            'casual_interview'  => 'interview',
        ];

        if (!isset($nextStatus[$matching->status])) {
            return response()->json(['message' => 'これ以上進めません。'], 422);
        }

        $matching->update(['status' => $nextStatus[$matching->status]]);

        return response()->json($matching);
    }

    // 企業がカジュアル面談で不成立にする（casual_interview → rejected）
    public function reject(Request $request, Matching $matching)
    {
        if ($matching->jobPosting->company_id !== $request->user('company')->id) {
            return response()->json(['message' => '権限がありません。'], 403);
        }

        if ($matching->status !== 'casual_interview') {
            return response()->json(['message' => 'カジュアル面談中のみ不成立にできます。'], 422);
        }

        $matching->update(['status' => 'rejected']);

        return response()->json($matching);
    }
}
