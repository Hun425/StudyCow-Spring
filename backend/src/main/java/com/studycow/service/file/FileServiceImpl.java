package com.studycow.service.file;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.studycow.exception.CustomException;
import com.studycow.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

/**
 * <pre>
 *  GCS 파일 관리 서비스 구현 클래스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17
 */
@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final Storage storage;

    @Value("${spring.cloud.gcp.storage.bucket}") // application.properties에 써둔 bucket 이름
    private String bucketName;

    /**
     * 파일 업로드
     *
     * @param file 업로드할 파일
     * @return String GCS 파일 링크
     * @throws IOException
     */
    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        if (file == null) {
            throw new CustomException(ErrorCode.NO_FILE);
        }

        String uuid = UUID.randomUUID().toString(); // Google Cloud Storage에 저장될 파일 이름
        String contentType = file.getContentType(); // 파일의 형식 ex) JPG

        // Cloud에 파일 업로드
        BlobInfo blobInfo = storage.create(
                BlobInfo.newBuilder(bucketName, uuid)
                        .setContentType(contentType)
                        .build(),
                file.getInputStream()
        );

        // Cloud 링크
        String fileLink = "https://storage.googleapis.com/studycow-bucket/" + uuid;

        return fileLink;
    }

    /**
     * 파일 삭제
     *
     * @param fileLink 파일링크
     * @throws RuntimeException
     */
    public void deleteFile(String fileLink) throws RuntimeException {
        // 링크에서 파일 이름 추출
        String fileName = extractFileNameFromLink(fileLink);

        Blob blob = storage.get(bucketName, fileName);

        // 파일 삭제
        if (!fileLink.isBlank() && fileName != null && blob != null) {
            Storage.BlobSourceOption precondition =
                    Storage.BlobSourceOption.generationMatch(blob.getGeneration());

            storage.delete(bucketName, fileName, precondition);
        } else {
            throw new CustomException(ErrorCode.INVALID_FILE_LINK);
        }
    }

    /**
     * 파일 링크에서 uuid로 된 파일명 추출
     * @param fileLink 파일 링크
     * @return String 파일명
     */
    private String extractFileNameFromLink(String fileLink) {
        // https://storage.googleapis.com/studycow_bucket/fileName.jpg
        // '/'를 delimiter로 나누기
        String[] parts = fileLink.split("/");

        // Bucket name 다음의 파일 이름
        return parts.length > 4 ? parts[4] : null;
    }

}
