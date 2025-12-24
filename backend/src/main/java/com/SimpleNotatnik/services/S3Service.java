package com.SimpleNotatnik.services;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class S3Service {

   private final AmazonS3 amazonS3;

   @Value("${aws.s3.bucket}")
   private String bucketName;
   @Value("${aws.s3.prefix}")
   private String prefix;

   public S3Service(AmazonS3 amazonS3) {
      this.amazonS3 = amazonS3;
   }

   // Upload file to S3 bucket
   public String uploadFile(MultipartFile file, Long noteId) throws IOException {
      String filename = String.format("%s/%s", noteId, file.getOriginalFilename());
      ObjectMetadata metadata = new ObjectMetadata();
      metadata.setContentLength(file.getSize());
      metadata.setContentType(file.getContentType());

      amazonS3.putObject(new PutObjectRequest(
         bucketName,
         filename,
         file.getInputStream(),
         metadata
      ));
      return file.getOriginalFilename();
   }


   // Download file from S3 bucket
   public S3Object downloadFile(String fileName, final long id) {
      return amazonS3.getObject(bucketName, buildKey(id, fileName));
   }


   private String buildKey(final Long noteId, final String filename) {
      return String.format("%s/%s/%s", prefix, noteId, filename);
   }
}
