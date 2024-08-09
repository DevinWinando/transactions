import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Flex } from 'antd';
import { Link } from '@inertiajs/inertia-react';
import Layout from '@/Layouts/Default.jsx';

const App = ({ sales, grandTotal }) => {
    const data = sales;

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                text
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Kode',
            dataIndex: 'kode',
            key: 'kode',
            width: '10%',
            ...getColumnSearchProps('kode'),
        },
        {
            title: 'Pelanggan',
            dataIndex: 'cust',
            key: 'cust',
            width: '15%',
            ...getColumnSearchProps('cust'),
        },
        {
            title: 'Jumlah Barang',
            dataIndex: 'details_sum_qty',
            key: 'qty',
            width: '15%',
            ...getColumnSearchProps('details_sum_qty'),
        },
        {
            title: 'Tanggal',
            dataIndex: 'tgl',
            key: 'tgl',
            width: '10%',
            ...getColumnSearchProps('tgl'),
        },
        {
            title: 'Subtotal',
            dataIndex: 'subtotal',
            key: 'subtotal',
            width: '10%',
            ...getColumnSearchProps('subtotal'),
        },
        {
            title: 'Diskon',
            dataIndex: 'diskon',
            key: 'diskon',
            width: '10%',
            ...getColumnSearchProps('diskon'),
        },
        {
            title: 'Ongkir',
            dataIndex: 'ongkir',
            key: 'ongkir',
            width: '10%',
            ...getColumnSearchProps('ongkir'),
        },
        {
            title: 'Total Bayar',
            dataIndex: 'total_bayar',
            key: 'total_bayar',
            width: '10%',
            ...getColumnSearchProps('total_bayar'),
        },
    ];

    return (
        <Layout>
            <Flex align='end' justify='end'>
                <Link href='/create'>
                    <Button type="primary" className='mb-3'>Tambah Data</Button>
                </Link>
            </Flex>
            <Table columns={columns} dataSource={data} scroll={{ x: 400 }}
                footer={() => (
                    <div
                        className='text-right'
                        style={{
                            textAlign: "right",
                            marginRight: '7rem',
                        }}
                    ><span className='me-5'>Grand Total:</span>  {grandTotal}
                    </div>
                )} />
        </Layout>
    );
};
export default App;