package com.studycow.repository.chat;

import com.studycow.domain.UserStudyRoomChat;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserStudyRoomChatRepository extends JpaRepository<UserStudyRoomChat, Long> {
    List<UserStudyRoomChat> findByStudyRoomIdOrderByChatInDateDesc(Long studyRoomId, Pageable pageable);

}
