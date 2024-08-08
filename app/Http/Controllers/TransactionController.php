<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionStoreAPIRequest;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sales;
use Carbon\Carbon;

class TransactionController extends Controller
{
    public function index()
    {
        $sales = Sales::withSum('details', 'qty')->with('customer:nama,id')->get()->map(function ($sale) {
            $sale->tgl = Carbon::parse($sale->tgl)->format('d-m-Y');
            $sale->subtotal = number_format($sale->subtotal, 0, ',', '.');
            $sale->diskon = number_format($sale->diskon, 0, ) . '%';
            $sale->ongkir = number_format($sale->ongkir, 0, ',', '.');
            $sale->total_bayar = number_format($sale->total_bayar, 0, ',', '.');
            $sale->cust = $sale->customer->nama ?? 'Tidak ada';

            return $sale;
        });

        $grandTotal = $sales->sum('total_bayar');

        return inertia('Transaction/Index', [
            'sales' => $sales,
            'grandTotal' => number_format($grandTotal, 0, ',', '.'),
        ]);
    }

    public function create()
    {
        $customers = Customer::select('id', 'nama')->get();
        $products = Product::select('id', 'nama', 'harga')->get();

        return inertia('Transaction/Create', [
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    public function store(TransactionStoreAPIRequest $request)
    {
        $request->validated();

        $sales = new Sales();
        $sales->cust_id = $request->customer_id;
        $sales->kode = $request->kode;
        $sales->tgl = Carbon::parse($request->tgl)->toDateTime();
        $sales->diskon = $request->diskon ?? 0;
        $sales->ongkir = $request->ongkir ?? 0;
        $sales->subtotal = 0;
        $sales->total_bayar = 0;
        $sales->save();

        foreach ($request->details as $detail) {
            $harga = $detail['harga_bandrol'];
            $diskon = $detail['diskon'] ?? 0;
            $diskonNilai = $harga * $diskon / 100;
            $hargaDiskon = $harga - $diskonNilai;
            $total = $hargaDiskon * $detail['qty'];

            $sales->details()->create([
                'barang_id' => $detail['barang_id'],
                'qty' => $detail['qty'],
                'harga_bandrol' => $harga,
                'diskon_pct' => $diskon,
                'diskon_nilai' => $diskonNilai,
                'harga_diskon' => $hargaDiskon,
                'total' => $total,
            ]);
        }

        $subtotal = $sales->details->sum('total');
        $sales->subtotal = $subtotal;
        $sales->total_bayar = $subtotal - $sales->diskon + $sales->ongkir;
        $sales->save();

        return response()->json([
            'message' => 'Data berhasil disimpan',
            'data' => $sales,
        ]);
    }
}
