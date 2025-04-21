package com.potato.gaming.Potato_Gaming.controller;

import com.potato.gaming.Potato_Gaming.dto.ApiResponse;
import com.potato.gaming.Potato_Gaming.model.Game;
import com.potato.gaming.Potato_Gaming.model.Genre;
import com.potato.gaming.Potato_Gaming.service.GameService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api")
public class GamesController {

    private GameService gameService;

    public GamesController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/all/{page}")
    public ResponseEntity<Page<Game>> getAllProducts(@PathVariable("page") int page) {
        return new ResponseEntity<>(gameService.getAllGames(page), HttpStatus.ACCEPTED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(gameService.getGameById(id), HttpStatus.ACCEPTED);
    }

    @GetMapping("/genre/list")
    public ResponseEntity<List<Genre>> getAllGenres() {
        return new ResponseEntity<>(gameService.getAllGenres(), HttpStatus.ACCEPTED);
    } // List<Genre>>

    @GetMapping("/search")
    public ResponseEntity<List<Game>> searchGames(@RequestParam("query") String query) {

        return new ResponseEntity<>(gameService.searchGames(query), HttpStatus.ACCEPTED);
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createGame(@RequestBody Game gameData) {
        String msg = gameService.createGame(gameData);
        return new ResponseEntity<>(new ApiResponse(msg, true), HttpStatus.CREATED);
    }

    @PostMapping("/bulk/create")
    public ResponseEntity<ApiResponse> createGames(@RequestBody List<Game> gameData) {
        for(Game game : gameData) {
            gameService.createGame(game);
        }
        return new ResponseEntity<>(new ApiResponse("bulk update successful", true), HttpStatus.CREATED);
    }



}
