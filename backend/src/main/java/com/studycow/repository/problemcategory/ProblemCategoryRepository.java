package com.studycow.repository.problemcategory;

import com.studycow.domain.ProblemCategory;
import com.studycow.domain.SubjectCode;
import org.springframework.data.repository.CrudRepository;

public interface ProblemCategoryRepository extends CrudRepository<ProblemCategory, Integer> {
}
