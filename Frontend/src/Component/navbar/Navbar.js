// Alador & Sondre
// Sondre laget det første utkast ved å bruke ren react og deretter gjenskapte Alador det ved å bruke Material ui, og la til mer funksjonalitet som mobilmodus & fullmodus og gjorde det responsiv

import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import useUserDetails from "../../util/userInfo";
import { Avatar, Box } from "@mui/material";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { firstName, lastName } = useUserDetails();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleProfileNavigation = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/login");
  };
  function stringAvatar(name) {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`, //importert userinfo.js logikk for å bruke fornavn og etternavn til brukeren i den navbar Avatar
    };
  }

  //mobilmodus Material ui drawer komponent
  const drawer = (
    <Drawer
      anchor="left"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      sx={{
        "& .MuiDrawer-paper": {
          width: "70%",
          bgcolor: "secondary.main", // Bruker temaets secondary main color for bakgrunnen
          color: "white", // sørger for at all tekst er hvit i den Drawer
        },
      }}
    >
      <List>
        {isLoggedIn ? (
          <>
            <ListItem
              button
              component={RouterLink}
              to="/"
              onClick={handleDrawerToggle}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary="Forside"
                sx={{ "& .MuiListItemText-primary": { color: "white" } }}
              />
            </ListItem>
            <ListItem
              button
              component={RouterLink}
              to="/registrer"
              onClick={handleDrawerToggle}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <AddBoxIcon />
              </ListItemIcon>
              <ListItemText
                primary="Legg Til Sau"
                sx={{ "& .MuiListItemText-primary": { color: "white" } }}
              />
            </ListItem>
            <ListItem
              button
              component={RouterLink}
              to="/profile"
              onClick={handleDrawerToggle}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText
                primary="Min Profil"
                sx={{ "& .MuiListItemText-primary": { color: "white" } }}
              />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon sx={{ color: "white" }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logg ut"
                sx={{ "& .MuiListItemText-primary": { color: "white" } }}
              />
            </ListItem>
          </>
        ) : (
          <ListItem
            button
            component={RouterLink}
            to="/login"
            onClick={handleDrawerToggle}
          >
            <ListItemText
              primary="Logg inn"
              sx={{ "& .MuiListItemText-primary": { color: "white" } }}
            />
          </ListItem>
        )}
      </List>
    </Drawer>
  );

  return (
    //forskjellige versjoner av navbar vises avhengig av tilstandene som isMobile && isLoggedIn for en pålogget mobilvisning eller !isMobile && isLoggedIn for en innlogget fullmodusvisning, osv.
    <AppBar position="sticky" color="secondary">
      <Toolbar disableGutters={true}>
        {isMobile && isLoggedIn && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 0, ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: isMobile || !isLoggedIn ? "center" : "inherit",
            marginLeft: { xs: isLoggedIn ? "15px" : "0", sm: "5" },
          }} //bruker disse tilstandene for å bestemme margin
        >
          Sheep Tracker
        </Typography>

        {isMobile && isLoggedIn && (
          <Avatar
            {...stringAvatar(`${firstName} ${lastName}`)}
            sx={{
              marginRight: 0,
              bgcolor: "primary.main",
              cursor: "pointer",
            }}
            onClick={handleProfileNavigation}
          />
        )}

        {!isMobile && isLoggedIn && (
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              flexGrow: 1,
            }} //nav-lenker som vises når en bruker er pålogget i fullmodus
          >
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              startIcon={<HomeIcon />}
              sx={{ margin: "0.5rem", fontSize: "1.1rem" }}
            >
              Forside
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/registrer"
              startIcon={<AddBoxIcon />}
              sx={{ margin: "0.5rem", fontSize: "1.1rem" }}
            >
              Legg Til Sau
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/profile"
              startIcon={<AccountBoxIcon />}
              sx={{ margin: "0.5rem", fontSize: "1.1rem" }}
            >
              Min Profil
            </Button>
            <div style={{ marginLeft: "auto" }}>
              <Box
                sx={{
                  margin: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1.1rem",
                }}
              >
                <Avatar
                  {...stringAvatar(`${firstName} ${lastName}`)}
                  sx={{ marginRight: 0, bgcolor: "primary.main" }} //Material ui avatar som henter fornavn og etternavn fra userinfo.js
                />
                <Button
                  color="inherit"
                  onClick={handleLogout} //bruker authContext.js sin logout logikk for å sende bruker til login siden
                  sx={{
                    margin: "0.5rem",
                    fontSize: "1.1rem",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 0,
                  }}
                >
                  Logg ut
                </Button>
              </Box>
            </div>
          </div>
        )}
        {isMobile
          ? drawer
          : !isLoggedIn && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ position: "absolute", right: 20 }}
              >
                Logg inn
              </Button>
            )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
