import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import { Truck, WarningAmber } from '@mui/icons-material';


const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [shippingProviderData, setShippingProviderData] = useState({});
  const [lowInventoryProducts, setLowInventoryProducts] = useState([]);
  const [lowInventoryAlert, setLowInventoryAlert] = useState(false);

  useEffect(() => {
    // Fetch orders from Firestore
    const unsubscribe = firestore.collection('orders').onSnapshot((snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Fetch shipping provider data
    const fetchShippingProviderData = async () => {
      const response = await axios.get('/api/shipping-provider');
      setShippingProviderData(response.data);
    };
    fetchShippingProviderData();
  }, []);

  useEffect(() => {
    // Check inventory levels and set low inventory alerts
    const checkInventory = async () => {
      const products = await firestore.collection('products').get();
      const lowInventory = products.docs.filter((doc) => doc.data().stock < 10);
      setLowInventoryProducts(lowInventory.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLowInventoryAlert(lowInventory.length > 0);
    };
    checkInventory();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Update order status in Firestore
      await firestore.collection('orders').doc(orderId).update({ status: newStatus });

      // Notify shipping provider of updated status
      const trackingNumber = orders.find((order) => order.id === orderId)?.trackingNumber;
      await axios.post('/api/shipping-provider/update-status', {
        trackingNumber,
        newStatus,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const replenishInventory = async (productId: string, quantity: number) => {
    try {
      // Update product inventory in Firestore
      await firestore.collection('products').doc(productId).update({ stock: quantity });

      // Reset low inventory alert
      const updatedProducts = lowInventoryProducts.filter((product) => product.id !== productId);
      setLowInventoryProducts(updatedProducts);
      setLowInventoryAlert(updatedProducts.length > 0);
    } catch (error) {
      console.error('Error replenishing inventory:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>

      {orders.map((order) => (
        <Box key={order.id} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="subtitle1">Order {order.id}</Typography>
            <Typography variant="body2">Status: {order.status}</Typography>
            <Typography variant="body2">
              Tracking Number: {order.trackingNumber || 'N/A'}
            </Typography>
          </Box>
          <Box>
            {order.status === 'Placed' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => updateOrderStatus(order.id, 'Shipped')}
              >
                Mark as Shipped
              </Button>
            )}
            {order.status === 'Shipped' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => updateOrderStatus(order.id, 'Delivered')}
              >
                Mark as Delivered
              </Button>
            )}
          </Box>
        </Box>
      ))}

      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>

      {lowInventoryProducts.map((product) => (
        <Box key={product.id} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="subtitle1">{product.name}</Typography>
            <Typography variant="body2">
              Current Stock: {product.stock} units
            </Typography>
          </Box>
          <Box>
            <TextField
              label="Restock Quantity"
              variant="outlined"
              type="number"
              inputProps={{ min: 0 }}
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(Number(e.target.value))}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => replenishInventory(product.id, restockQuantity)}
            >
              Replenish
            </Button>
          </Box>
        </Box>
      ))}

      <Snackbar
        open={lowInventoryAlert}
        autoHideDuration={6000}
        onClose={() => setLowInventoryAlert(false)}
      >
        <Alert
          onClose={() => setLowInventoryAlert(false)}
          severity="warning"
          icon={<WarningAmber />}
        >
          Low inventory detected for some products. Please restock as soon as possible.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrderManagement