package com.potato.gaming.Potato_Gaming.repo;

import com.potato.gaming.Potato_Gaming.model.Game;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GameRepo extends JpaRepository<Game, Long> {

    @Query("SELECT g FROM Game g WHERE lower(g.title)  LIKE lower(concat('%', :query, '%') ) or " +
            "lower(g.publisher) LIKE lower(concat('%', :query, '%') ) or " +
            "lower(g.title) like lower(concat('%', :query, '%') ) or " +
            "(g.genre is not null and lower(g.genre.name) like lower(concat('%', :query, '%')))"  )
    Page<Game> searchGames(
            @Param("query") String query, Pageable pageable
    );
}
