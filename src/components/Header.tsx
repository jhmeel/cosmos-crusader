import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Avatar, Badge } from "antd";
import { SearchOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import ProfileDrawer from "./ProfileDrawer";

interface HeaderProps {
  user: {
    name: string;
    photoURL?: string;
    role: string;
  };
}

const ResponsiveHeader: React.FC<HeaderProps> = ({ user }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollThreshold = 100;

    setIsVisible(
      currentScrollY <= scrollThreshold || currentScrollY < lastScrollY
    );
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <header
        className={`
        fixed top-0 left-0 right-0 z-50 bg-white shadow-md 
        transition-transform duration-300 ease-in-out
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Company Logo"
                className="h-8 w-8 rounded-full"
              />
              <span className="hidden md:block text-lg font-bold text-gray-800">
                Shopverse
              </span>
            </Link>
          </div>

          {/* Search Input */}
          <div className="flex-grow max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                w-full pl-10 pr-4 py-2 
                border border-gray-300 rounded-full 
                focus:outline-none focus:ring-2 focus:ring-blue-500
                bg-gray-100
              "
              />
              <SearchOutlined
                className="
                absolute left-3 top-1/2 transform -translate-y-1/2 
                text-gray-500
              "
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/notifications" className="relative">
              <Badge count={5}>
                <BellOutlined className="text-xl text-gray-700 hover:text-blue-600" />
              </Badge>
            </Link>

            <Avatar
              src={user?.photoURL}
              icon={!user?.photoURL ? <UserOutlined /> : undefined}
              onClick={() => setIsProfileDrawerOpen(true)}
              className="cursor-pointer"
            />
          </div>
        </div>
      </header>

      <ProfileDrawer
        user={user}
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
      />
    </>
  );
};

export default ResponsiveHeader;
