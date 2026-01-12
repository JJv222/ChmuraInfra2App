package com.SimpleNotatnik.services;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucketName;
    @Value("${minio.prefix}")
    private String prefix;

    public MinioService(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    // Upload file to MinIO bucket
    public String uploadFile(MultipartFile file, Long noteId) throws IOException {
        String filename = file.getOriginalFilename();
        String objectName = buildKey(noteId, filename);

        try (InputStream is = file.getInputStream()) {
            PutObjectArgs args = PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectName)
                    .stream(is, file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build();

            minioClient.putObject(args);
            return filename;
        } catch (Exception e) {
            throw new IOException("Failed to upload file to MinIO", e);
        }
    }

    // Download file from MinIO bucket
    public byte[] downloadFile(String fileName, final long id) throws IOException {
        String objectName = buildKey(id, fileName);
        try (InputStream is = minioClient.getObject(GetObjectArgs.builder()
                .bucket(bucketName)
                .object(objectName)
                .build())) {
            return is.readAllBytes();
        } catch (Exception e) {
            throw new IOException("Failed to download file from MinIO", e);
        }
    }

    private String buildKey(final Long noteId, final String filename) {
        return String.format("%s/%s/%s", prefix, noteId, filename);
    }
}
