package com.potato.gaming.Potato_Gaming.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Genre {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

    private String name; // e.g., "Action-Adventure", "RPG", "FPS"

    @JsonIgnore // Avoid infinite recursion when fetching Games and Genres
    @OneToMany(mappedBy = "genre", cascade = CascadeType.ALL)
    private List<Game> games = new ArrayList<>();
}
