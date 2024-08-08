import React, { useState, useRef } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Modal,
} from 'antd';

const ModalProduct = ({ products, csrf_token, setProductOptions, isModalProductOpen, setIsModalProductOpen, form, productKey }) => {
    const [formProduct] = Form.useForm();

    const onFinishProduct = (values) => {
        values = { ...values, _token: csrf_token };

        fetch('/product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => {
                const { product } = data;
                formProduct.resetFields();
                handleOk();

                setProductOptions([...products, product]);

                let productsInput = form.getFieldValue('barang');
                productsInput[productKey] = { barang_id: product.id };
                
                console.log(productsInput);
                console.log(productKey);

                form.setFieldsValue({ barang: productsInput});
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleOk = () => {
        setIsModalProductOpen(false);
    };
    const handleCancel = () => {
        setIsModalProductOpen(false);
    };

    return (
        <Modal title="Tambah Product" open={isModalProductOpen} onOk={formProduct.submit} onCancel={handleCancel}>
            <Form
                form={formProduct}
                name="product"
                onFinish={onFinishProduct}
                style={{
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                }}
                scrollToFirstError
            >
                <Form.Item
                    name="kode"
                    label="Nomor"
                    layout="vertical"
                    className='mb-5'
                    rules={[
                        {
                            required: true,
                            message: 'Kode tidak boleh kosong!',
                        },
                        {
                            max: 15,
                            message: 'Kode maksimal 10 karakter!',
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="nama"
                    label="Nama"
                    className='mb-5'
                    layout="vertical"
                    rules={[
                        {
                            required: true,
                            message: 'Nama wajib diisi!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <input type="hidden" name="_token" value={csrf_token} />

                <Form.Item
                    name="harga"
                    label="Harga"
                    className='mb-5'
                    layout="vertical"
                    rules={[
                        {
                            required: true,
                            message: 'Harga wajib diisi!',
                        },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

            </Form>
        </Modal>
    );
};
export default ModalProduct;