import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import axios from 'axios';

// MUI Components & Icons
import {
    AppBar, Toolbar, Typography, Button, IconButton,
    TextField, FormControl, InputLabel, Select, MenuItem,
    Box, Grid, Drawer, List, ListItem, ListItemButton, ListItemText, CardMedia, CircularProgress,
    Paper, ListItemAvatar, Avatar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';


import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [allGames, setAllGames] = useState([]);
    const [genres, setGenres] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gamesResponse, genresResponse] = await Promise.all([
                    axios.get('/api/all/0'),
                    axios.get('/api/genre/list')
                ]);
                setAllGames(gamesResponse.data.content);
                setFilteredGames(gamesResponse.data.content);
                setTotalPages(gamesResponse.data.totalPages);
                setCurrentPage(0);
                setGenres(genresResponse.data);
            } catch (err) {
                setError('Failed to fetch data. Please make sure the backend is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        const handler = setTimeout(async () => {
            setIsSearchLoading(true);
            try {
                const response = await axios.get(`/api/search?query=${searchTerm.trim()}`);
                setSearchResults(response.data);
            } catch (err) {
                console.error('Search failed:', err);
                setSearchResults([]);
            } finally {
                setIsSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        let games = [...allGames];

        if (selectedGenre) {
            games = games.filter(game => game.genre && game.genre.name === selectedGenre);
        }
        setFilteredGames(games);
    }, [selectedGenre, allGames]);

    const handleLoadMore = async () => {
        const nextPage = currentPage + 1;
        if (loadingMore || nextPage >= totalPages) return;

        setLoadingMore(true);
        try {
            const response = await axios.get(`/api/all/${nextPage}`);
            setAllGames(prev => [...prev, ...response.data.content]);
            setCurrentPage(nextPage);
        } catch (err) {
            console.error("Failed to load more games:", err);
            setError("Failed to load more games. Please try again later.");
        } finally {
            setLoadingMore(false);
        }
    };

    const heroCarouselSettings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        pauseOnHover: false,
        fade: true,
        cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    };

    const featuredGames = allGames.slice(0, 4);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsMobileMenuOpen(open);
    };

    const searchResultsDropdown = (
        <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1301, mt: 1 }}>
            {isSearchLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : (
                <List>
                    {searchResults.map(game => (
                        <ListItemButton component={Link} to={`/games/${game.id}`} key={game.id}>
                            <ListItemAvatar>
                                <Avatar variant="square" src={game.coverImageUrl} />
                            </ListItemAvatar>
                            <ListItemText primary={game.title} secondary={game.publisher} />
                        </ListItemButton>
                    ))}
                </List>
            )}
        </Paper>
    );

    const mobileMenuContent = (
        <Box
            sx={{ width: 250, bgcolor: '#1f2937', height: '100%' }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                <ListItem disablePadding sx={{position: 'relative'}}>
                    <ListItemButton>
                        <TextField
                            label="Search games..."
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#4b5563' },
                                    '&:hover fieldset': { borderColor: '#2dd4bf' },
                                    '&.Mui-focused fieldset': { borderColor: '#2dd4bf' },
                                },
                                '& .MuiInputLabel-root': { color: '#9ca3af' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#2dd4bf' },
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: '#9ca3af', mr: 1 }} />,
                            }}
                        />
                    </ListItemButton>
                    {(searchResults.length > 0 || isSearchLoading) && searchTerm && searchResultsDropdown}
                </ListItem>
                <ListItem disablePadding>
                    <FormControl fullWidth size="small" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="genre-select-label" sx={{ color: '#9ca3af' }}>Genre</InputLabel>
                        <Select
                            labelId="genre-select-label"
                            value={selectedGenre}
                            label="Genre"
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#4b5563' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2dd4bf' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2dd4bf' },
                                '& .MuiSvgIcon-root': { color: 'white' },
                            }}
                        >
                            <MenuItem value="">All Genres</MenuItem>
                            {genres.map(genre => (
                                <MenuItem key={genre.name} value={genre.name}>{genre.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </ListItem>
            </List>
        </Box>
    );


    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: '#111827',
            fontFamily: 'monospace',
            color: '#e5e7eb',
            overflowX: 'hidden'
        }}>
            <AppBar position="sticky" sx={{ bgcolor: '#1f2937', boxShadow: 3 }}>
                <Toolbar sx={{ justifyContent: 'space-between', maxWidth: 'lg', mx: 'auto', width: '100%' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'extrabold', color: '#2dd4bf', display: 'flex', alignItems: 'center' }}>
                            <SportsEsportsIcon sx={{ mr: 1, fontSize: '2rem' }} /> Potato Gaming
                        </Typography>
                    </Link>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
                        <Box sx={{ position: 'relative' }}>
                            <TextField
                                label="Search games..."
                                variant="outlined"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: 'white',
                                        borderRadius: '9999px',
                                        pr: 1,
                                        '& fieldset': { borderColor: '#4b5563' },
                                        '&:hover fieldset': { borderColor: '#2dd4bf' },
                                        '&.Mui-focused fieldset': { borderColor: '#2dd4bf' },
                                    },
                                    '& .MuiInputLabel-root': { color: '#9ca3af' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#2dd4bf' },
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: '#9ca3af', mr: 1 }} />,
                                }}
                            />
                            {(searchResults.length > 0 || isSearchLoading) && searchTerm && searchResultsDropdown}
                        </Box>
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel id="genre-select-label" sx={{ color: '#9ca3af' }}>Genre</InputLabel>
                            <Select
                                labelId="genre-select-label"
                                value={selectedGenre}
                                label="Genre"
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                sx={{
                                    color: 'white',
                                    borderRadius: '9999px',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#4b5563' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2dd4bf' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2dd4bf' },
                                    '& .MuiSvgIcon-root': { color: 'white' },
                                }}
                            >
                                <MenuItem value="">All Genres</MenuItem>
                                {genres.map(genre => (
                                    <MenuItem key={genre.name} value={genre.name}>{genre.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                        sx={{ display: { xs: 'block', md: 'none' }, color: 'white' }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={isMobileMenuOpen}
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: { bgcolor: '#1f2937' },
                }}
            >
                {mobileMenuContent}
            </Drawer>


            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1 }}>
                {/* Hero Carousel */}
                <Box sx={{ mb: 6, '.slick-dots': { bottom: '25px' } }}>
                    <Slider {...heroCarouselSettings}>
                        {featuredGames.map(game => (
                            <Box
                                key={game.id}
                                component={Link}
                                to={`/games/${game.id}`}
                                sx={{
                                    position: 'relative',
                                    height: '60vh',
                                    color: 'white',
                                    display: 'block',
                                    textDecoration: 'none'
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={game.screenshotUrls[0]}
                                    alt={game.title}
                                    sx={{
                                        position: 'absolute',
                                        top: 0, left: 0,
                                        width: '100%', height: '100%',
                                        objectFit: 'cover',
                                        zIndex: 1
                                    }}
                                />
                                <Box sx={{
                                    position: 'absolute', top: 0, left: 0,
                                    width: '100%', height: '100%', zIndex: 2,
                                    background: 'linear-gradient(to top, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.5) 50%, rgba(17, 24, 39, 0) 100%)'
                                }} />
                                <Box sx={{
                                    position: 'relative', zIndex: 3,
                                    p: { xs: 3, md: 6 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-start'
                                }}>
                                    <Typography variant="h2" component="h2" sx={{ fontWeight: 'bold', mb: 2, textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                                        {game.title}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px', textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
                                        {game.description}
                                    </Typography>
                                    <Button variant="contained" size="large" sx={{ bgcolor: '#2dd4bf', '&:hover': { bgcolor: '#1f9e8f' }, color: '#111827', fontWeight: 'bold' }}>
                                        Check it Out
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                    </Slider>
                </Box>

                {/* All Games Section */}
                <Box sx={{ maxWidth: 'xl', mx: 'auto', ml: 4 , px: { xs: 2, md: 4 }, py: 4 }}>
                    <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'extrabold', color: 'white', mb: 3, textAlign: { xs: 'center', md: 'left' } }}>
                        All Games
                    </Typography>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error" align="center">{error}</Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredGames.length > 0 ? (
                                filteredGames.map(game => (
                                    <Grid item xs={12} sm={6} md={3} lg={2.4} xl={2} key={game.id}>
                                        <GameCard game={game} />
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Typography variant="h6" align="center" sx={{ color: '#9ca3af' }}>
                                        No games found matching your criteria.
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    )}
                     {!loading && !searchTerm && currentPage < totalPages - 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <Button
                                variant="contained"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                sx={{ bgcolor: '#2dd4bf', '&:hover': { bgcolor: '#1f9e8f' }, color: '#111827', fontWeight: 'bold', px: 4, py: 1.5 }}
                            >
                                {loadingMore ? <CircularProgress size={24} color="inherit" /> : 'Load More Games'}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ bgcolor: '#1f2937', py: 3, mt: 'auto', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
                <Typography variant="body2">
                    &copy; {new Date().getFullYear()} Potato Gaming. All rights reserved. For nostalgic purposes only.
                </Typography>
            </Box>
        </Box>
    );
};

export default HomePage;