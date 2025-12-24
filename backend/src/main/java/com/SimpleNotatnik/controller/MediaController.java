package com.SimpleNotatnik.controller;

import com.SimpleNotatnik.dto.MediaDto;
import com.SimpleNotatnik.model.Media;
import com.SimpleNotatnik.repository.MediaRepository;
import com.SimpleNotatnik.services.S3Service;
import com.amazonaws.services.s3.model.S3Object;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

   private final MediaRepository mediaRepository;
   private final S3Service s3;

   @GetMapping
   public List<MediaDto> getAllMedia() {
      return mediaRepository.findAll().stream()
         .map(this::toDto)
         .collect(Collectors.toList());
   }

   @PostMapping()
   public ResponseEntity<Long> uploadMedia(@RequestBody MediaDto request) {
      Media media = Media.builder()
         .title(request.getTitle())
         .description(request.getDescription())
         .creationDate(request.getCreationDate())
         .modifiedDate(request.getModifiedDate())
         .build();

      mediaRepository.save(media);
      return ResponseEntity.ok(media.getId());
   }

   @PostMapping(path = "photo/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
   public ResponseEntity<MediaDto> uploadMediaPhoto(@RequestPart("file") MultipartFile file, @PathVariable Long id) throws IOException {
      final Optional<Media> mediaOpt = mediaRepository.findById(id);
      if (mediaOpt.isEmpty()) {
         throw new IllegalArgumentException("There is no such Media element in database with id = " + id);
      }
      final Media media = mediaOpt.get();
      media.setFilename(s3.uploadFile(file, id));
      media.setContentType(file.getContentType());
      return ResponseEntity.ok(toDto(mediaRepository.save(media)));
   }

   @GetMapping("/{id}/download")
   public ResponseEntity<byte[]> downloadMedia(@PathVariable Long id) {
      return mediaRepository.findById(id)
         .map(m -> {
            S3Object picture = s3.downloadFile(m.getFilename(), id);
            try {
               return ResponseEntity.ok()
                  .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + (m.getFilename() == null ? "file" : m.getFilename()) + "\"")
                  .contentType(MediaType.parseMediaType(picture.getObjectMetadata()
                     .getContentType())
                  )
                  .body(picture.getObjectContent().readAllBytes());
            } catch (IOException e) {
               throw new RuntimeException(e);
            }
         })
         .orElse(ResponseEntity.notFound().build());
   }

   private MediaDto toDto(Media m) {
      return MediaDto.builder()
         .id(m.getId())
         .title(m.getTitle())
         .description(m.getDescription())
         .creationDate(m.getCreationDate())
         .modifiedDate(m.getModifiedDate())
         .filename(m.getFilename())
         .contentType(m.getContentType())
         .build();
   }
}
