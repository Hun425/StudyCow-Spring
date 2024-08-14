package com.studycow.config;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.studycow.domain.UserSubjectPlan;
import com.studycow.dto.plan.PlannerGetDto;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.module.jsr310.Jsr310Module;
import org.modelmapper.spi.MappingContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

/**
 * App 설정 클래스
 * @author 채기훈
 * @since JDK17
 */
@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.registerModule(new Jsr310Module());

        return modelMapper;
    }



}
