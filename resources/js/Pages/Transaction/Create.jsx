import React, { useState } from 'react';
import {
    Button,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Divider,
    Select,
    Row,
    Col,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import ModalCustomer from '../../Component/ModalCustomer';
import ModalProduct from '../../Component/ModalProduct';
import Layout from '../../Layouts/default';

const App = ({ customers, products, csrf_token }) => {
    const [form] = Form.useForm();

    const [customerOptions, setCustomerOptions] = useState(customers);
    const [productOptions, setProductOptions] = useState(products);
    const [isModalCustomerOpen, setIsModalCustomerOpen] = useState(false);
    const [isModalProductOpen, setIsModalProductOpen] = useState(false);
    const [productKey, setProductKey] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    const onFinish = (values) => {
        values = { ...values, _token: csrf_token };

        fetch('/store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.errors) {
                    alert(data.message)
                    return;
                }

                if (data.exception) {
                    alert('Terjadi kesalahan server')
                    return;
                }

                form.resetFields();
                setSubtotal(0);
                setGrandTotal(0);
                setCustomerOptions(customers);
                setProductOptions(products)

                alert('Data berhasil disimpan');

                window.location.href = '/';
            })
            .catch((error) => {
                alert(error.message);
                console.error('Error:', error);
            }
            );
    };

    const showModalCustomer = () => {
        setIsModalCustomerOpen(true);
    };

    const showModalProduct = (key) => {
        setProductKey(key);
        setIsModalProductOpen(true);
    }

    const generateInvoiceNumber = () => {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const randomPart = Math.floor(Math.random() * 1000);

        return `INV/${month}/${day}/${randomPart}`;
    }

    const handleTotal = (values) => {
        let total = 0;

        values.forEach((value) => {
            let harga = value.harga_bandrol ? value.harga_bandrol : 0;
            let qty = value.qty ? value.qty : 0;
            let diskon = value.diskon ? value.diskon : 0;

            total += harga * qty - (harga * qty * diskon / 100);
        });

        setSubtotal(total);

        let grandTotal = total;

        let ongkir = form.getFieldValue('ongkir') ? form.getFieldValue('ongkir') : 0;
        let diskon = form.getFieldValue('diskon') ? form.getFieldValue('diskon') : 0;

        grandTotal += ongkir;

        if (diskon) {
            grandTotal -= grandTotal * diskon / 100;
        }

        setGrandTotal(grandTotal);
    }

    const handleChangeProduct = (value, e) => {
        const product = products.find((product) => product.id === value);

        const barang = form.getFieldValue('details');
        const barangIndex = barang.findIndex((item) => item.barang_id === value);

        barang[barangIndex].harga_bandrol = product.harga;
        form.setFieldsValue({ barang });
    }

    return (
        <Layout>
            <Form
                initialValues={{
                    kode: generateInvoiceNumber(),
                }}
                form={form}
                name="transaction"
                onFinish={onFinish}
                style={{
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                }}
                scrollToFirstError
            >
                <Row gutter={20}>
                    <Col span={8}>
                        <Form.Item
                            name="customer_id"
                            label="Pelanggan"
                            layout="vertical"
                            className='mb-5'
                            rules={[
                                {
                                    required: true,
                                    message: 'Pelanggan tidak boleh kosong!',
                                },
                            ]}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder="Pelanggan"
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider
                                            style={{
                                                margin: '8px 0',
                                            }}
                                        />
                                        <Button type="text" icon={<PlusOutlined />} style={{ width: '100%' }} onClick={showModalCustomer}>
                                            Add item
                                        </Button>
                                    </>
                                )}
                                options={customerOptions.map((cust) => ({
                                    label: cust.nama,
                                    value: cust.id,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
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
                            ]}
                        >
                            <Input value={generateInvoiceNumber()} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="tgl"
                            label="Tanggal"
                            layout="vertical"
                            className='mb-5'
                            rules={[
                                {
                                    required: true,
                                    message: 'Tanggal tidak boleh kosong!',
                                },
                            ]} >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <p>Barang</p>
                <Form.List name="details">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row
                                    key={key}
                                    align="baseline"
                                    gutter={12}
                                >
                                    <Col span={7}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'barang_id']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Kode wajib diisi',
                                                },
                                            ]}
                                        >
                                            <Select
                                                onChange={() => {
                                                    handleTotal(form.getFieldsValue().details)
                                                }}
                                                onSelect={(value, event) => handleChangeProduct(value, event)}
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="Barang"
                                                dropdownRender={(menu) => (
                                                    <>
                                                        {menu}
                                                        <Divider
                                                            style={{
                                                                margin: '8px 0',
                                                            }}
                                                        />
                                                        <Button type="text" icon={<PlusOutlined />} style={{ width: '100%' }} onClick={() => showModalProduct(key)}>
                                                            Add item
                                                        </Button>
                                                    </>
                                                )}
                                                options={productOptions.map((product) => ({
                                                    label: `${product.nama} - ${product.harga}`,
                                                    value: product.id,
                                                }))}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'harga_bandrol']}
                                        >
                                            <InputNumber onChange={() => handleTotal(form.getFieldsValue().details)} style={{ width: '100%' }} placeholder="Harga Bandrol" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'qty']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Qty wajib diisi',
                                                },
                                            ]}
                                            style={{ width: '100%' }}
                                        >
                                            <InputNumber onChange={() => { handleTotal(form.getFieldsValue().details) }} style={{ width: '100%' }} placeholder="Qty" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'diskon']}
                                        >
                                            <InputNumber onChange={() => handleTotal(form.getFieldsValue().details)} style={{ width: '100%' }} placeholder="Diskon (%)" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Tambah Barang
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Row justify="end">
                    <Col span={8}>
                        <label htmlFor="">Subtotal:</label>
                        <label className='mb-3 ms-2'>{subtotal}</label>
                    </Col>
                </Row>

                <Row justify="end">
                    <Col span={8}>
                        <Form.Item
                            name="ongkir"
                            label="Ongkir"
                            layout="horizontal"
                        >
                            <InputNumber style={{ width: '100%' }} onChange={() => handleTotal(form.getFieldsValue().details)} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="end">
                    <Col span={8}>
                        <Form.Item
                            name="diskon"
                            label="Diskon (%)"
                            layout="horizontal"
                            onChange={() => handleTotal(form.getFieldsValue().details)}
                        >
                            <InputNumber style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="end">
                    <Col span={8}>
                        <label htmlFor="">Total:</label>
                        <label className='mb-3 ms-4'>{grandTotal}</label>
                    </Col>
                </Row>

                <Row justify="end" gutter={12}>
                    <Col span={3}>
                        <Form.Item>
                            <Button onClick={() => form.resetFields()} style={{ width: '100%' }}>
                                Batal
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <ModalCustomer isModalCustomerOpen={isModalCustomerOpen} setIsModalCustomerOpen={setIsModalCustomerOpen} customers={customers} setCustomerOptions={setCustomerOptions} csrf_token={csrf_token} form={form} />
            <ModalProduct isModalProductOpen={isModalProductOpen} setIsModalProductOpen={setIsModalProductOpen} products={products} setProductOptions={setProductOptions} csrf_token={csrf_token} form={form} productKey={productKey} />
        </Layout>
    );
};
export default App;