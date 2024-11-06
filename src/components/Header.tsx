import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Badge,
} from "@mui/material";
import { Search, ShoppingCart } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import logo from "../assets/shopverse-main.png";
import { useNavigate, useLocation } from "react-router-dom";

const HeaderContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "1rem",
  backgroundColor: "#424242",
  maxHeight: `80px`,
  minWidth: `100%`,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  position: `relative`,
  gap: `20px`,
});

const Logo = styled(Typography)({
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "#333",
  display: "flex",
  left: `-25px`,
  [`@media (max-width: 600px)`]: {
    left: `-36px`,
  },
  position: `absolute`,
  alignItems: "center",
  "& img": {
    height: "auto",
    width: `10rem`,
  },
});

const SearchBar = styled(TextField)({
  maxWidth: "250px",
  [`@media (max-width: 600px)`]: {
    maxWidth: "240px",
  },
  "& .MuiInputAdornment-positionEnd": {
    marginRight: "0.5rem",
  },
});

const CartIcon = styled(Box)({
  position: "relative",
  "& .MuiSvgIcon-root": {
    fontSize: "1.5rem",
    color: "#ffffff",
    cursor: "pointer",
  },
  "& .cart-count": {
    position: "absolute",
    top: "-0.5rem",
    right: "-0.5rem",
    backgroundColor: "#ff4081",
    color: "#fff",
    borderRadius: "50%",
    width: "1.2rem",
    height: "1.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  "&.bounce": {
    animation: "bounce 0.5s ease-in-out",
    "@keyframes bounce": {
      "0%": {
        transform: "scale(1)",
      },
      "50%": {
        transform: "scale(1.2)",
      },
      "100%": {
        transform: "scale(1)",
      },
    },
  },
});

const Header: React.FC<{
  cart: { id: string; title: string; price: number; quantity: number }[];
  onCartClick: () => void;
}> = ({ cart, onCartClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    setQuery("");
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has("search")) {
      searchParams.delete("search");
      navigate({ search: searchParams.toString() }, { replace: true });
    }
  }, [navigate, location.search]);

  useEffect(() => {
    if (query !== null && query !== ``) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("search", query);
      navigate({ search: searchParams.toString() }, { replace: true });
    }
  }, [query, location.search, navigate]);

  return (
    <HeaderContainer>
      <Logo onClick={() => window.location.reload()}>
        <img src={logo} alt="Shopverse" />
      </Logo>
      <SearchBar
        variant="outlined"
        size="small"
        placeholder="Search products..."
        onChange={handleInputChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <CartIcon className="cart-icon" onClick={onCartClick}>
        <Badge badgeContent={cart.length} color="error">
          <ShoppingCart />
        </Badge>
      </CartIcon>
    </HeaderContainer>
  );
};

export default Header;
