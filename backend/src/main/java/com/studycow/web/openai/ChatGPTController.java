package com.studycow.web.openai;

import com.studycow.dto.openai.ChatGPTRequest;
import com.studycow.dto.openai.ChatGPTResponse;
import com.studycow.dto.openai.PlannerChatRequest;
import com.studycow.dto.openai.ScoreChatRequest;
import com.studycow.dto.score.ResponseScoreDto;
import com.studycow.dto.score.ScoreDto;
import com.studycow.service.score.ScoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

/**
 * <pre>
 *     OpenAI 컨트롤러 클래스
 * </pre>
 * @author 노명환
 * @since JDK17
 */

@Tag(name = "OpenAI", description = "ChatGPT 답변")
@RestController
@RequestMapping("/openai")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ChatGPTController {
    private final ScoreService scoreService;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.api.url}")
    private String apiURL;

    @Autowired
    private RestTemplate template;

    @Operation(summary = "기본 챗봇", description = "chatGPT에게 질문할 수 있습니다. 오남용 금지")
    @GetMapping("/chat")
    public String chat(@RequestParam(name = "prompt")String prompt) {
        ChatGPTRequest request = new ChatGPTRequest(model, prompt);
        ChatGPTResponse chatGPTResponse =  template.postForObject(apiURL, request, ChatGPTResponse.class);
        return chatGPTResponse.getChoices().get(0).getMessage().getContent();
    }

    public String scoreAdvice(ResponseScoreDto responseScoreDto) {
        ScoreChatRequest request = new ScoreChatRequest(model, responseScoreDto.toString());
        ChatGPTResponse chatGPTResponse =  template.postForObject(apiURL, request, ChatGPTResponse.class);
        return chatGPTResponse.getChoices().get(0).getMessage().getContent();
    }


    @Operation(summary = "플래너 자동화", description = "chatGPT를 이용하여 플래너 자동 생성. 오남용 금지")
    @GetMapping("/auto-planner/{userId}")
    public ResponseEntity<?> plannerAdvice(@PathVariable("userId") int userId) {
        try {
            List<ScoreDto> recentScores = scoreService.recentUserScore(userId);
            PlannerChatRequest request = new PlannerChatRequest(model, recentScores);
            ChatGPTResponse chatGPTResponse = template.postForObject(apiURL, request, ChatGPTResponse.class);
            return ResponseEntity.ok(chatGPTResponse.getChoices().get(0).getMessage().getContent());
//            return new ResponseEntity<>("OK", HttpStatus.OK);
        } catch(Exception e)  {
            return new ResponseEntity<>("플래너 자동생성 실패", HttpStatus.BAD_REQUEST);
        }
    }

}
