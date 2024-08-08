<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function store (Request $request)
    {
        $request->validate([
            'nama' => 'required',
            'harga' => 'required',
            'kode' => 'required'
        ]);

        $product = new Product();
        $product->nama = $request->nama;
        $product->harga = $request->harga;
        $product->kode = $request->kode;
        $product->save();

        return response()->json(['message' => 'Product created', 'product' => $product]);
    }
}
