<?php

namespace App\Http\Controllers;

use App\Mail\WelcomeMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public function sendMail(Request $request) {
        request()->validate([
            'email' => 'required|email',
            'subject' => 'required|string',
            'message' => 'required|string'
        ]);
        echo $request->message;
        Mail::to($request->email)->send(new WelcomeMail($request->message, $request->subject));
        return response()->json(['success'=>true,'message' => 'Mail sent successfully'], 200);
    }
}
