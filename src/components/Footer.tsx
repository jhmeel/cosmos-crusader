import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, BorderStyle, LinkedIn } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import logo from "../assets/shopverse-main.png";

const FooterContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
  gap:`5px`,
  height: `fit-content`,
  backgroundColor: "#424242",
  color: "#ffffff",
  width: "100%",
  marginTop: `15px`,

}));

const Logo = styled(Typography)({
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "#333",
  display: "flex",
  alignItems: "center",
  "& img": {
    height: "auto",
    width: `8rem`,
    border:`1px solid #005e8a`
  },
});

const Socials = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "1rem",
  marginTop: "1rem",
  marginBottom: "1rem",
  [theme.breakpoints.up("sm")]: {
    marginBottom: "0",
  },
}));

const Footer: React.FC = () => {
  return (
    <FooterContainer>
     
      <div style={{position:`relative`, display:`flex`,flexDirection:`column`,alignItems:`center`, justifyContent:`center`}}>
        <Logo>
          <img src={logo} alt="Shopverse" />
        </Logo>
        <Socials>
          <IconButton
            aria-label="Facebook"
            href="https://www.facebook.com"
            target="_blank"
          >
            <Facebook style={{ color: "#ffffff" }} />
          </IconButton>
          <IconButton
            aria-label="LinkedIn"
            href="https://www.linkedIn.com"
            target="_blank"
          >
            <LinkedIn style={{ color: "#ffffff" }} />
          </IconButton>
          <IconButton
            aria-label="Twitter"
            href="https://www.twitter.com"
            target="_blank"
          >
            <Twitter style={{ color: "#ffffff" }} />
          </IconButton>
          <IconButton
            aria-label="Instagram"
            href="https://www.instagram.com"
            target="_blank"
          >
            <Instagram style={{ color: "#ffffff" }} />
          </IconButton>
        </Socials>
      </div>

      <Typography variant="body2" align="center">
        <a href="/" style={{ color: "#ffffff", textDecoration: "none" }}>
          Privacy Policy
        </a>
      </Typography>
      
      <Typography variant="body2" align="center" gutterBottom>
        &copy; {new Date().getFullYear()} Shopverse. All rights reserved.
      </Typography>
    </FooterContainer>
  );
};

export default Footer;
