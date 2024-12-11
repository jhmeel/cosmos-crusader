import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdAdd, 
  MdRemove, 
  MdShoppingCart, 
  MdPayment, 
  MdLocationOn, 
  MdCheckCircle 
} from 'react-icons/md';
import { 
  Form, 
  Input, 
  Select, 
  Radio, 
  Drawer, 
  Steps, 
  message 
} from 'antd';
import { Product, Order, DeliveryAddress, PaymentStatus, OrderStatus } from '../types';


const Checkout: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');


  const totalPrice = useMemo(() => 
    cartItems.reduce((total, item) => total + item.price, 0), 
    [cartItems]
  );

  // Create order handler
  const handleCreateOrder = () => {
    if (!deliveryAddress || !paymentMethod) {
      message.error('Please complete all checkout details');
      return;
    }

    const newOrder: Order = {
      orderId: `ORDER-${Date.now()}`,
      buyerId: 'current-user-id', // Replace with actual user ID
      productDetails: cartItems,
      deliveryAddress: deliveryAddress,
      deliveryFormat: 'standard',
      totalPrice: totalPrice,
      orderDate: new Date().toISOString(),
      paymentStatus: PaymentStatus.PENDING,
      agent: {} as any, // You'd typically fetch or assign an agent here
      tracking: {
        status: OrderStatus.PENDING,
        currentLocation: { lat: 0, lng: 0 },
        estimatedDeliveryTime: new Date(
          Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
        ).toISOString()
      },
      updateStatus: () => {},
      updateEstimatedDeliveryTime: () => {},
      updateCurrentLocation: () => {},
      updatePaymentStatus: () => {}
    };

    // Here you would typically send the order to backend
    console.log('Created Order:', newOrder);
    message.success('Order placed successfully!');
    setCurrentStep(2);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-[#141024] to-[#2C1B3D] text-white p-6"
    >
      {/* Checkout Steps */}
      <Steps 
        current={currentStep} 
        className="mb-8"
        items={[
          {
            title: 'Cart',
            icon: <MdShoppingCart />,
          },
          {
            title: 'Delivery',
            icon: <MdLocationOn />,
          },
          {
            title: 'Confirm',
            icon: <MdCheckCircle />,
          }
        ]} 
      />

      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div 
            key="cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CartStep 
              cartItems={cartItems} 
              setCartItems={setCartItems}
              onNext={() => setCurrentStep(1)}
            />
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div 
            key="delivery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DeliveryStep 
              onAddressComplete={(address) => {
                setDeliveryAddress(address);
                setCurrentStep(2);
              }}
            />
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div 
            key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OrderConfirmationStep 
              order={{
                items: cartItems,
                totalPrice,
                deliveryAddress
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


const CartStep: React.FC<{
  cartItems: Product[];
  setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
  onNext: () => void;
}> = ({ cartItems, setCartItems, onNext }) => {

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold flex items-center">
        <MdShoppingCart className="mr-2 text-purple-500" />
        Your Cart
      </h2>

      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.map(item => (
          <motion.div 
            key={item.id}
            layout
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-[#2C1B3D] rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-gray-400">${item.price}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white rounded-full p-2"
              >
                <MdRemove />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total Price */}
      <div className="bg-[#1E1737] rounded-2xl p-4 flex justify-between items-center">
        <h3 className="text-2xl font-bold">Total</h3>
        <span className="text-2xl font-bold text-green-400">
          ${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
        </span>
      </div>

      {/* Proceed Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        disabled={cartItems.length === 0}
        className={`
          w-full py-4 rounded-2xl text-xl font-bold transition-all
          ${cartItems.length > 0 
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
        `}
      >
        Proceed to Delivery
      </motion.button>
    </div>
  );
};

// Delivery Step Component
const DeliveryStep: React.FC<{
  onAddressComplete: (address: DeliveryAddress) => void;
}> = ({ onAddressComplete }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const deliveryAddress: DeliveryAddress = {
        line1: values.address,
        line2: values.addressDetails,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: values.country,
        phone: values.phone,
        email: values.email
      };
      onAddressComplete(deliveryAddress);
    }).catch(errorInfo => {
      console.log('Validation Failed:', errorInfo);
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold flex items-center">
        <MdLocationOn className="mr-2 text-green-500" />
        Delivery Details
      </h2>

      <Form 
        form={form}
        layout="vertical"
        className="space-y-4"
      >
        <Form.Item 
          name="address" 
          label="Address" 
          rules={[{ required: true, message: 'Please input your address!' }]}
        >
          <Input 
            placeholder="Street Address" 
            className="bg-[#2C1B3D] border-none text-white"
          />
        </Form.Item>

        <Form.Item name="addressDetails">
          <Input 
            placeholder="Apartment, suite, etc. (optional)" 
            className="bg-[#2C1B3D] border-none text-white"
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item 
            name="city" 
            label="City"
            rules={[{ required: true, message: 'Please input your city!' }]}
          >
            <Input 
              placeholder="City" 
              className="bg-[#2C1B3D] border-none text-white"
            />
          </Form.Item>

          <Form.Item 
            name="state" 
            label="State"
            rules={[{ required: true, message: 'Please input your state!' }]}
          >
            <Input 
              placeholder="State" 
              className="bg-[#2C1B3D] border-none text-white"
            />
          </Form.Item>
        </div>

        <Form.Item 
          name="phone" 
          label="Phone Number"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <Input 
            placeholder="Phone Number" 
            className="bg-[#2C1B3D] border-none text-white"
          />
        </Form.Item>

        <Form.Item 
          name="email" 
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input 
            placeholder="Email Address" 
            className="bg-[#2C1B3D] border-none text-white"
          />
        </Form.Item>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
        >
          Continue to Payment
        </motion.button>
      </Form>
    </div>
  );
};

// Order Confirmation Step Component
const OrderConfirmationStep: React.FC<{
  order: {
    items: Product[];
    totalPrice: number;
    deliveryAddress?: DeliveryAddress | null;
  };
}> = ({ order }) => {
  return (
    <div className="space-y-6 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#2C1B3D] rounded-2xl p-8"
      >
        <MdCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
        <p className="text-gray-400 mb-6">
          Your delicious bites are on their way
        </p>

        <div className="bg-[#1E1737] rounded-2xl p-4 mb-4">
          <h3 className="text-xl font-bold mb-2">Order Summary</h3>
          {order.items.map(item => (
            <div 
              key={item.id} 
              className="flex justify-between border-b border-gray-700 py-2 last:border-b-0"
            >
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-2">
            <span>Total</span>
            <span className="text-green-400">${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {order.deliveryAddress && (
          <div className="bg-[#1E1737] rounded-2xl p-4">
            <h3 className="text-xl font-bold mb-2">Delivery Address</h3>
            <p>{order.deliveryAddress.line1}</p>
            {order.deliveryAddress.line2 && <p>{order.deliveryAddress.line2}</p>}
            <p>
              {order.deliveryAddress.city}, 
              {order.deliveryAddress.state} 
              {order.deliveryAddress.postalCode}
            </p>
          </div>
        )}
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-4 rounded-2xl text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
      >
        Track Your Order
      </motion.button>
    </div>
  );
};

export default Checkout;