package com.studycow.file;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.studycow.service.file.FileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * 파일 관리 테스트 클래스
 *
 * @author 박봉균
 * @since JDK17(Eclipse Temurin)
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class FileControllerTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private FileService fileService;

    @MockBean
    private Storage storage;

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    /**
     * 파일 업로드 테스트
     *
     * @throws Exception
     */
    @Test
    public void testUploadFile() throws Exception {
        /* --- GIVEN --- */
        String fileName = "test.txt";
        String contentType = "text/plain";
        byte[] content = "test content".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", fileName, contentType, content);

        // Storage 모의 객체 설정
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, "test-uuid").setContentType(contentType).build();
        Blob blob = mock(Blob.class);
        when(storage.create(any(BlobInfo.class), any(InputStream.class))).thenReturn(blob);
        when(blob.getName()).thenReturn("test-uuid");

        /* --- WHEN & THEN --- */
        mockMvc.perform(multipart("/file/upload").file(file))
                .andExpect(status().isOk());
        // 파일 업로드 메서드가 호출되었는지 확인
        verify(storage, times(1)).create(any(BlobInfo.class), any(InputStream.class));
    }

    /**
     * 파일 삭제 테스트
     *
     * @throws Exception
     */
    @Test
    public void testDeleteFile() throws Exception {
        /* --- GIVEN --- */
        String fileLink = "https://storage.googleapis.com/studycow-bucket/test-uuid";
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("fileLink", fileLink);

        // Storage 모의 객체 설정
        Blob blob = mock(Blob.class);
        when(storage.get(bucketName, "test-uuid")).thenReturn(blob);
        when(blob.getGeneration()).thenReturn(1L);

        /* --- WHEN & THEN --- */
        mockMvc.perform(delete("/file/delete")
                        .contentType("application/json")
                        .content("{\"fileLink\": \"" + fileLink + "\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("파일 삭제 성공"));

        // 파일 삭제 메서드가 호출되었는지 확인
        verify(storage, times(1)).delete(eq(bucketName), eq("test-uuid"), any(Storage.BlobSourceOption.class));
    }


    /**
     * 파일 없이 업로드 요청 예외 테스트
     *
     * @throws Exception
     */
    @Test
    public void testUploadFileWithNoFile() throws Exception {
        /* --- GIVEN --- */
        // 파일을 제공하지 않음

        /* --- WHEN & THEN --- */
        mockMvc.perform(multipart("/file/upload"))
                .andExpect(status().isNotFound());
        // 파일 업로드 메서드가 호출되지 않았는지 확인
        verify(storage, never()).create(any(BlobInfo.class), any(byte[].class));
    }

    /**
     * 잘못된 링크로 파일 삭제 요청 예외 테스트
     *
     * @throws Exception
     */
    @Test
    public void testDeleteFileWithInvalidLink() throws Exception {
        /* --- GIVEN --- */
        String InvalidLink = "invalid-link";

        // Storage 모의 객체 설정
        when(storage.get(bucketName, "invalid-link")).thenReturn(null);

        /* --- WHEN & THEN --- */
        mockMvc.perform(delete("/file/delete")
                        .contentType("application/json")
                        .content("{ 'fileLink' : 'invalid-link' }"))
                .andExpect(status().isBadRequest());

        // 파일 삭제 메서드가 호출되지 않았는지 확인
        verify(storage, never()).delete(anyString(), anyString(), any(Storage.BlobSourceOption.class));
    }

}
