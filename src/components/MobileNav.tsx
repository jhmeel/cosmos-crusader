import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  ShopOutlined, 
  ShoppingCartOutlined, 
  ProfileOutlined,
  UnorderedListOutlined 
} from '@ant-design/icons';
import { TabBar, Badge } from 'antd-mobile';

const MobileBottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      key: '/',
      title: 'Home',
      icon: <HomeOutlined />,
      activeIcon: <HomeOutlined style={{ color: '#1890ff' }} />
    },
    {
      key: '/explore',
      title: 'Explore',
      icon: <ShopOutlined />,
      activeIcon: <ShopOutlined style={{ color: '#1890ff' }} />
    },
    {
      key: '/orders',
      title: 'Orders',
      icon: <UnorderedListOutlined />,
      activeIcon: <UnorderedListOutlined style={{ color: '#1890ff' }} />
    },
    {
      key: '/checkout',
      title: 'Cart',
      icon: (
        <Badge content={5}>
          <ShoppingCartOutlined />
        </Badge>
      ),
      activeIcon: (
        <Badge content={5}>
          <ShoppingCartOutlined style={{ color: '#1890ff' }} />
        </Badge>
      )
    },
    {
      key: '/profile',
      title: 'Profile',
      icon: <ProfileOutlined />,
      activeIcon: <ProfileOutlined style={{ color: '#1890ff' }} />
    }
  ];

  const handleTabChange = (key: string) => {
    navigate(key);
  };

  return (
    <TabBar 
      safeArea 
      onChange={handleTabChange}
      activeKey={location.pathname}
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 1000,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.08)'
      }}
    >
      {navItems.map(item => (
        <TabBar.Item
          key={item.key}
          icon={item.icon}
          selectedIcon={item.activeIcon}
          title={item.title}
        />
      ))}
    </TabBar>
  );
};

export default MobileBottomNavigation;