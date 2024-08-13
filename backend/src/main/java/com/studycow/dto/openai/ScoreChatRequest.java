package com.studycow.dto.openai;

import com.studycow.dto.score.ResponseScoreDto;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * 성적 관련 조언생성 prompt
 * @author 노명환
 * @since JDK17
 */
@Data
public class ScoreChatRequest {
    private String model;
    private List<Message> messages;

    public ScoreChatRequest(String model, String prompt) {
        this.model = model;
        this.messages =  new ArrayList<>();
        this.messages.add(new Message("user",
            "당신에게 ResponseScoreDto 객체를 넘기겠습니다. 이 객체를 분석하여 조언 및 격려의 답변을 주세요.\n" +
                    prompt +
                    "ResponseScoreDto는 한 유저의 특정 과목 성적 데이터를 담고 있습니다. 각 필드의 설명은 다음과 같습니다:\n" +
                    "1. subName: 시험을 본 과목의 이름입니다.\n" +
                    "2. targetScore: 해당 과목의 목표 점수입니다. null일 경우에는 maxScore와 동일한 값을 가집니다. \n" +
                    "3. targetGrade: 해당 과목의 목표 등급입니다. null일 경우에는 1을 가집니다. \n" +
                    "4. maxScore: 해당 과목의 최대 점수입니다.\n" +
                    "5. diffScore: 가장 최근의 성적과 그 다음 성적의 차이입니다. 수가 높을수록 성적이 향상되었음을 나타내고, 수가 낮을수록 성적이 하락했음을 나타냅니다. null일 경우에는 성적 데이터가 1개 이하라는 의미입니다. " +
                    "6. scores: 해당 과목의 성적 데이터 리스트입니다.\n" +
                    "scores 필드의 각 항목은 다음과 같은 정보를 포함합니다:\n" +
                    "1. testDate: 시험을 본 날짜입니다. scores는 날짜의 내림차순으로 정렬됩니다.\n" +
                    "2. testScore: 시험 점수입니다. 0점에서 maxScore 사이의 값입니다.\n" +
                    "3. testGrade: 시험 등급입니다. 1에서 9 사이의 정수로, 낮을수록 높은 등급입니다.\n" +
                    "4. scoreDetails: 해당 시험의 상세 내역입니다.\n" +
                    "scoreDetails 필드의 각 항목은 다음과 같은 정보를 포함합니다:\n" +
                    "1. scoreId: score를 구분하는 ID입니다.\n" +
                    "2. catName: 틀린 문제의 유형 이름입니다.\n" +
                    "3. wrongCnt: 해당 유형에서 틀린 문제의 갯수입니다.\n" +
                    "답변 규칙:\n" +
                    "1. ResponseScoreDto를 분석한 후에 답변을 작성하세요. 답변은 50자 이내로 작성해야 합니다.\n" +
                    "2. 답변은 조언 및 격려를 포함해야 합니다.\n" +
                    "3. 조언은 scoreDetails의 분석 결과를 바탕으로 간략히 작성하세요. 예를 들어, 같은 유형의 문제를 오랜 기간 자주 틀린 경우 해당 유형을 더 공부하라는 조언을 해주세요.\n" +
                    "4. 복습에 대해 이야기 할 때에는 특정 유형을 정확히 명시해야합니다. 예를 들어, '최근 수학1 유형을 자주 틀리고 있으니 복습하는 것이 좋겠습니다.'와 같이 작성하세요.\n" +
                    "5. subName과 catName을 혼동하지 마세요. 두 값이 비슷하더라도 엄연히 다른 데이터입니다. subName은 과목, catName은 유형 입니다. \n" +
                    "6. scoreDetails 필드는 비어있을 수도 있습니다. 해당 필드가 많이 비어있는 경우, 오답유형을 입력하라는 조언을 해주세요. \n" +
                    "7. 사용자에게 답변을 할 때에는 필드 명을 절대로 얘기하지 마세요. scoreDetails 필드의 경우 '상세 내역'이라고 치환해야합니다. \n" +
                    "8. testDate, testScore, diffScore에 집중하여 최근 시험 성적에 대해 조언하세요. 과거의 시험 내역은 성적 동향 파악 및 오답 유형 파악용입니다. \n" +
                    "9. diffScore가 null이 아닐 경우, 해당 수치에 맞도록 조언을 해주세요. 양수의 경우 칭찬을, 음수의 경우에는 공부 조언을 해주세요. \n" +
                    "\n" +
                    "위 규칙을 지키고 ResponseScoreDto 객체를 분석하여 답변해 주세요."));
    }
}
