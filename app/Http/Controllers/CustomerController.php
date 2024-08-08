<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerStoreAPIRequest;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function store(CustomerStoreAPIRequest $request)
    {
        $request->validated();

        $customer = new Customer();
        $customer->nama = $request->nama;
        $customer->kode = $request->kode;
        $customer->telp = $request->telp;
        $customer->save();

        return response()->json(['message' => 'Customer created', 'customer' => $customer]);
    }
}
