// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Checkout from './components/Checkout';
import ShoppingCart from './components/ShoppingCart';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Switch>
            <Route path="/product/:id" component={ProductDetails} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/cart" component={ShoppingCart} />
            <Route path="/" component={ProductList} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;


// components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <p>&copy; 2023 The Ultimate Collection. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="/" className="hover:text-gray-400">
            Home
          </Link>
          <Link to="/about" className="hover:text-gray-400">
            About
          </Link>
          <Link to="/contact" className="hover:text-gray-400">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// components/ProductList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Skeleton } from 'antd';
import { products } from './data';

const { Meta } = Card;

const ProductList: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">The Ultimate Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={product.name}
                  src={product.image}
                  className="h-64 object-cover"
                />
              }
            >
              <Skeleton loading={!product.image} active>
                <Meta
                  title={product.name}
                  description={`$${product.price}`}
                  className="truncate"
                />
                <Button type="primary" className="mt-4 w-full">
                  Add to Cart
                </Button>
              </Skeleton>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

// components/ProductDetails.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Drawer, Rate, Input, message } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { products } from './data';

const { Meta } = Card;

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === parseInt(id));
  const [reviewVisible, setReviewVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleReview = () => {
    // Save review and rating to backend
    message.success('Thank you for your review!');
    setReviewVisible(false);
  };

  if (!product) return null;

  return (
    <div className="container mx-auto py-8">
      <Card
        hoverable
        cover={
          <img
            alt={product.name}
            src={product.image}
            className="h-96 object-cover"
          />
        }
        actions={[
          <Button type="primary" className="w-full">
            Add to Cart
          </Button>,
        ]}
      >
        <Meta title={product.name} description={`$${product.price}`} />
        <div className="flex items-center mt-4">
          <Rate value={product.rating} disabled />
          <span className="ml-2 text-gray-500">({product.reviews.length})</span>
        </div>
        <Button type="link" onClick={() => setReviewVisible(true)}>
          Write a Review
        </Button>
      </Card>

      <Drawer
        title="Write a Review"
        placement="right"
        onClose={() => setReviewVisible(false)}
        visible={reviewVisible}
      >
        <div className="flex items-center mb-4">
          <Rate
            value={rating}
            onChange={setRating}
            character={<StarFilled />}
          />
          <span className="ml-2">{rating} out of 5</span>
        </div>
        <Input.TextArea
          rows={4}
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <Button type="primary" className="mt-4" onClick={handleReview}>
          Submit Review
        </Button>
      </Drawer>
    </div>
  );
};

export default ProductDetails;

// components/ShoppingCart.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Table } from 'antd';
import { products } from './data';

const ShoppingCart: React.FC = () => {
  const cartItems = products.slice(0, 3);

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Link to={`/product/${products[0].id}`}>{name}</Link>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: () => <Input min={1} defaultValue={1} className="w-20" />,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (price: number, record: any) => `$${(price * record.quantity).toFixed(2)}`,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <Card>
        <Table
          dataSource={cartItems}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
        <div className="flex justify-end mt-4">
          <Button type="primary" size="large" className="w-full sm:w-auto">
            Proceed to Checkout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ShoppingCart;

// components/Checkout.tsx
import React from 'react';
import { Card, Button, Form, Input, Select } from 'antd';

const { Option } = Select;

const Checkout: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <Card className="max-w-2xl mx-auto">
        <Form form={form} name="checkout" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Payment Method"
            name="paymentMethod"
            rules={[{ required: true, message: 'Please select a payment method!' }]}
          >
            <Select>
              <Option value="credit-card">Credit Card</Option>
              <Option value="paypal">PayPal</Option>
              <Option value="apple-pay">Apple Pay</Option>
            </Select>
          </Form.Item>

          <Form.Item className="text-right">
            <Button type="primary" htmlType="submit" size="large" className="w-full sm:w-auto">
              Place Order
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Checkout;

// components/data.ts
export const products = [
  {
    id: 1,
    name: 'Stripe Details Jersey Track Top',
    price: 34.0,
    image: 'https://via.placeholder.com/150',
    rating: 4.5,
    reviews: [
      { id: 1, user: 'John Doe', rating: 5, text: 'Great product!' },
      { id: 2, user: 'Jane Smith', rating: 4, text: 'Decent quality.' },
    ],
  },
  {
    id: 2,
    name: 'Nike Air Force 1 Low Look Retro',
    price: 27.0,
    image: 'https://via.placeholder.com/150',
    rating: 4.0,
    reviews: [
      { id: 1, user: 'Bob Johnson', rating: 4, text: 'Nice shoes!' },
      { id: 2, user: 'Samantha Lee', rating: 3, text: 'Not my style.' },
    ],
  },
  {
    id: 3,
    name: 'Adidas Ultraboost 21',
    price: 180.0,
    image: 'https://via.placeholder.com/150',
    rating: 4.8,
    reviews: [
      { id: 1, user: 'Emily Thompson', rating: 5, text: 'Best running shoes I've ever owned!' },
      { id: 2, user: 'Michael Chen', rating: 4, text: 'Comfortable and durable.' },
    ],
  },
  // Add more products as needed
];