package com.potato.gaming.Potato_Gaming.service;


import com.potato.gaming.Potato_Gaming.model.Game;
import com.potato.gaming.Potato_Gaming.model.Genre;
import com.potato.gaming.Potato_Gaming.repo.GameRepo;
import com.potato.gaming.Potato_Gaming.repo.GenreRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {

    private GameRepo gameRepo;
    private GenreRepo genreRepo;

    public GameService(GameRepo gameRepo, GenreRepo genreRepo) {
        this.gameRepo = gameRepo;
        this.genreRepo = genreRepo;
    }

    public String createGame(Game gameData) {

        Genre newGameGenre = gameData.getGenre();

        Genre existingGenre = genreRepo.findByName(newGameGenre.getName());
        if (existingGenre == null) {
            existingGenre = genreRepo.save(newGameGenre);
        }

        gameData.setGenre(existingGenre);


        gameRepo.save(gameData);
        return "Game created successfully";
    }

    public Page<Game> getAllGames(int page) {

        Pageable pageable = PageRequest.of(page, 12);

        return gameRepo.findAll(pageable);
    }

    public Game getGameById(Long id) {
        return gameRepo.findById(id).get();
    }

    public List<Genre> getAllGenres() {

        return genreRepo.findAll();
    }

    public List<Game> searchGames(String query) {

        Pageable pageable = PageRequest.of(0, 4);
        return gameRepo.searchGames(query, pageable).getContent();
    }
}
