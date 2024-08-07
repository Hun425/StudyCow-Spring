package com.studycow.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * <pre>
 *     문제 유형 도메인 클래스
 * </pre>
 * @author 노명환
 * @since JDK17
 */

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "t_category", indexes =
@Index(name = "idx_status", columnList = "cat_status"))
public class ProblemCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cat_code")
    private int code;

    @Column(name = "cat_name", length = 50)
    private String name;

    @Column(name = "cat_status", nullable = false)
    @NotNull
    private int status;

    @Column(name = "cat_in_date", nullable = false)
    @NotNull
    private LocalDateTime inDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_code", nullable = false)
    @NotNull
    private SubjectCode subjectCode;
}
