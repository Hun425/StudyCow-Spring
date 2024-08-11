package com.studycow.metrics;

import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class StudyTimerMetrics {
    private final MeterRegistry registry;

    public StudyTimerMetrics(MeterRegistry registry) {
        this.registry = registry;
    }

    public void recordTimerUpdate() {
        registry.counter("application.study.timer.updates").increment();
    }

    public void recordTimerUpdateTime(long milliseconds) {
        registry.timer("application.study.timer.update.time").record(milliseconds, TimeUnit.MILLISECONDS);
    }

    public void recordDatabaseWriteTime(long milliseconds) {
        registry.timer("application.study.timer.database.write.time").record(milliseconds, TimeUnit.MILLISECONDS);
    }

    public void setActiveStudyRooms(long count) {
        registry.gauge("application.study.active.rooms", count);
    }
}