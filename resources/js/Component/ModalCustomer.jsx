import React, { useState, useRef } from 'react';
import {
    Form,
    Input,
    Modal,
} from 'antd';

const ModalCustomer = ({ customers, csrf_token, setCustomerOptions, isModalCustomerOpen, setIsModalCustomerOpen, form }) => {
    const [formCust] = Form.useForm();

    const onFinishCustomer = (values) => {
        values = { ...values, _token: csrf_token };

        fetch('/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => {
                const { customer } = data;
                formCust.resetFields();
                handleOk();

                setCustomerOptions([...customers, customer]);

                form.setFieldsValue({ cust_id: customer.id });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleOk = () => {
        setIsModalCustomerOpen(false);
    };
    const handleCancel = () => {
        setIsModalCustomerOpen(false);
    };

    return (
        <Modal title="Tambah Customer" open={isModalCustomerOpen} onOk={formCust.submit} onCancel={handleCancel}>
            <Form
                form={formCust}
                name="customer"
                onFinish={onFinishCustomer}
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
                            max: 10,
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
                    name="telp"
                    label="Telp"
                    className='mb-5'
                    layout="vertical"
                    rules={[
                        {
                            required: true,
                            message: 'Nomor telepon wajib diisi!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

            </Form>
        </Modal>
    );
};
export default ModalCustomer;