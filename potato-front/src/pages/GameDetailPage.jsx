import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import {
 Box,
 Typography,
 Button,
 Paper,
 Grid,
 CardMedia,
 CircularProgress,
 Divider,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const formatFileSize = (sizeInMb) => {
 if (!sizeInMb) return 'N/A';
 if (sizeInMb < 1024) {
  return `${sizeInMb.toFixed(0)} MB`;
 }
 return `${(sizeInMb / 1024).toFixed(2)} GB`;
};

const GameDetailPage = () => {
 const { id } = useParams();
 const [game, setGame] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const sliderRef = useRef(null);
 const [activeSlide, setActiveSlide] = useState(0);

 useEffect(() => {
  const fetchGame = async () => {
   setLoading(true);
   try {
    const response = await axios.get(`/api/${id}`);
    setGame(response.data);
   } catch (err) {
    setError(
     `Failed to fetch game data. Please check if the backend is running and the game ID (${id}) is correct.`
    );
    console.error(err);
   } finally {
    setLoading(false);
   }
  };
  fetchGame();
 }, [id]);

 if (loading) {
  return (
   <Box
    sx={{
     minHeight: '100vh',
     bgcolor: '#111827',
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
    }}
   >
    <CircularProgress />
   </Box>
  );
 }

 if (error) {
  return (
   <Box
    sx={{
     minHeight: '100vh',
     bgcolor: '#111827',
     color: '#e5e7eb',
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
     p: 4,
     textAlign: 'center',
    }}
   >
    <Typography variant="h4" color="error">
     {error}
    </Typography>
   </Box>
  );
 }

 if (!game) {
  return (
   <Box
    sx={{
     minHeight: '100vh',
     bgcolor: '#111827',
     color: '#e5e7eb',
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
    }}
   >
    <Typography variant="h4" color="error">
     Game Not Found!
    </Typography>
   </Box>
  );
 }

 const fileSize = formatFileSize(game.fileSize);

 const mediaItems = [];
 mediaItems.push({ type: 'image', url: game.coverImageUrl, alt: `${game.title} Cover Art` });
 
 if (game.trailerVideoUrl) {
    const videoIdMatch = game.trailerVideoUrl.match(/[?&]v=([^&]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (videoId) {
        mediaItems.push({
            type: 'video',
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/0.jpg`,
            title: `${game.title} Trailer`,
        });
    }
 }
 
 game.screenshotUrls?.forEach((url, index) => {
  mediaItems.push({
   type: 'image',
   url: url,
   alt: `Screenshot ${index + 1}`,
  });
 });

 const mainCarouselSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  afterChange: (current) => setActiveSlide(current),
  arrows: false,
 };

 return (
  <Box sx={{
   display: 'flex',
   flexDirection: 'column',
   minHeight: '100vh',
   bgcolor: '#111827',
   color: '#e5e7eb',
   overflowX: 'hidden'
  }}>
   <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, maxWidth: 'lg', mx: 'auto' }}>
    <Button
     component={Link}
     to="/"
     startIcon={<ArrowBackIcon />}
     sx={{ mb: 2, color: '#2dd4bf', '&:hover': { color: '#88e0cf' } }}
    >
     Back to all games
    </Button>

    <Divider sx={{ my: 3, bgcolor: '#374151' }} />

    {/* --- Top Hook Section --- */}
    <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
     {game.title}
    </Typography>
    <Typography variant="h5" sx={{ color: '#9ca3af', mb: 3 }}>
     by {game.publisher}
    </Typography>

    <Paper elevation={3} sx={{ bgcolor: '#1f2937', p: { xs: 2, md: 4 }, borderRadius: 2 }}>
     {/* --- Carousel Section --- */}
     <Box sx={{ mb: 4 }}>
      <Slider ref={sliderRef} {...mainCarouselSettings}>
       {mediaItems.map((item, index) => (
        <div key={index}>
         {item.type === 'image' ? (
          <CardMedia
           component="img"
           image={item.url}
           alt={item.alt}
           sx={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: 1 }}
          />
         ) : (
          <Box sx={{ position: 'relative', height: '500px' }}>
           <iframe
            src={item.embedUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            title={item.title}
           />
          </Box>
         )}
        </div>
       ))}
      </Slider>
     </Box>

     {/* --- Custom Thumbnail Navigation --- */}
     <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 6 }}>
      {mediaItems.map((item, index) => (
       <Box
        key={`thumb-${index}`}
        onClick={() => sliderRef.current.slickGoTo(index)}
        sx={{
         width: '80px',
         height: '60px',
         cursor: 'pointer',
         opacity: activeSlide === index ? 1 : 0.5,
         transition: 'all 0.3s ease',
         '&:hover': { opacity: 1, transform: 'scale(1.05)' },
         transform: activeSlide === index ? 'scale(1.1)' : 'scale(1)',
         boxShadow: activeSlide === index ? `0 0 15px #2dd4bf` : 'none',
         border: activeSlide === index ? '2px solid #2dd4bf' : '2px solid transparent',
         borderRadius: 1,
         overflow: 'hidden',
        }}
       >
        <CardMedia
         component="img"
         image={item.type === 'image' ? item.url : item.thumbnailUrl}
         alt={item.alt || item.title}
         sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
       </Box>
      ))}
     </Box>
     
     <Divider sx={{ my: 4, bgcolor: '#4b5563' }} />

     {/* --- Details Section --- */}
     <Grid container spacing={{ xs: 4, md: 6 }}>
      {/* Left Column: Description & Download Button */}
      <Grid item xs={12} md={7}>
       <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
        About this Game
       </Typography>
       <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7, color: '#d1d5db' }}>
        {game.description}
       </Typography>
       
       <Button
        variant="contained"
        fullWidth
        startIcon={<DownloadIcon />}
        href={game.directDownloadUrl || game.externalDownloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
         bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' },
         color: 'white', fontSize: '1.2rem', fontWeight: 'bold',
         py: 1.5, textTransform: 'none', borderRadius: 2
        }}
       >
        Download Now
       </Button>
      </Grid>
      
      {/* Right Column: Info */}
      <Grid item xs={12} md={5}>
       <Box sx={{ bgcolor: '#374151', p: 3, borderRadius: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{color: 'white', fontWeight: 'bold' }}>
         Game Details
        </Typography>
        <Divider sx={{mb: 2, bgcolor: '#4b5563'}}/>
        <Typography variant="body1" sx={{mb: 1}}><strong>Genre:</strong> {game.genre ? game.genre.name : 'N/A'}</Typography>
        <Typography variant="body1" sx={{mb: 1}}><strong>Release Date:</strong> {new Date(game.releaseDate).toLocaleDateString()}</Typography>
        <Typography variant="body1"><strong>File Size:</strong> {fileSize}</Typography>
       </Box>
      </Grid>
     </Grid>

     {/* --- Lower Sections --- */}
     {(game.features || game.systemRequirements) && <Divider sx={{ my: 4, bgcolor: '#4b5563' }} />}

     <Grid container spacing={{ xs: 4, md: 24 }}>
      {game.features && (
       <Grid item xs={12} md={8}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
         Features
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap', color: '#d1d5db', lineHeight: 1.8, 'ul, ol': { pl: 3 }, 'li': { mb: 1.5 } }}>
         {game.features}
        </Typography>
       </Grid>
      )}
      
      {game.systemRequirements && (
       <Grid 
        item 
        xs={12} 
        md={6}
        sx={{
            borderLeft: { xs: 'none', md: '1px solid #4b5563' },
            pl: { md: 24 }
        }}
       >
        <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
         System Requirements
         
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap', color: '#d1d5db', lineHeight: 1.8, 'ul, ol': { pl: 3 }, 'li': { mb: 1.5 } }}>
         {game.systemRequirements}
        </Typography>
       </Grid>
      )}
     </Grid>
    </Paper>
   </Box>
   <Box component="footer" sx={{ bgcolor: '#1f2937', py: 3, mt: 'auto', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
    <Typography variant="body2">
     © {new Date().getFullYear()} Potato Gaming. All rights reserved. For nostalgic purposes only.
    </Typography>
   </Box>
  </Box>
 );
};

export default GameDetailPage;