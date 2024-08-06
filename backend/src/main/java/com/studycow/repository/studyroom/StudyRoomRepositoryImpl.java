package com.studycow.repository.studyroom;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.querydsl.jpa.impl.JPAUpdateClause;
import com.studycow.domain.StudyRoom;
import com.studycow.domain.UserStudyRoomEnter;
import com.studycow.dto.calculate.RankRoomDto;
import com.studycow.dto.calculate.RankUserDto;
import com.studycow.dto.listoption.ListOptionDto;
import com.studycow.dto.studyroom.StudyRoomDto;
import com.studycow.dto.studyroom.StudyRoomRequestDto;
import com.studycow.service.file.FileService;
import com.studycow.util.QueryDslUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static com.studycow.domain.QStudyRoom.*;
import static com.studycow.domain.QUserStudyRoomCalculate.userStudyRoomCalculate;
import static com.studycow.domain.QUserStudyRoomEnter.userStudyRoomEnter;
import static com.studycow.domain.QUserStudyTimeCalculate.userStudyTimeCalculate;


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

        // 요청에 파일 있을 경우 클라우드에 업로드 후 링크 생성, 수정(동적 쿼리)
        if (requestDto.getRoomThumb() != null) {
            // 이전 사진 존재 확인
            String prevThumb = getStudyRoomInfo(studyRoomId).getRoomThumb();

            // 파일 업로드
            String fileLink = fileService.uploadFile(requestDto.getRoomThumb());

            // 썸네일 설정
            updateClause.set(studyRoom.roomThumb, fileLink);

            // 업로드 전에 있었다면 이전 이미지 삭제
            if(prevThumb != null && !prevThumb.isBlank()) {
                fileService.deleteFile(prevThumb);
            }
        }

        updateClause.where(studyRoom.id.eq(studyRoomId));
        updateClause.execute();
    }

    /**
     * 최근 입장한 스터디룸 목록 조회
     *
     * @param userId : 유저Id(로그인 유저)
     */
    @Override
    public List<StudyRoomDto> recentStudyRoom(int userId) throws PersistenceException {
        return queryFactory
                .select(Projections.constructor(StudyRoomDto.class,
                        userStudyRoomEnter.studyRoom.id,
                        userStudyRoomEnter.studyRoom.roomTitle,
                        userStudyRoomEnter.studyRoom.roomMaxPerson,
                        userStudyRoomEnter.studyRoom.roomNowPerson,
                        userStudyRoomEnter.studyRoom.roomCreateDate,
                        userStudyRoomEnter.studyRoom.roomEndDate,
                        userStudyRoomEnter.studyRoom.roomStatus,
                        userStudyRoomEnter.studyRoom.roomUpdateDate,
                        userStudyRoomEnter.studyRoom.roomContent,
                        userStudyRoomEnter.studyRoom.roomThumb,
                        userStudyRoomEnter.studyRoom.user.id))
                .from(userStudyRoomEnter)
                .where(userStudyRoomEnter.user.id.eq(userId))
                .groupBy(userStudyRoomEnter.studyRoom.id)
                .orderBy(userStudyRoomEnter.id.max().desc())
                .fetch();
    }

    /**
     * 날짜별 방 랭킹
     *
     * @param date : 조회 기준 날짜
     */
    @Override
    public List<RankRoomDto> rankStudyRoom(LocalDate date, Integer limit) throws PersistenceException {
        var rank = Expressions.numberTemplate(Integer.class,
                "rank() over (order by {0} desc)", userStudyRoomCalculate.sumRoomTime);

        return queryFactory
                .select(Projections.constructor(RankRoomDto.class,
                        rank,
                        userStudyRoomCalculate.studyRoom.id,
                        userStudyRoomCalculate.studyRoom.roomTitle,
                        userStudyRoomCalculate.procDate,
                        userStudyRoomCalculate.sumRoomTime))
                .from(userStudyRoomCalculate)
                .where(userStudyRoomCalculate.procDate.eq(hasDate(date))
                        .and(userStudyRoomCalculate.sumRoomTime.ne(0)))
                .orderBy(userStudyRoomCalculate.sumRoomTime.desc())
                .limit(hasLimit(limit))
                .fetch();
    }

    /**
     * 날짜별 유저 랭킹
     *
     * @param date : 조회 기준 날짜
     * @param limit : 순위 제한
     */
    @Override
    public List<RankUserDto> rankUser(LocalDate date, Integer limit) throws PersistenceException {
        var rank = Expressions.numberTemplate(Integer.class,
                "rank() over (order by {0} desc)", userStudyTimeCalculate.sumStudyTime);

        return queryFactory
                .select(Projections.constructor(RankUserDto.class,
                        rank,
                        userStudyTimeCalculate.user.id,
                        userStudyTimeCalculate.user.userNickname,
                        userStudyTimeCalculate.procDate,
                        userStudyTimeCalculate.sumStudyTime))
                .from(userStudyTimeCalculate)
                .where(userStudyTimeCalculate.procDate.eq(hasDate(date))
                        .and(userStudyTimeCalculate.sumStudyTime.ne(0)))
                .orderBy(userStudyTimeCalculate.sumStudyTime.desc())
                .limit(hasLimit(limit))
                .fetch();
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

    /**
     * 랭킹조회 동적 쿼리
     *
     * @param searchDate 검색날짜
     * @return BooleanExpression
     */
    private LocalDate hasDate(LocalDate searchDate) {
        return (searchDate != null)
                ? searchDate : LocalDateTime.now().minusHours(6).toLocalDate();
    }

    /**
     * 랭킹조회 동적 쿼리
     *
     * @param limit 랭킹제한
     * @return int
     */
    private int hasLimit(Integer limit) {
        return (limit != null && limit <= 0) ? limit : 10;
    }

}
