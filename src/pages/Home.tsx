import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Filter from "../components/ProductFilter";
import ProductGrid from "../components/ProductGrid";
import Checkout from "../components/Checkout";
import axios from "axios";
import { Container, Snackbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

const StyledContainer = styled(Container)(({ theme }) => ({
  width: "100%",
  height: "auto",
}));

const CACHE_KEY = "productSearchCache";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    sizes: [],
    categories: [],
    priceRange: [10, 1000],
  });
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageRef = useRef(null);
  const [query, setQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    getQueryFromUrl();
    fetchProducts();
  }, [page, location.search]);

  const getQueryFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    setQuery(searchParams.get("search") || "");
  };

  useEffect(() => {
    filterProducts();
  }, [filterOptions, products]);

  const fetchProducts = async () => {
    if (!query || query.length <= 2) return;

    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");

    // Check if data for the query is already cached
    if (cache[query]) {
      setProducts(cache[query]);
      setFilteredProducts(cache[query]);
      return;
    }

    try {
      setLoading(true);

      const headers = {
        "X-RapidAPI-Key": "YOUR_API_KEY",
        "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com",
      };

      const response = await axios.get(
        `https://real-time-amazon-data.p.rapidapi.com/search`,
        {
          headers,
          params: {
            query,
            page: 1,
            country: "US",
            sort_by: "RELEVANCE",
            product_condition: "ALL",
            is_prime: false,
            deals_and_discounts: "NONE",
          },
        }
      );

      if (response.data && response.data.data.products) {
        const productsData = response.data.data.products;
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Cache the response for future queries
        cache[query] = productsData;
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      } else {
        throw new Error("No products found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products.filter(
      (product) =>
        product.product_price >= filterOptions.priceRange[0] &&
        product.product_price <= filterOptions.priceRange[1]
    );

    if (filterOptions.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filterOptions.brands.some((brand) =>
          product?.product_title.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    if (filtered[0]?.category) {
      if (filterOptions.categories.length > 0) {
        filtered = filtered.filter((product) =>
          filterOptions.categories.some((category) =>
            product?.category.toLowerCase().includes(category.toLowerCase())
          )
        );
      }
    }

    //setFilteredProducts(filtered);
    setFilteredProducts(products);
  };

  const handleFilterChange = (newFilterOptions) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      ...newFilterOptions,
    }));
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find(
      (item) => item?.id === (product?.id || product?.asin)
    );
    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item?.id === (product?.id || product?.asin)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    const cartIcon = document.querySelector(".cart-icon");
    cartIcon?.classList.add("bounce");
    setTimeout(() => {
      cartIcon?.classList.remove("bounce");
    }, 500);
  };

  const handleScroll = () => {
    if (
      pageRef.current &&
      window.innerHeight + window.scrollY >= pageRef.current.offsetHeight &&
      products.length % 12 === 0
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleOpenCheckout = () => {
    setCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
  };

  return (
    <main style={{ minHeight: `100vh` }}>
      <Header cart={cart} onCartClick={handleOpenCheckout} />
      <StyledContainer>
        <Filter onFilterChange={handleFilterChange} />
        <ProductGrid
          filteredProducts={filteredProducts}
          handleAddToCart={handleAddToCart}
          pageRef={pageRef}
          handleScroll={handleScroll}
          loading={loading}
        />
        <Checkout
          cart={cart}
          open={checkoutOpen}
          onClose={handleCloseCheckout}
        />
      </StyledContainer>
      <Snackbar
        open={!!error}
        message={error}
        autoHideDuration={2000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <Footer />
    </main>
  );
};

export default Home;
