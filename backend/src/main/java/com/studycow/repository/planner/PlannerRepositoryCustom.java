package com.studycow.repository.planner;

import jakarta.persistence.PersistenceException;

public interface PlannerRepositoryCustom {
    Integer planStudyTime(int userId, int subCode) throws PersistenceException;
}
