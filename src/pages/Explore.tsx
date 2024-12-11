import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Carousel, Rate, Avatar, Button, Tag } from 'antd';
import { 
  UserRole, 
  VendorState, 
  Product, 
  Order, 
  OrderStatus, 
  DeliveryAgent, 
  UserState, 
  Vendor
} from '../types'; 
import { alexRodriguez } from '../utils/demo';

const demoVendors: Vendor[] = [
  {
    vendorId: 'v001',
    businessName: 'Fresh Produce Hub',
    merchantName: 'John Smith',
    category: 'Grocery',
    currentLocation: { lat: 6.5244, lng: 3.3792 },
    catalog: [
      {
        id: 'p001',
        name: 'Organic Apples',
        description: 'Fresh, crisp organic apples from local farms',
        quantity: 50,
        price: 2.50,
        image: 'https://example.com/apples.jpg',
        videoURL: 'https://example.com/apple-video.mp4',
        reviews: [
          { 
            id: 'r001', 
            reviewerId: 'u001', 
            rating: 4, 
            comment: 'Great quality apples!', 
            date: new Date().toISOString() 
          }
        ]
      }
    ],
    loading: false,
    error: null,
    isUploadingVideo: false,
    videoUploadProgress: 0,
    orders: [],
    activeOrders: [],
    nearByAgents: [],
    setCatalog: () => {},
    addProductToCatalog: () => {},
    uploadVideo: async () => {},
    deleteVideo: async () => {},
    removeProductFromCatalog: () => {},
    setOrders: () => {},
    addOrder: () => {},
    removeOrder: () => {},
    updateOrderStatus: () => {},
    setActiveOrders: () => {},
    fetchOrders: () => {},
    fetchCatalog: () => {},
    fetchNearByAgents: () => {},
    setError: () => {},
    resetState: () => {}
  }

  
];

interface ExploreProps {
  currentUser: UserState;
}

const Explore: React.FC<ExploreProps> = () => {
  const [selectedVendor, setSelectedVendor] = useState<VendorState | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentUser, setCurrentUser] = useState(alexRodriguez)

  const handleVendorClick = (vendor: VendorState) => {
    setSelectedVendor(vendor);
    setIsDrawerVisible(true);
  };

  useEffect(() => {
   
    if (selectedVendor) {
      videoRefs.current.forEach((video, index) => {
        if (video) {
          video.muted = true; 
          video.play().catch(error => console.log('Autoplay prevented:', error));
        }
      });
    }
  }, [selectedVendor]);

  const handlePlaceOrder = (product: Product) => {
    // Implement order placement logic
    if (currentUser.currentRole === UserRole.CUSTOMER) {
      // Create order logic
    }
  };

  const handlePickupOrder = (product: Product) => {
    if (currentUser.currentRole === UserRole.AGENT) {
      // Create pickup order logic
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" style={{marginTop:`70px`}}>
      <h1 className="text-3xl font-bold mb-6">Explore Vendors</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoVendors.map(vendor => (
          <div 
            key={vendor.vendorId} 
            className="bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => handleVendorClick(vendor)}
          >
            <div className="flex items-center mb-4">
              <Avatar size={64} className="mr-4">
                {vendor.businessName.charAt(0)}
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{vendor.businessName}</h2>
                <Tag color="green">{vendor.category}</Tag>
              </div>
            </div>
            <p className="text-gray-600">
              {vendor.catalog.length} Products Available
            </p>
          </div>
        ))}
      </div>

      {selectedVendor && (
        <Drawer
          title={selectedVendor.businessName}
          placement="right"
          width={500}
          onClose={() => setIsDrawerVisible(false)}
          open={isDrawerVisible}
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Product Catalog</h2>
              {selectedVendor.catalog.map((product, index) => (
                <div key={product.id} className="mb-6 bg-gray-100 p-4 rounded-lg">
                  <Carousel>
                    {product.videoURL && (
                      <div>
                        <video 
                          ref={el => videoRefs.current[index] = el}
                          src={product.videoURL} 
                          className="w-full rounded-lg"
                          controls
                        />
                      </div>
                    )}
                    <div>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full rounded-lg" 
                      />
                    </div>
                  </Carousel>

                  <div className="mt-4">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-gray-600">{product.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-lg font-bold">${product.price}</span>
                      <Rate value={product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length} disabled />
                    </div>

                    {currentUser.currentRole === UserRole.CUSTOMER && (
                      <Button 
                        type="primary" 
                        className="mt-4 w-full"
                        onClick={() => handlePlaceOrder(product)}
                      >
                        Place Order
                      </Button>
                    )}

                    {currentUser.currentRole === UserRole.AGENT && (
                      <Button 
                        type="default" 
                        className="mt-4 w-full"
                        onClick={() => handlePickupOrder(product)}
                      >
                        Pickup Order
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Vendor Details</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p><strong>Location:</strong> {selectedVendor.currentLocation.lat}, {selectedVendor.currentLocation.lng}</p>
                <p><strong>Merchant:</strong> {selectedVendor.merchantName}</p>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};

export default Explore;