package com.studycow.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * <pre>
 *     과목별 성적 도메인 클래스
 * </pre>
 * @author 노명환
 * @since JDK17
 */

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "t_score", uniqueConstraints =
@UniqueConstraint(name = "UNI_USER_SUB_DATE", columnNames = {"user_id", "sub_code", "test_date"}))
@Data
public class UserSubjectScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "score_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_code", nullable = false)
    @NotNull
    private SubjectCode subjectCode;

    @Column(name = "test_date", nullable = false)
    @NotNull
    private LocalDate testDate;

    @Column(name = "test_score", nullable = false)
    @NotNull
    private int testScore;

    @Column(name = "test_grade")
    private Integer testGrade;

    @Column(name = "score_update_date", nullable = false)
    @NotNull
    private LocalDateTime updateDate;

    @OneToMany(mappedBy = "userSubjectScore")
    private List<WrongProblem> wrongProblems;
}