import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  IconButton,
  Modal,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  Menu,
} from "@mui/material";
import {
  CreditCard,
  Payments,
  Add,
  Remove,
  Close,
  Image,
  CloseOutlined,
  Security,
  FilterList,
  Info,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import axios from "axios";

const BTC_ADDRESS = "your_btc_address";
const USDT_ADDRESS = "your_usdt_address";

const CheckoutContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const CartItemContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  width: "100%",
  position: "relative",
}));

const CartItemImage = styled("img")(({ theme }) => ({
  width: "60px",
  height: "60px",
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  objectFit: "cover",
}));

const PaymentOptions = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: theme.spacing(3),
  gap: theme.spacing(2),
}));

const CustomPaymentButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  flex: 1,
  display: `flex`,
  boxShadow: `none`,
  border: `none`,
  padding: theme.spacing(1),
  fontSize: "0.875rem",
  "&.card-button": {
    color: "white",
    "&:hover": {},
  },
  "&.crypto-button": {
    color: "white",
  },
}));

const CustomPaymentButton2 = styled(Button)(({ theme }) => ({
  textTransform: "none",
  flex: 1,
  background: `transparent`,
  boxShadow: `none`,
  border: `2px solid#7000ff`,
  padding: theme.spacing(1),
  fontSize: "0.875rem",
  "&.card-button": {
    color: "white",
    "&:hover": {},
  },
  "&.crypto-button": {
    color: "white",
  },
}));

const CryptoModalContent = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  outline: "none",
  textAlign: "center",
  width: "90%",
  maxWidth: "400px",
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: 10,
}));

const FilterMenuButton = styled(Button)({
  textTransform: 'none',
  background:`none`,
  color:`#fff`,
  boxShadow:`none`,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

const Checkout: React.FC<{
  cart: {
    id: string;
    asin: string;
    product_title: string;
    product_price: number;
    quantity: number;
    product_photo?: string;
  }[];
  open: boolean;
  onClose: () => void;
}> = ({ cart, open, onClose }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const [cryptoMenu, setCryptoMenu] = useState<null | HTMLElement>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cryptoModal, setCryptoModal] = useState(false);
  const [cryptoOption, setCryptoOption] = useState<"usdt" | "btc">("usdt");
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success" as "success" | "error",
    message: "",
  });
  const [localCart, setLocalCart] = useState(cart);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  const totalAmount = localCart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const handlePaymentMethodChange = (method: "card" | "crypto") => {
    setPaymentMethod(method);
  };

  const handleCryptoOptionChange = (option: "usdt" | "btc") => {
    setCryptoOption(option);
  };

  const handleCardPayment = async () => {
    try {
      await axios.post("/api/card-payment", {
        cardNumber,
        expiryDate,
        cvv,
        amount: totalAmount,
      });
      setSnackbar({
        open: true,
        severity: "success",
        message: "Card payment successful. Order processing.",
      });
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Error processing card payment.",
      });
    }
  };

  const handleCryptoPayment = async () => {
    setCryptoModal(true);
  };

  const handleCryptoModalClose = () => setCryptoModal(false);

  const handleCryptoPaymentConfirm = async () => {
    setLoading(true);
    const address = cryptoOption === "usdt" ? USDT_ADDRESS : BTC_ADDRESS;
    try {
      await axios.post("/api/crypto-payment", {
        address,
        amount: totalAmount,
        option: cryptoOption,
      });
      setSnackbar({
        open: true,
        severity: "success",
        message: "Crypto payment successful.",
      });
      handleCryptoModalClose();
      onClose();
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Error in crypto payment.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (id: string, action: "increase" | "decrease") => {
    setLocalCart((prevCart) =>
      prevCart.map((item) =>
        item?.id || item?.asin  === id
          ? {
              ...item,
              quantity:
                action === "increase"
                  ? item.quantity + 1
                  : Math.max(item.quantity - 1, 1),
            }
          : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setLocalCart((prevCart) => prevCart.filter((item) => item?.id || item?.asin !== id));
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleCryptoMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCryptoMenu(event.currentTarget);
  };

  const handlecryptoMenuClose = () => {
    setCryptoMenu(null);
  };

  return (
    <>
      <Drawer
        anchor={isSmallScreen ? "bottom" : "right"}
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "400px" },
            maxHeight: { xs: "90vh", sm: "100vh" },
            borderRadius: { xs: "20px 20px 0 0", sm: "0" },
          },
        }}
      >
        <CloseButton onClick={onClose}>
          <CloseOutlined />
        </CloseButton>
        <CheckoutContainer>
          <Typography
            variant="h6"
            sx={{ mb: 1 }}
            display={`flex`}
            alignItems={`center`}
            gap={`10px`}
          >
            <Security /> Secure Checkout
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            We use encryption to protect your data.
          </Typography>
          <Divider sx={{ width: "100%", mb: 2 }} />

          {!!localCart.length && (
            <Typography variant="h5" sx={{ mb: 2 }}>
              Your Cart
            </Typography>
          )}
          {localCart.map((item) => (
            <CartItemContainer key={item?.id || item?.asin}>
              {item?.product_photo  ? (
                <CartItemImage src={item.product_photo} alt={item.product_title} />
              ) : (
                <Box
                  width={60}
                  height={60}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image />
                </Box>
              )}
              <Box flex="1">
                <Typography variant="subtitle1">{item.product_title}</Typography>
                <Typography variant="body2">
                  ${item.product_price}
                </Typography>
                <Box display="flex" alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => updateQuantity(item?.id||item?.asin, "decrease")}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography>{item.quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => updateQuantity(item?.id||item?.asin, "increase")}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => removeFromCart(item?.id||item?.asin)}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="subtitle1">
                ${(item.price * item.quantity)}
              </Typography>
            </CartItemContainer>
          ))}

          <Divider sx={{ width: "100%", my: 2 }} />

          <Typography variant="h6">Total: ${totalAmount}</Typography>

          <PaymentOptions>
            <CustomPaymentButton
              className="card-button"
              variant={paymentMethod === "card" ? "contained" : "outlined"}
              onClick={() => handlePaymentMethodChange("card")}
            >
              <CreditCard sx={{ mr: 1 }} /> Pay with Card
            </CustomPaymentButton>
            <CustomPaymentButton2
              className="crypto-button"
              variant={paymentMethod === "crypto" ? "contained" : "outlined"}
              onClick={() => handlePaymentMethodChange("crypto")}
            >
              <Payments sx={{ mr: 1 }} /> Pay with Crypto
            </CustomPaymentButton2>
          </PaymentOptions>

          {paymentMethod === "card" && (
            <Box width="100%" mt={2}>
              <TextField
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Expiry Date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCardPayment}
                fullWidth
                sx={{ mt: 2, py: 1.5 }}
              >
                Pay ${totalAmount}
              </Button>
            </Box>
          )}

          {paymentMethod === "crypto" && (
            <Box
              width="100%"
              mt={2}
              display="flex"
              flexDirection="column"
              gap={2}
            >
              <FilterMenuButton
               variant="text"
               startIcon={<FilterList />}
               size="small"
                onClick={handleCryptoMenu}
              >
                Select Cryptocurrency
              </FilterMenuButton>
              <Menu
                anchorEl={cryptoMenu}
                open={Boolean(cryptoMenu)}
                onClose={handlecryptoMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={() => handleCryptoOptionChange("usdt")}>
                  USDT
                </MenuItem>
                <MenuItem onClick={() => handleCryptoOptionChange("btc")}>
                  BTC
                </MenuItem>
              </Menu>

              <Button
                variant="contained"
                color="primary"
                onClick={handleCryptoPayment}
                sx={{ mt: 2, py: 1.5 }}
              >
                Pay with {cryptoOption === "usdt" ? "USDT" : "BTC"}
              </Button>
            </Box>
          )}
        </CheckoutContainer>
      </Drawer>

      <Modal open={cryptoModal} onClose={handleCryptoModalClose}>
        <CryptoModalContent>
          <CloseButton onClick={handleCryptoModalClose}>
            <Close />
          </CloseButton>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Confirm Crypto Payment
          </Typography>

          <Typography
          style={{background:`#456`,padding:`10px`, borderLeft:`4px solid #324658 `}}
            variant="body2"
            sx={{ mb: 1 }}
            display={`flex`}
            alignItems={`center`}
            gap={`10px`}
          >
            <Info color="warning" /> Only click on "confirm payment" if you have made the transaction!
          </Typography>

         
          <Typography variant="body2" gutterBottom>
            Send {totalAmount} {cryptoOption === "usdt" ? "USDT" : "BTC"} to:
          </Typography>
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{ mb: 2, wordBreak: "break-all" }}
          >
            {cryptoOption === "usdt" ? USDT_ADDRESS : BTC_ADDRESS}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCryptoPaymentConfirm}
            disabled={loading}
            fullWidth
            sx={{ py: 1.5 }}
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </Button>
        </CryptoModalContent>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Checkout;
