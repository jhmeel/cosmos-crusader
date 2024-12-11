import React, { useState, useEffect, useCallback } from 'react';
import { 
  Drawer, 
  Typography, 
  Upload, 
  Switch, 
  Menu, 
  Button, 
  Avatar, 
  Dropdown, 
  Modal, 
  Badge, 
  Rate, 
  Card, 
  Tag, 
  Tabs, 
  Select, 
  Space, 
  message 
} from 'antd';
import { 
  UserOutlined, 
  SettingOutlined, 
  LogoutOutlined, 
  EditOutlined, 
  LockOutlined, 
  SafetyOutlined, 
  EnvironmentOutlined, 
  StarOutlined, 
  CameraOutlined, 
  OrderedListOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { UserRole, OrderStatus, DeliveryStatus, AgentVerificationStatus, Order, DeliveryAgent } from './types';
import Webcam from 'react-webcam';

interface ProfileDrawerProps {
  user: UserState | DeliveryAgent;
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange,
  onLogout,
  user
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "ALL">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'document' | 'liveness'>();
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [livenessVerified, setLivenessVerified] = useState(false);

  const webcamRef = React.useRef<Webcam>(null);

  const handleOrderStatusChange = useCallback(async (order: Order, newStatus: OrderStatus) => {
    // Prevent changing status of delivered orders
    if (order.tracking.status === OrderStatus.DELIVERED) {
      message.warning('Delivered orders cannot be modified');
      return;
    }

    // Special handling for agent delivery confirmation
    if (currentRole === UserRole.AGENT && newStatus === OrderStatus.DELIVERED) {
      Modal.confirm({
        title: 'Confirm Delivery',
        content: 'Are you sure you want to mark this order as delivered? This will send a confirmation request to the customer.',
        onOk: async () => {
          try {
            await NotificationService.requestDeliveryConfirmation(order);
            // Update order status after customer confirmation
            await DBOPS.updateOrderStatus(order.id, newStatus);
            message.success('Delivery confirmation request sent');
          } catch (error) {
            message.error('Failed to process delivery confirmation');
          }
        }
      });
    } else {
      // Regular status update for other scenarios
      await DBOPS.updateOrderStatus(order.id, newStatus);
      message.success('Order status updated successfully');
    }
  }, [currentRole]);

  const renderAgentReviews = () => {
    if (currentRole !== UserRole.AGENT) return null;
    const agent = user as DeliveryAgent;

    return (
      <List.Item 
        prefix={<StarOutlined />} 
        extra={(
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => setIsReviewModalVisible(true)}
          >
            View Reviews
          </Button>
        )}
      >
        Performance Reviews
      </List.Item>
    );
  };

  const renderAdvancedVerification = () => (
    <Modal
      visible={isVerificationModalVisible}
      title="Agent Verification Process"
      footer={null}
      onCancel={() => setIsVerificationModalVisible(false)}
    >
      <Tabs 
        activeKey={verificationStep || 'document'}
        onChange={(key) => setVerificationStep(key as 'document' | 'liveness')}
      >
        <Tabs.TabPane key="document" tab="Document Upload">
          <Typography.Paragraph>
            Upload a government-issued identification document
          </Typography.Paragraph>
          <Upload
            multiple={false}
            accept=".jpg, .png, .pdf"
            onChange={(file) => setDocumentFile(file[0])}
            maxCount={1}
          >
            <Button>Select Verification Document</Button>
          </Upload>
          {documentFile && (
            <Typography.Text>Selected: {documentFile.name}</Typography.Text>
          )}
        </Tabs.TabPane>
        
        <Tabs.TabPane key="liveness" tab="Liveness Verification">
          <Typography.Paragraph>
            Please verify your identity by following the on-screen instructions
          </Typography.Paragraph>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            height={300}
            width="100%"
          />
          <Button 
            type="primary" 
            block 
            onClick={() => {
              // Simulated liveness check
              const screenshot = webcamRef.current?.getScreenshot();
              if (screenshot) {
                setLivenessVerified(true);
                message.success('Liveness verification successful');
              }
            }}
          >
            Capture Selfie
          </Button>
        </Tabs.TabPane>
      </Tabs>

      <Button 
        type="primary" 
        block 
        disabled={!documentFile || !livenessVerified}
        onClick={handleVerificationSubmit}
      >
        Complete Verification
      </Button>
    </Modal>
  );

  const renderOrderTable = () => (
    <Card title="Order Management">
      <Select
        style={{ width: "100%", marginBottom: 16 }}
        placeholder="Filter Orders"
        value={orderFilter}
        onChange={(value) => setOrderFilter(value)}
      >
        <Select.Option value="ALL">All Orders</Select.Option>
        {Object.values(OrderStatus).map((status) => (
          <Select.Option key={status} value={status}>
            {status}
          </Select.Option>
        ))}
      </Select>

      {orders
        .filter(
          (order) =>
            orderFilter === "ALL" || order.tracking.status === orderFilter
        )
        .map((order) => (
          <Card
            key={order.id}
            hoverable
            extra={(
              <Select
                style={{ width: 120 }}
                value={order.tracking.status}
                disabled={order.tracking.status === OrderStatus.DELIVERED}
                onChange={(status) => handleOrderStatusChange(order, status)}
              >
                {Object.values(OrderStatus).map((status) => (
                  <Select.Option key={status} value={status}>
                    {status}
                  </Select.Option>
                ))}
              </Select>
            )}
          >
            <Card.Meta
              title={`Order #${order.id}`}
              description={`Total: $${order.totalPrice}`}
            />
            <Tag color={getStatusColor(order.tracking.status)}>
              {order.tracking.status}
            </Tag>
          </Card>
        ))}
    </Card>
  );

  const renderReviewModal = () => (
    <Modal
      visible={isReviewModalVisible}
      title="Agent Performance Reviews"
      onCancel={() => setIsReviewModalVisible(false)}
      footer={null}
    >
      {(user as DeliveryAgent).reviews.map((review) => (
        <Card key={review.id} style={{ marginBottom: 16 }}>
          <Rate value={review.rating} disabled />
          <Typography.Paragraph>{review.comment}</Typography.Paragraph>
        </Card>
      ))}
    </Modal>
  );

  return (
    <>
      <Drawer 
        open={isOpen} 
        onClose={onClose} 
        placement="bottom" 
        height="90%"
      >
        {/* Existing profile header and sections */}
        {renderOrderTable()}
        {renderAgentReviews()}
        {renderAdvancedVerification()}
        {renderReviewModal()}
      </Drawer>
    </>
  );
};

export default ProfileDrawer;