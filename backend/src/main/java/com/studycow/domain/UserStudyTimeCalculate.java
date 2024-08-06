package com.studycow.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "t_proc_user_study", uniqueConstraints =
@UniqueConstraint(name = "UNI_USER_DATE", columnNames = {"USER_ID", "PROC_DATE"}))
public class UserStudyTimeCalculate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proc_user_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull
    private User user;

    @Column(name = "proc_date", nullable = false)
    @NotNull
    private LocalDate procDate;

    @Column(name = "sum_study_time", nullable = false)
    @NotNull
    private int sumStudyTime;
}
