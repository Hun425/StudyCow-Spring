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
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        // PlannerGetDto에 대한 명시적 매핑 추가
        modelMapper.createTypeMap(UserSubjectPlan.class, PlannerGetDto.class)
                .setConverter(context -> {
                    UserSubjectPlan source = context.getSource();
                    return new PlannerGetDto(
                            Integer.parseInt(String.valueOf(source.getPlanId())),
                            source.getUser().getId(),
                            Integer.parseInt(String.valueOf(source.getSubCode())),
                            source.getPlanDate(),
                            source.getPlanContent(),
                            source.getPlanStudyTime(),
                            source.getPlanStatus()
                    );
                });
        return modelMapper;
    }



}
