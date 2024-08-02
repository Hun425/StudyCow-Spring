package com.studycow.repository.studyroom;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.jpa.impl.JPAUpdateClause;
import com.studycow.domain.StudyRoom;
import com.studycow.dto.listoption.ListOptionDto;
import com.studycow.dto.studyroom.StudyRoomDto;
import com.studycow.dto.studyroom.StudyRoomRequestDto;
import com.studycow.service.file.FileService;
import com.studycow.util.QueryDslUtil;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.studycow.domain.QStudyRoom.*;


/**
 * <pre>
 *      스터디룸 CRUD 레포지토리 구현 클래스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17
 */
@Repository
@RequiredArgsConstructor
public class StudyRoomRepositoryImpl implements StudyRoomRepository {

    @PersistenceContext
    private final EntityManager em;
    private final JPAQueryFactory queryFactory;
    private final FileService fileService;

    //Redis
    private final RedisTemplate<String, Object> redisTemplate;
    //채팅방을 위한 레디스 설정
    private final RedisMessageListenerContainer redisMessageListenerContainer;
    private HashOperations<String, String, StudyRoom> hashOperations;
    //채팅방 대화 메시지 발행을 위한 redis topic 정보, 서버별로 채팅방에 매치되는 topic 정보를 Map에 넣어 roomId로 찾을 수 있도록 함.
    private Map<String, ChannelTopic> topics;

    private static final String CHAT_ROOMS = "CHAT_ROOM";

    @PostConstruct
    private void init() {
        hashOperations = redisTemplate.opsForHash();
        topics = new HashMap<>();
    }

    public StudyRoom findById(String id) {
        return hashOperations.get(CHAT_ROOMS, id);
    }

    public ChannelTopic getTopic(String roomId){
        return topics.get(roomId);
    }

    /**
     * 스터디룸 생성
     *
     * @param studyRoom 스터디룸 엔터티
     */
    @Override
    public void createStudyRoom(StudyRoom studyRoom) throws PersistenceException {
        em.persist(studyRoom);

    }

    /**
     * 스터디룸 상세 조회
     *
     * @param studyRoomId 스터디룸 고유 번호
     * @return StudyRoomDto
     * @throws PersistenceException
     */
    @Override
    public StudyRoomDto getStudyRoomInfo(Long studyRoomId) throws PersistenceException {
        return queryFactory
                .select(Projections.constructor(StudyRoomDto.class,
                        studyRoom.id,
                        studyRoom.roomTitle,
                        studyRoom.roomMaxPerson,
                        studyRoom.roomNowPerson,
                        studyRoom.roomCreateDate,
                        studyRoom.roomEndDate,
                        studyRoom.roomStatus,
                        studyRoom.roomUpdateDate,
                        studyRoom.roomContent,
                        studyRoom.roomThumb,
                        studyRoom.user.id
                ))
                .from(studyRoom)
                .where(studyRoom.id.eq(studyRoomId))
                .fetchOne();
    }

    /**
     * 스터디룸 목록 조회
     * <pre>
     *     검색어가 존재할 경우, roomTitle로 검색한다.
     *     정렬 조건이 있을 경우, 그에 따라 정렬한다.
     *     기본 정렬 전략은 studyRoom.id 기준 Order.ASC이다.
     * </pre>
     *
     * @param option 검색/정렬 조건
     * @throws PersistenceException
     */
    @Override
    public List<StudyRoomDto> listStudyRoom(ListOptionDto option) throws PersistenceException {
        return queryFactory
                .select(Projections.constructor(StudyRoomDto.class,
                        studyRoom.id,
                        studyRoom.roomTitle,
                        studyRoom.roomMaxPerson,
                        studyRoom.roomNowPerson,
                        studyRoom.roomCreateDate,
                        studyRoom.roomEndDate,
                        studyRoom.roomStatus,
                        studyRoom.roomUpdateDate,
                        studyRoom.roomContent,
                        studyRoom.roomThumb,
                        studyRoom.user.id
                ))
                .from(studyRoom)
                .where(containsName(option.getSearchText()))
                .orderBy(QueryDslUtil.createOrderSpecifier(option, studyRoom, studyRoom, "id"))
                .fetch();
    }

    /**
     * 스터디룸 수정
     *
     * @param studyRoomId 스터디룸 고유번호
     * @param requestDto  수정 정보를 담은 DTO
     * @param userId      요청 회원 고유번호
     * @throws PersistenceException
     */
    @Override
    public void updateStudyRoom(Long studyRoomId, StudyRoomRequestDto requestDto, int userId) throws PersistenceException, IOException {
        StudyRoom studyRoomFound = em.find(StudyRoom.class, studyRoomId);

        if (studyRoomFound.getUser().getId() != userId) {
            throw new IllegalStateException("방장만 수정할 수 있습니다.");
        }

        JPAUpdateClause updateClause = queryFactory
                .update(studyRoom)
                .set(studyRoom.roomTitle, requestDto.getRoomTitle())
                .set(studyRoom.roomMaxPerson, requestDto.getRoomMaxPerson())
                .set(studyRoom.roomEndDate, requestDto.getRoomEndDate())
                .set(studyRoom.roomStatus, requestDto.getRoomStatus())
                .set(studyRoom.roomContent, requestDto.getRoomContent());

        // 요청에 파일 있을 경우 클라우드에 업로드 후 링크 생성, 수정
        if (requestDto.getRoomThumb() != null) {
            String fileLink = fileService.uploadFile(requestDto.getRoomThumb());
            updateClause.set(studyRoom.roomThumb, fileLink);
        }

        updateClause.where(studyRoom.id.eq(studyRoomId));
        updateClause.execute();
    }

    /**
     * 스터디룸명 검색 동적 쿼리
     *
     * @param searchText 검색어
     * @return BooleanExpression
     */
    private BooleanExpression containsName(String searchText) {
        return (searchText != null && !searchText.isBlank())
                ? studyRoom.roomTitle.contains(searchText) : null;
    }

}
