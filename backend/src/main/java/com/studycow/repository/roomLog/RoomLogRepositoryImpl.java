package com.studycow.repository.roomLog;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.studycow.domain.*;
import com.studycow.dto.roomLog.StudyRoomLogDto;
import com.studycow.dto.roomLog.SessionRankDto;
import com.studycow.dto.roomLog.LogRequestDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static com.studycow.domain.QUserStudyRoomEnter.userStudyRoomEnter;

/**
 * <pre>
 *      방 내부활동 레포지토리 구현
 * </pre>
 * @author 노명환
 * @since JDK17
 */
@Repository
@RequiredArgsConstructor
public class RoomLogRepositoryImpl implements RoomLogRepository {

    @PersistenceContext
    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    /** 방 입장
     * <pre>
     *      방으로 입장을 시도한다.
     *      trigger : TRG_BEFORE_INSERT_IN_LOG
     * </pre>
     * @param roomId : 방 id
     * @param userId : 유저 id
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public StudyRoomLogDto enterRoom(Long roomId, int userId) throws PersistenceException {
        try {
            User user = em.find(User.class, userId);
            StudyRoom studyRoom = em.find(StudyRoom.class, roomId);

            UserStudyRoomEnter ure = new UserStudyRoomEnter(
                    null,
                    0,
                    LocalDateTime.now().minusHours(6).toLocalDate(),
                    LocalDateTime.now(),
                    null,
                    studyRoom,
                    user
            );

            em.persist(ure);
            em.flush();

            return new StudyRoomLogDto(
                    ure.getId(),
                    ure.getUser().getId(),
                    ure.getStudyRoom().getId(),
                    ure.getStudyDate(),
                    ure.getStudyTime(),
                    ure.getStudyTime(),
                    ure.getInDate(),
                    ure.getOutDate()
            );
        }catch(Exception e){
            throw new PersistenceException("방 입장 중 에러 발생", e);
        }
    }

    /** 방 퇴장
     * <pre>
     *      세션 id를 기반으로 방 퇴장 log를 최신화한다
     *      trigger : TRG_AFTER_UPDATE_IN_LOG
     * </pre>
     * @param logRequestDto : 세션 id, 공부시간
     * @param userId : 유저 id
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public StudyRoomLogDto exitRoom(LogRequestDto logRequestDto, int userId) throws PersistenceException {
        try {
            UserStudyRoomEnter ure = em.find(UserStudyRoomEnter.class,
                    logRequestDto.getLogId());

            if(ure != null) {
                if (ure.getUser().getId() != userId) {
                    throw new IllegalStateException("세션ID의 사용자가 일치하지 않습니다.");
                }

                Integer studyTime = logRequestDto.getStudyTime();

                queryFactory
                        .update(userStudyRoomEnter)
                        .set(userStudyRoomEnter.outDate, LocalDateTime.now())
                        .set(userStudyRoomEnter.studyTime, studyTime)
                        .where(userStudyRoomEnter.id.eq(ure.getId()))
                        .execute();
                em.flush();
                em.refresh(ure);

                return new StudyRoomLogDto(
                        ure.getId(),
                        ure.getUser().getId(),
                        ure.getStudyRoom().getId(),
                        ure.getStudyDate(),
                        ure.getStudyTime(),
                        ure.getStudyTime(),
                        ure.getInDate(),
                        ure.getOutDate()
                );
            }else{
                throw new EntityNotFoundException("잘못된 세션 ID입니다.");
            }
        }catch(Exception e){
            throw new PersistenceException("방 퇴장 중 에러 발생", e);
        }
    }

    /** 입장한 방의 금일 공부시간 조회
     * <pre>
     *      입장하려는 방의 금일 공부시간을 조회한다.
     * </pre>
     * @param userId : 유저 id
     * @param roomId : 방 id
     * @param studyDate : 금일(06시 기준)
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public Integer roomStudyTime(int userId, Long roomId, LocalDate studyDate) throws PersistenceException {
        return queryFactory
                .select(userStudyRoomEnter.studyTime.sum())
                .from(userStudyRoomEnter)
                .where(userStudyRoomEnter.user.id.eq(userId)
                        .and(userStudyRoomEnter.studyRoom.id.eq(roomId))
                        .and(userStudyRoomEnter.studyDate.eq(studyDate)))
                .fetchOne();
    }

    /** 공부시간 갱신
     * <pre>
     *      세션 id를 기반으로 공부시간을 갱신한다
     * </pre>
     * @param logRequestDto : 세션 id, 공부시간
     * @param userId : 유저 id
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public StudyRoomLogDto modifyStudyTime(LogRequestDto logRequestDto, int userId) throws PersistenceException {
        try {
            UserStudyRoomEnter ure = em.find(UserStudyRoomEnter.class,
                    logRequestDto.getLogId());

            if(ure != null) {
                if (ure.getUser().getId() != userId) {
                    throw new IllegalStateException("세션ID의 사용자가 일치하지 않습니다.");
                }
                Integer studyTime = logRequestDto.getStudyTime();

                queryFactory
                        .update(userStudyRoomEnter)
                        .set(userStudyRoomEnter.studyTime, studyTime)
                        .where(userStudyRoomEnter.id.eq(ure.getId()))
                        .execute();

                em.refresh(ure);

                return new StudyRoomLogDto(
                        ure.getId(),
                        ure.getUser().getId(),
                        ure.getStudyRoom().getId(),
                        ure.getStudyDate(),
                        ure.getStudyTime(),
                        0,
                        ure.getInDate(),
                        ure.getOutDate()
                );
            }else{
                throw new EntityNotFoundException("잘못된 세션 ID입니다.");
            }
        }catch(Exception e){
            throw new PersistenceException("시간 갱신 중 에러 발생", e);
        }
    }

    /**
     * 현재 방의 랭크 조회
     *
     * @param roomId : 방 id
     * @param studyDate : 공부 날짜
     */
    @Override
    public List<SessionRankDto> roomRank(Long roomId, LocalDate studyDate) throws PersistenceException {
        return queryFactory
                .select(Projections.constructor(SessionRankDto.class,
                        Expressions.template(Integer.class,
                                "rank() over (order by {0} desc)"
                                ,userStudyRoomEnter.studyTime.sum()),
                        userStudyRoomEnter.user.id,
                        userStudyRoomEnter.user.userNickname,
                        userStudyRoomEnter.studyTime.sum()))
                .from(userStudyRoomEnter)
                .where(userStudyRoomEnter.studyRoom.id.eq(roomId)
                        .and(userStudyRoomEnter.studyDate.eq(studyDate)))
                .groupBy(userStudyRoomEnter.user.id)
                .fetch();
    }
}
