import React, { useState, useEffect } from "react";
import { List, Toast } from "antd-mobile";
import {
  UserOutlined,
  LogoutOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  StarOutlined,
  CameraOutlined,
  OrderedListOutlined,
  FileProtectOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
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
  Radio,
  Steps,
} from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import {
  AgentVerificationStatus,
  DeliveryAgent,
  DeliveryStatus,
  Order,
  OrderStatus,
  UserRole,
  UserState,
  VerificationDocument,
} from "../types";
import { alexRodriguez } from "../utils/demo";
import DBOPS from "../api/dbOps";
import { getStatusColor } from "../utils/misc";
import DeliveryStatusIcon from "./AgentStatusIcon";
import OrderTable from "./OrderTable";

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
}) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isVerificationModalVisible, setIsVerificationModalVisible] =
    useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [user, setUser] = useState(alexRodriguez);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "ALL">("ALL");
  const [selectedVerificationDoc, setSelectedVerificationDoc] =
    useState<VerificationDocument | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchOrders =
      user.currentRole === UserRole.AGENT
        ? DBOPS.fetchAgentOrders
        : DBOPS.fetchUserOrders;

    fetchOrders(user.id, (fetchedOrders) => {
      setOrders(fetchedOrders);
    });
  }, [user, isOpen]);

  const trackLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          Toast.show({
            content: "Unable to retrieve location",
            position: "bottom",
          });
        }
      );
    }
  };

  const handleProfileImageUpload = async (file: File) => {
    try {
      const storageRef = ref(storage, `profileImages/${user.id}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      await DBOPS.updateUserProfile(user.id, downloadURL);

      setUser((prev) => ({ ...prev, photoUrl: downloadURL }));
      setProfileImage(file);

      Toast.show({
        content: "Profile image uploaded successfully",
        position: "bottom",
      });
    } catch (error) {
      Toast.show({
        content: "Profile image upload failed",
        position: "bottom",
        icon: "fail",
      });
    }
  };

  const handleDocumentUpload = async () => {
    if (!documentFile || !selectedVerificationDoc) {
      Toast.show({
        content: "Please select a document type and file",
        position: "bottom",
      });
      return;
    }

    try {
      const storageRef = ref(
        storage,
        `verificationDocs/${user.id}/${selectedVerificationDoc}`
      );
      const uploadResult = await uploadBytes(storageRef, documentFile);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      await DBOPS.updateAgentVerification(user.id, {
        documentType: selectedVerificationDoc,
        documentUrl: downloadURL,
        status: AgentVerificationStatus.PENDING,
      });

      Toast.show({
        content: "Verification document uploaded successfully",
        position: "bottom",
      });
      setIsVerificationModalVisible(false);
    } catch (error) {
      Toast.show({
        content: "Document upload failed",
        position: "bottom",
        icon: "fail",
      });
    }
  };

  const renderOrderCard = (order: Order) => (
    <Card
      key={order.id}
      hoverable
      onClick={() => setSelectedOrder(order)}
      style={{ marginBottom: 10 }}
    >
      <Card.Meta
        title={`Order #${order.id}`}
        description={`Total: $${order.totalPrice}`}
      />
      <Tag color={getStatusColor(order.tracking.status)}>
        {order.tracking.status}
      </Tag>
    </Card>
  );

  const renderAgentVerification = () => {
    if (user?.currentRole !== UserRole.AGENT) return null;

    const verificationSteps = [
      { title: "Select Document" },
      { title: "Upload Document" },
      { title: "Verification" },
    ];

    const currentStep =
      user.agent?.AgentverificationStatus === AgentVerificationStatus.PENDING
        ? 1
        : user.agent?.AgentverificationStatus ===
          AgentVerificationStatus.VERIFIED
        ? 2
        : 0;

    return (
      <List>
        <List.Item
          prefix={<SafetyOutlined />}
          extra={
            <Button
              color="primary"
              variant="outlined"
              size="small"
              onClick={() => setIsVerificationModalVisible(true)}
            >
              Verify Profile
            </Button>
          }
        >
          <Typography.Text type="warning">
            Complete agent verification to take orders
          </Typography.Text>
        </List.Item>

        <Steps
          current={currentStep}
          style={{ maxWidth: `600px`, margin: `0 auto`, marginBottom: `16px` }}
        >
          {verificationSteps.map((step) => (
            <Steps.Step key={step.title} title={step.title} />
          ))}
        </Steps>
      </List>
    );
  };

  const renderAgentPerformance = () => {
    if (user.currentRole !== UserRole.AGENT || !("totalScore" in user.agent))
      return null;

    return (
      <List>
        <List.Item
          prefix={<StarOutlined />}
          extra={
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Rate
                disabled
                defaultValue={user.agent.totalScore}
                allowHalf
                style={{ color: "#ffb618" }}
              />
              <Badge
                count={user.agent.reviewCount}
                overflowCount={999}
                style={{ backgroundColor: "#52c41a" }}
              />
            </div>
          }
        >
          Rating
        </List.Item>
        <List.Item
          prefix={<DeliveryStatusIcon status={user.agent.status} />}
          extra={
            <Switch
              checked={user.agent.status === DeliveryStatus.AVAILABLE}
              onChange={(checked) =>
                (user.agent as DeliveryAgent).updateDeliveryStatus(
                  checked
                    ? DeliveryStatus.AVAILABLE
                    : DeliveryStatus.UNAVAILABLE
                )
              }
            />
          }
        >
          Availability Status
        </List.Item>
      </List>
    );
  };

  useEffect(() => {
    if (isOpen) {
      trackLocation();
    }
  }, [isOpen]);

  const handleRoleToggle = (checked: boolean) => {
    const newRole = checked ? UserRole.AGENT : UserRole.CUSTOMER;
    onRoleChange(newRole);
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={onLogout} style={{ color: "red" }}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Drawer
        open={isOpen}
        onClose={onClose}
        placement="bottom"
        height="90%"
        styles={{
          body: {
            padding: `5px`,
          },
        }}
        style={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            margin: "0 auto",
            height: "100%",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div style={{ position: "relative", marginBottom: 10 }}>
              <Avatar size={120} src={user?.photoUrl} icon={<UserOutlined />} />
              <Upload
                multiple={false}
                accept="image/*"
                beforeUpload={(file) => {
                  handleProfileImageUpload(file);
                  return false; // Prevent default upload behavior
                }}
              >
                <Button
                  type="text"
                  icon={<CameraOutlined />}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "#ededed",
                    borderRadius: "50%",
                  }}
                />
              </Upload>
            </div>

            <Typography.Title level={4} style={{ margin: 0 }}>
              {user?.name}
            </Typography.Title>
            <Typography.Text type="secondary">{user?.email}</Typography.Text>

            <div style={{ margin: "15px 0" }}>
              <Switch
                checked={currentRole === UserRole.AGENT}
                onChange={handleRoleToggle}
                checkedChildren="Agent"
                unCheckedChildren="Customer"
              />
            </div>

            <Dropdown
              overlay={profileMenu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                type="text"
                icon={<LogoutOutlined />}
                style={{ position: "absolute", top: 10, right: 10 }}
              />
            </Dropdown>
          </div>

          <OrderTable order={orders} />
          {renderAgentVerification()}
          {renderAgentPerformance()}

          <List>
            <List.Item
              prefix={<EnvironmentOutlined />}
              extra={
                location
                  ? `${location.latitude.toFixed(
                      4
                    )}, ${location.longitude.toFixed(4)}`
                  : "Fetching..."
              }
            >
              Current Location
            </List.Item>
          </List>
        </div>
      </Drawer>

      <Modal
        visible={isVerificationModalVisible}
        title="Agent Verification"
        onCancel={() => setIsVerificationModalVisible(false)}
        footer={
          <Button
            block
            type="primary"
            onClick={handleDocumentUpload}
            disabled={!documentFile || !selectedVerificationDoc}
          >
            Submit Verification
          </Button>
        }
      >
        <Typography.Paragraph>
          Select a document type for verification:
        </Typography.Paragraph>

        <Radio.Group
          style={{ width: "100%", marginBottom: 16 }}
          onChange={(e) => setSelectedVerificationDoc(e.target.value)}
          value={selectedVerificationDoc}
        >
          <Radio
            value={VerificationDocument.DRIVERS_LICENSE}
            style={{ width: "100%" }}
          >
            Driver's License
          </Radio>
          <Radio
            value={VerificationDocument.NIN_SLIP}
            style={{ width: "100%" }}
          >
            NIN Slip
          </Radio>
          <Radio
            value={VerificationDocument.NATIONAL_ID}
            style={{ width: "100%" }}
          >
            National Identity Card
          </Radio>
        </Radio.Group>

        <Upload
          multiple={false}
          accept=".jpg, .png, .pdf"
          beforeUpload={(file) => {
            setDocumentFile(file);
            return false; // Prevent default upload behavior
          }}
        >
          <Button icon={<FileProtectOutlined />}>
            Select Verification Document
          </Button>
        </Upload>

        {documentFile && (
          <Typography.Text style={{ marginTop: 10, display: "block" }}>
            Selected: {documentFile.name}
          </Typography.Text>
        )}
      </Modal>
    </>
  );
};

export default ProfileDrawer;
