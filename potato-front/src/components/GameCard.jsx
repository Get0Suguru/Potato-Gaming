import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Button } from '@mui/material';

const GameCard = ({ game }) => {
    return (
        <Card
            component={Link}
            to={`/games/${game.id}`}
            sx={{
                bgcolor: '#1f2937',
                color: 'white',
                borderRadius: 2,
                boxShadow: 3,
                overflow: 'hidden',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.05)',
                },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
            }}
        >
            <CardMedia
                component="img"
                height="192"
                image={game.coverImageUrl}
                alt={game.title}
                sx={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography gutterBottom variant="h6" component="div" sx={{
                    color: '#2dd4bf', fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    '-webkit-line-clamp': '2',
                    '-webkit-box-orient': 'vertical',
                    minHeight: '2.5em'
                }}>
                    {game.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: '#9ca3af', mb: 2 }}>
                    {game.publisher}
                </Typography>
                <Box sx={{ mt: 'auto' }}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            bgcolor: '#2563eb',
                            '&:hover': { bgcolor: '#1e40af' },
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            py: 1
                        }}
                    >
                        View Details
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default GameCard; 