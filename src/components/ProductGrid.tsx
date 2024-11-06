import React from "react";
import {
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import Skeleton from "@mui/material/Skeleton";

const ProductCard = styled(Card)({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const ProductImage = styled(CardMedia)({
  height: "200px",
});

const ProductDetails = styled(CardContent)({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

const AddToCartButton = styled(Button)(({ theme }) => ({
  marginTop: "1rem",
  [theme.breakpoints.up("sm")]: {
    marginTop: "auto",
  },
}));

const ProductGrid: React.FC<{
  filteredProducts: {
    id: string;
    asin:string;
    product_title: string;
    product_price: number;
    product_photo: string;
  }[];
  handleAddToCart: (product: {
    id: string;
    asin:string;
    product_title: string;
    product_price: number;
  }) => void;
  pageRef: React.RefObject<HTMLDivElement>;
  handleScroll: () => void;
  loading: boolean;
}> = ({
  filteredProducts,
  handleAddToCart,
  pageRef,
  handleScroll,
  loading,
}) => {

  console.table(filteredProducts)
  return (
    <Box>
      <Grid container spacing={4}>
        {!filteredProducts.length || loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card>
                  <Skeleton variant="rectangular" width="100%" height={200} />
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton
                      variant="text"
                      width="60%"
                      height={16}
                      sx={{ mb: 1 }}
                    />
                    <Skeleton variant="text" width="40%" height={16} />
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={36}
                      sx={{ mt: 2 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : filteredProducts.map((product) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={product?.id || product?.asin}
              >
                <ProductCard>
                  <ProductImage
                    component="img"
                    image={product?.product_photo}
                    alt={product?.product_title}
                  />
                  <ProductDetails>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.title}
                    </Typography>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6">
                        ${product?.product_price}
                      </Typography>
                      <AddToCartButton
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddToCart(product)}
                        component={motion.div}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        Add to Cart
                      </AddToCartButton>
                    </Box>
                  </ProductDetails>
                </ProductCard>
              </Grid>
            ))}
      </Grid>
      <div ref={pageRef} onScroll={handleScroll} />
    </Box>
  );
};

export default ProductGrid;
