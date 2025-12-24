package com.SimpleNotatnik.controller;

import com.SimpleNotatnik.dto.NoteDto;
import com.SimpleNotatnik.model.Note;
import com.SimpleNotatnik.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteRepository noteRepository;

    @GetMapping
    public List<NoteDto> getAllNotes() {
        return noteRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<NoteDto> createNote(@RequestBody NoteDto dto) {
        Note note = Note.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .build();

        Note saved = noteRepository.save(note);
        return ResponseEntity.ok(toDto(saved));
    }

    private NoteDto toDto(Note n) {
        return NoteDto.builder()
                .id(n.getId())
                .title(n.getTitle())
                .description(n.getDescription())
                .creationDate(n.getCreationDate())
                .modifiedDate(n.getModifiedDate())
                .build();
    }
}

