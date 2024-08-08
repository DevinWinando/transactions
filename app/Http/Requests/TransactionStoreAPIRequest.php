<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransactionStoreAPIRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'kode' => 'required|unique:t_sales',
            'tgl' => 'required|date',
            'customer_id' => 'required',
            'details' => 'required|array',
            'details.*.barang_id' => 'required',
            'details.*.qty' => 'required',
            'details.*.harga_bandrol' => 'required',
        ];
    }
}
