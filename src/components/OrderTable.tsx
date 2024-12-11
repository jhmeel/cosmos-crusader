import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Tag, 
  Dropdown, 
  Menu, 
  Button, 
  Empty, 
  Tooltip 
} from 'antd';
import { 
  OrderedListOutlined, 
  FilterOutlined, 
  EyeOutlined,
  EyeInvisibleOutlined,
  CopyOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { Order, OrderStatus } from '../types';




const generateDemoOrders = (): Order[] => {
  return [
    {
      id: 'ORD-2023-001',
      totalPrice: 249.99,
      tracking:{
        status:OrderStatus.DELIVERED,
      },
    
      orderDate: '2023-11-15',
      productDetails: [
        { name: 'Wireless Headphones', quantity: 1, price: 199.99 },
        { name: 'Phone Case', quantity: 1, price: 50 }
      ]
    },
    {
      id: 'ORD-2023-002',
      totalPrice: 129.50,
      tracking:{
        status: OrderStatus.PENDING,
      },
     
      orderDate: '2023-12-02',
      productDetails: [
        { name: 'Smart Watch', quantity: 1, price: 129.50 }
      ]
    },
    {
      id: 'ORD-2023-003',
      totalPrice: 75.25,
      tracking:{
        status: OrderStatus.IN_TRANSIT,
      },
      orderDate: '2023-12-10',
      productDetails: [
        { name: 'Bluetooth Speaker', quantity: 1, price: 75.25 }
      ]
    }
  ];
};

const OrderTable: React.FC = ({order}) => {
  const [orders, setOrders] = useState<Order[]>(generateDemoOrders());
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [isOrdersVisible, setIsOrdersVisible] = useState<boolean>(true);

  const getStatusColor = (status: OrderStatus) => {
    const statusColorMap = {
      [OrderStatus.DELIVERED]: 'green',
      [OrderStatus.IN_TRANSIT]: 'orange',
      [OrderStatus.PENDING]: 'gray',
      [OrderStatus.CANCELLED]: 'red'
    };
    return statusColorMap[status];
  };

  const filterMenu = (
    <Menu>
      {[
        { key: 'ALL', label: 'All Orders' },
        ...Object.values(OrderStatus).map(status => ({
          key: status,
          label: status.charAt(0) + status.slice(1).toLowerCase()
        }))
      ].map(item => (
        <Menu.Item 
          key={item.key} 
          onClick={() => {
            const filtered = item.key === 'ALL' 
              ? orders 
              : orders.filter(order => order.tracking.status === item.key);
            setFilteredOrders(filtered);
          }}
        >
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  const renderOrderCard = (order: Order) => (
    <Card 
      key={order.id} 
      className="mb-4"
      extra={
        <Tooltip title="Copy Order ID">
          <Button 
            type="text" 
            icon={<CopyOutlined />} 
            onClick={() => navigator.clipboard.writeText(order.id)}
          />
        </Tooltip>
      }
      title={
        <div className="flex justify-between items-center">
          <Typography.Text strong>Order #{order.id}</Typography.Text>
          <Tag color={getStatusColor(order.tracking.status)}>{order.tracking.status}</Tag>
        </div>
      }
    >
      <div className="flex justify-between">
        <div>
          <Typography.Text>orderDate: {order.orderDate}</Typography.Text>
          <div className="mt-2">
            {order.productDetails.map(item => (
              <div key={item.name} className="flex justify-between">
                <Typography.Text>{item.name}</Typography.Text>
                <Typography.Text>{item.quantity} × ${item.price.toFixed(2)}</Typography.Text>
              </div>
            ))}
          </div>
        </div>
        <div className="text-right">
          <Typography.Text strong>
            <DollarOutlined /> TotalPtotalPrice: ${order.totalPrice.toFixed(2)}
          </Typography.Text>
        </div>
      </div>
    </Card>
  );

  return (
    <Card 
      title={
        <div className="flex justify-between items-center">
          <Typography.Title level={4} className="mb-0">
            <OrderedListOutlined className="mr-2" />
            Orders
          </Typography.Title>
          <div className="flex space-x-2">
            <Dropdown overlay={filterMenu} placement="bottomRight" trigger={['click']}>
              <Button icon={<FilterOutlined />}>Filter</Button>
            </Dropdown>
            <Button 
              icon={isOrdersVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => setIsOrdersVisible(!isOrdersVisible)}
            >
              {isOrdersVisible ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
      }
    >
      {!isOrdersVisible ? (
        <Empty description="Orders are hidden" />
      ) : filteredOrders.length === 0 ? (
        <Empty description="No orders found" />
      ) : (
        <div className="space-x-0">  
        {filteredOrders.map(renderOrderCard)}
      </div>
      )}
    </Card>
  );
};

export default OrderTable;