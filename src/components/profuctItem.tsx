import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  videoURL: string | null; // Optional video URL
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", height: "auto" }}
      />
      <CardContent>
        <Typography variant="h5">{product.name}</Typography>
        <Typography variant="h6">${product.price}</Typography>
        {product.videoURL && (
          <div>
            <Typography variant="subtitle1">Watch Video:</Typography>
            <video width="100%" controls>
              <source src={product.videoURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        <Button variant="contained" color="primary">
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;