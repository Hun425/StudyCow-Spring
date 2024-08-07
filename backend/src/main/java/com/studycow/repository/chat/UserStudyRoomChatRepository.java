package com.studycow.repository.chat;

import com.studycow.domain.UserStudyRoomChat;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * <pre>
 *     스터디룸 채팅방 관리 interface with Spring Data JPA
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@Repository
public interface UserStudyRoomChatRepository extends JpaRepository<UserStudyRoomChat, Long> {
    List<UserStudyRoomChat> findByStudyRoomIdOrderByChatInDateDesc(Long studyRoomId, Pageable pageable);

}
