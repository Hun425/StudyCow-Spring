package com.studycow.web.openai;

import com.studycow.dto.openai.ChatGPTRequest;
import com.studycow.dto.openai.ChatGPTResponse;
import com.studycow.dto.openai.PlannerChatRequest;
import com.studycow.dto.openai.ScoreChatRequest;
import com.studycow.dto.score.ResponseScoreDto;
import com.studycow.dto.score.ScoreDto;
import com.studycow.dto.target.ScoreTargetDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.service.score.ScoreService;
import com.studycow.service.target.TargetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private final TargetService targetService;

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

    @Operation(
            summary = "성적 조언 생성",
            description = "chatGPT를 이용하여 불러온 성적에 대한 조언 생성. 오남용 금지")
    @PostMapping("/advice-score")
    public ResponseEntity<?> scoreAdvice(
            @RequestBody @Valid ResponseScoreDto responseScoreDto) {
        try {
            ScoreChatRequest request = new ScoreChatRequest(model, responseScoreDto.toString());
            ChatGPTResponse chatGPTResponse = template.postForObject(apiURL, request, ChatGPTResponse.class);

            Map<String, String> advice = new HashMap<>();
            advice.put("advice", chatGPTResponse.getChoices().get(0).getMessage().getContent());
            //responseScoreDto.setAdvice(chatGPTResponse.getChoices().get(0).getMessage().getContent());

            return ResponseEntity.ok(advice);
        }catch (Exception e){
            return new ResponseEntity<>("성적 조언생성 실패 : " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @Operation(
            summary = "플래너 자동 생성",
            description = "chatGPT를 이용하여 플래너 5일치 자동 생성. 오남용 금지. <br>" +
                    "{ startDay(시작일): String(YYYY-MM-DD), studyTime(하루 공부시간): int(분) }")
    @GetMapping("/auto-planner")
    public ResponseEntity<?> plannerAutomation(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("startDay") String startDay,
            @RequestParam("studyTime") int studyTime
    ) {
        try {
            int userId = userDetails.getUser().getUserId();

            List<ScoreDto> recentScores = scoreService.recentUserScore(userId);
            List<ScoreTargetDto> scoreTargets = targetService.targetList(userId, userId);

            PlannerChatRequest request = new PlannerChatRequest(model, recentScores, scoreTargets, startDay, studyTime);
            ChatGPTResponse chatGPTResponse = template.postForObject(apiURL, request, ChatGPTResponse.class);
            String response = chatGPTResponse.getChoices().get(0).getMessage().getContent();

            // JSON 마크다운 제거
            if (response.startsWith("```json") && response.endsWith("```")) {
                // 마크다운을 제거하기 위해 처음과 끝의 부분을 잘라냅니다.
                response = response.substring(7, response.length() - 3).trim();
            }

            return ResponseEntity.ok(response);
        } catch(Exception e)  {
            return new ResponseEntity<>("플래너 자동생성 실패 : " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
