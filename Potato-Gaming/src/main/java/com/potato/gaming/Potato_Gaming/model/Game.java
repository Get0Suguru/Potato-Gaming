package com.potato.gaming.Potato_Gaming.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String features;

    private String publisher;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String coverImageUrl;


    @ElementCollection
    @CollectionTable(name = "game_screenshots", joinColumns = @JoinColumn(name = "game_id"))
    @Column(name = "image_url")
    @Lob
    private List<String> screenshotUrls;

    private String trailerVideoUrl;

    private String directDownloadUrl;
    private String externalDownloadUrl;

    private Long fileSize;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String systemRequirements;

    @ManyToOne()
    @JoinColumn(name = "genre_id")
    private Genre genre;

    private LocalDate releaseDate;
}
