<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    public $table = 'm_customer';

    public $timestamps = false;

    public $fillable = [
        'nama',
        'kode',
        'telp'
    ];
}
