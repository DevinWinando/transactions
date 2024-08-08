<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesDet extends Model
{
    public $table = 't_sales_det';

    public $timestamps = false;

    public $fillable = [
        'barang_id',
        'qty',
        'harga_bandrol',
        'diskon_pct',
        'diskon_nilai',
        'harga_diskon',
        'total'
    ];

    use HasFactory;
}
