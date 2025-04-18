package com.potato.gaming.Potato_Gaming.repo;

import com.potato.gaming.Potato_Gaming.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GenreRepo extends JpaRepository<Genre, Long> {

    public Genre findByName(String name);
}
