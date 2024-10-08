<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [TransactionController::class, 'index']);
Route::get('/create', [TransactionController::class, 'create']);
Route::post('/store', [TransactionController::class, 'store']);

Route::post('/customer', [CustomerController::class, 'store']);
Route::post('/product', [ProductController::class, 'store']);
