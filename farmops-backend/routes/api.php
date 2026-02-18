<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\MailController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//for authentication
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);


Route::group([
    "middleware"=>"auth:sanctum"
], function() {
//for category in blog page
Route::resource('categories', CategoryController::class);

//for listing in blog page
Route::resource('listings', ListingController::class);

});

//to send mail
Route::post('send-mail', [MailController::class, 'sendMail']);

//to forgot and reset password
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
