import React from 'react';
import { Breadcrumb, Layout, Menu } from 'antd';

const { Header, Content, Footer } = Layout;
const items = [{
    key: '1',
    label: 'Transaksi',
}];

const App = ({children}) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={items}
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                />
            </Header>
            <Content
                style={{
                    padding: '0 48px',
                }}
            >
                <h4 className='my-4'>Data Transaksi</h4>
                {children}
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
                ©{new Date().getFullYear()} Devin Winando
            </Footer>
        </Layout>
    );
};
export default App;