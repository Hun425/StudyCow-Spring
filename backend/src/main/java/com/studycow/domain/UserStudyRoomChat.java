package com.studycow.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "t_chat_log")
public class UserStudyRoomChat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CHAT_ID")
    private Long id;

    @Column(name = "CHAT_CONTENT", length = 1000)
    @NotNull
    private String chatContent;

    @Column(name = "CHAT_IN_DATE")
    @NotNull
    private String chatInDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID")
    @NotNull
    private User user; //외래키

    @ManyToOne
    @JoinColumn(name = "ROOM_ID")
    @NotNull
    private StudyRoom studyRoom; //외래키
}