<?php

// メッセージコントローラー：マッチング成立後の求職者・企業間のメッセージ送受信を担当する

namespace App\Http\Controllers;

use App\Models\Matching;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // メッセージ一覧を取得
    public function index(Request $request, Matching $matching)
    {
        $this->authorizeMatching($request, $matching);

        $messages = $matching->messages()->oldest()->get();

        return response()->json($messages);
    }

    // メッセージを送信
    public function store(Request $request, Matching $matching)
    {
        $this->authorizeMatching($request, $matching);

        // matchedステータス以降のみメッセージ送信可能
        $allowedStatuses = ['matched', 'casual_interview', 'interview'];
        if (!in_array($matching->status, $allowedStatuses)) {
            return response()->json(['message' => 'マッチングが成立していません。'], 422);
        }

        $request->validate([
            'body' => 'required|string',
        ]);

        [$senderType, $senderId] = $this->getSender($request);

        $message = Message::create([
            'match_id'    => $matching->id,
            'sender_type' => $senderType,
            'sender_id'   => $senderId,
            'body'        => $request->body,
        ]);

        return response()->json($message, 201);
    }

    // リクエストしたユーザーがこのマッチングの当事者か確認
    private function authorizeMatching(Request $request, Matching $matching): void
    {
        $user    = $request->user('sanctum') instanceof \App\Models\User
                       ? $request->user('sanctum')
                       : null;
        $company = $request->user('company');

        $isUser    = $user    && $matching->user_id        === $user->id;
        $isCompany = $company && $matching->jobPosting->company_id === $company->id;

        if (!$isUser && !$isCompany) {
            abort(403, '権限がありません。');
        }
    }

    // 送信者の種別とIDを返す。
    // auth:sanctum,company では sanctum が先に評価されるため、
    // $request->user() が Company を返すことがある。instanceof で型を明示的に判定する。
    private function getSender(Request $request): array
    {
        if ($request->user('sanctum') instanceof \App\Models\User) {
            return ['user', $request->user('sanctum')->id];
        }

        return ['company', $request->user('company')->id];
    }
}
