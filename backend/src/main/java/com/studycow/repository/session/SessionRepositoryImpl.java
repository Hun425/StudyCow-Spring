package com.studycow.repository.session;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.studycow.domain.*;
import com.studycow.dto.session.SessionDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

import static com.studycow.domain.QUserStudyRoomEnter.userStudyRoomEnter;

/**
 * <pre>
 *      방 세션 관련 레포지토리 구현
 * </pre>
 * @author 노명환
 * @since JDK17
 */
@Repository
@RequiredArgsConstructor
public class SessionRepositoryImpl implements SessionRepository{

    @PersistenceContext
    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    /** 방 입장
     * <pre>
     *      방으로 입장을 시도한다.
     *      trigger : TRG_BEFORE_INSERT_IN_LOG
     * </pre>
     * @param enterMap : 방 입장시 유저 id, 방 id
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public SessionDto enterRoom(Map<String, Object> enterMap) throws PersistenceException {
        try {
            User user = em.find(User.class, (Integer)enterMap.get("userId"));
            StudyRoom studyRoom = em.find(StudyRoom.class,
                    Long.parseLong((String)enterMap.get("roomId")));

            UserStudyRoomEnter ure = new UserStudyRoomEnter(
                    null,
                    0,
                    LocalDate.now(),
                    LocalDateTime.now(),
                    null,
                    studyRoom,
                    user
            );

            em.persist(ure);
            em.flush();

            return new SessionDto(
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
     * @param enterMap : 방 퇴장 시 세션 id
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public SessionDto exitRoom(Map<String, Object> enterMap, int userId) throws PersistenceException {
        try {
            UserStudyRoomEnter ure = em.find(UserStudyRoomEnter.class,
                    Long.parseLong((String)enterMap.get("sessionId")));

            if(ure != null) {
                if (ure.getUser().getId() != userId) {
                    throw new IllegalStateException("세션ID의 사용자가 일치하지 않습니다.");
                }

                Integer studyTime = (Integer) enterMap.get("studyTime");

                queryFactory
                        .update(userStudyRoomEnter)
                        .set(userStudyRoomEnter.outDate, LocalDateTime.now())
                        .set(userStudyRoomEnter.studyTime, studyTime)
                        .where(userStudyRoomEnter.id.eq(ure.getId()))
                        .execute();
                em.flush();
                em.refresh(ure);

                return new SessionDto(
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
     * @param enterMap : 갱신할 세션 id
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public void modifyStudyTime(Map<String, Object> enterMap, int userId) throws PersistenceException {
        try {
            UserStudyRoomEnter ure = em.find(UserStudyRoomEnter.class,
                    Long.parseLong((String)enterMap.get("sessionId")));

            if(ure != null) {
                if (ure.getUser().getId() != userId) {
                    throw new IllegalStateException("세션ID의 사용자가 일치하지 않습니다.");
                }
                Integer studyTime = (Integer) enterMap.get("studyTime");

                queryFactory
                        .update(userStudyRoomEnter)
                        .set(userStudyRoomEnter.studyTime, studyTime)
                        .where(userStudyRoomEnter.id.eq(ure.getId()))
                        .execute();
            }else{
                throw new EntityNotFoundException("잘못된 세션 ID입니다.");
            }
        }catch(Exception e){
            throw new PersistenceException("시간 갱신 중 에러 발생", e);
        }
    }
}
