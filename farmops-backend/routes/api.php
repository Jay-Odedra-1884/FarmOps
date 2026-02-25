<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CropController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\ExpensesCategoryController;
use App\Http\Controllers\FarmController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//for authentication
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);


Route::group([
    "middleware" => "auth:sanctum"
], function () {
    //for category in blog page
    Route::resource('categories', CategoryController::class);

    //for listing in blog page
    Route::resource('listings', ListingController::class);
    Route::get('user-listings', [ListingController::class, 'userListings']);

    //for comments
    Route::resource('comments', CommentController::class);

    //csv file upload
    Route::post('upload-listings-csv', [ListingController::class, 'upload']);

    //likes
    Route::post('likes', [LikeController::class, 'toggle']);

    //expenses

    //expenses category
    Route::resource('expenses-categories', ExpensesCategoryController::class);
    //farm
    Route::resource('farms', FarmController::class);
    //crop
    Route::resource('crops', CropController::class);
    //expenses
    Route::resource('expenses', ExpenseController::class);
    Route::get('all-expenses', [ExpenseController::class, 'getAllExpenses']);

});

//to send mail
Route::post('send-mail', [MailController::class, 'sendMail']);

//to forgot and reset password
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
