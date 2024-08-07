package com.studycow.service.planner;

import com.studycow.domain.SubjectCode;
import com.studycow.domain.User;
import com.studycow.domain.UserSubjectPlan;
import com.studycow.dto.plan.PlanCountByDateDto;
import com.studycow.dto.plan.PlannerCreateDto;
import com.studycow.dto.plan.PlannerGetDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.exception.CustomException;
import com.studycow.exception.ErrorCode;
import com.studycow.repository.planner.PlannerRepository;
import com.studycow.repository.subjectcode.SubjectCodeRepository;
import com.studycow.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 플래너 Service
 * <pre>
 *     플래너 기본 CRUD와 조회 서비스
 * </pre>
 * @author 채기훈
 * @since JDK17
 */

@Service
@RequiredArgsConstructor
@Transactional
public class PlannerServiceImpl implements PlannerService {

    private final PlannerRepository plannerRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final SubjectCodeRepository subjectCodeRepository;

    /**
     * 플래너 생성
     * @param customUserDetails 현재 생성자의 정보
     * @param plannerCreateDto 플래너 생성 정보
     */
    @Override
    public void createPlan(CustomUserDetails customUserDetails, PlannerCreateDto plannerCreateDto){

        User currentUser = userRepository.findById((long)customUserDetails.getUser().getUserId())
                .orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));

        SubjectCode initSubject = subjectCodeRepository.findById(plannerCreateDto.getSubCode())
                .orElseThrow(()->new CustomException(ErrorCode.NOT_FOUND_SUBJECT_CODE));

        UserSubjectPlan userSubjectPlan = new UserSubjectPlan();

        modelMapper.map(plannerCreateDto, userSubjectPlan);

        userSubjectPlan.setUser(currentUser);
        userSubjectPlan.setSubCode(initSubject);

        plannerRepository.save(userSubjectPlan);
    }

    /**
     * 플래너 생성일자 기준 조회
     * @param userId 현재 사용자
     * @param localDate 조회 일자
     * @return List<PlannerGetDto>
     */
    @Override
    public List<PlannerGetDto> getPlansByDateForUser(int userId, LocalDate localDate){
        List<UserSubjectPlan> plans = plannerRepository.findByUserIdAndPlanDate((long)userId,localDate)
                .orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));
        return convertToDtoList(plans);
    }

    /**
     * 플래너 과목코드 기준 조회
     * @param userId
     * @param subjectId
     * @return List<PlannerGetDto>
     */
    @Override
    public List<PlannerGetDto> getPlansBySubjectForUser(int userId, int subjectId) {
        SubjectCode subjectCode = subjectCodeRepository.findById(subjectId)
                .orElseThrow(()->new CustomException(ErrorCode.NOT_FOUND_SUBJECT_CODE));

        List<UserSubjectPlan> plans = plannerRepository.findByUserIdAndSubCode((long)userId,subjectCode)
                .orElseThrow(()->new CustomException(ErrorCode.NOT_FOUND_SUBJECT_CODE));
        return convertToDtoList(plans);
    }

    /**
     * 플래너 상세 정보 조회
     * @param userId 작성자 정보
     * @param planId 플래너 정보
     * @return
     */
    @Override
    public PlannerGetDto getPlanByIdForUser(int userId, int planId) {
        UserSubjectPlan plan = plannerRepository.findByUserIdAndPlanId((long)userId,(long)planId)
                .orElseThrow(()->new CustomException(ErrorCode.NOT_FOUND_PLANNER));
        PlannerGetDto currentPlan = modelMapper.map(plan, PlannerGetDto.class);

        return currentPlan;
    }

    /**
     * 플래너 잔디 조회
     * @param month
     * @param year
     * @param userId
     * @return
     */
    @Override
    public List<PlanCountByDateDto> getPlanCountByDateForUser(int month, int year, int userId) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
      List<PlanCountByDateDto> planCountByDateDto = plannerRepository.findPlanCountByMonth(startDate,endDate,userId)
                .orElseThrow(()->new CustomException(ErrorCode.INTERNAL_SERVER_ERROR));
        return planCountByDateDto;
    }


    /**
     * 플래너 업데이트
     * @param planId 업데이트할 플래너
     * @param customUser 작성 요청하는 사용자
     * @param plannerCreateDto 플래너 수정 사항
     */
    @Override
    public void updatePlan(int planId, CustomUserDetails customUser,PlannerCreateDto plannerCreateDto ){
        int userId = customUser.getUser().getUserId();

        UserSubjectPlan plan = plannerRepository.findById((long)planId)
                .orElseThrow(()->new CustomException(ErrorCode.NOT_FOUND_PLANNER));

        SubjectCode code = subjectCodeRepository.findById(plannerCreateDto.getSubCode())
                .orElseThrow(()->new CustomException(ErrorCode.NOT_FOUND_SUBJECT_CODE));

        if(userId !=plan.getUser().getId()){
            throw new CustomException(ErrorCode.NOT_AUTHENTICAION);
        }


        if(plan !=null){
            plan.setSubCode(code);
            plan.setPlanDate(plannerCreateDto.getPlanDate());
            plan.setPlanContent(plannerCreateDto.getPlanContent());
            plan.setPlanStudyTime(plannerCreateDto.getPlanStudyTime());
            plan.setPlanStatus(plannerCreateDto.getPlanStatus());
            plannerRepository.save(plan);
        }

    }

    /**
     * 플래너 삭제
     * @param planId 삭제할 플래너
     * @param customUser 요청하는 유저
     */
    @Override
    public void deletePlan(int planId, CustomUserDetails customUser) {
        UserSubjectPlan plan = plannerRepository.findById((long)planId)
                .orElseThrow(()->new CustomException(ErrorCode.NOT_FOUND_PLANNER));

        int userId = customUser.getUser().getUserId();

        if(userId != plan.getUser().getId()){
            throw new EntityNotFoundException("접근 권한이 없습니다");
        }

        plannerRepository.delete(plan);
    }

    /**
     * 플래너 미완료일때는 완료처리, 완료일때는 미완료 처리
     * @param planId
     * @param user
     */
    @Override
    public void changePlanStatus(int planId, CustomUserDetails user){
        UserSubjectPlan userSubjectPlan = plannerRepository.findById((long)planId)
                .orElseThrow(()->new CustomException(ErrorCode.NOT_FOUND_PLANNER));

        int nowStatus = userSubjectPlan.getPlanStatus();

        if(nowStatus==1)nowStatus=0;
        else nowStatus=1;

        userSubjectPlan.setPlanStatus(nowStatus);

        plannerRepository.save(userSubjectPlan);
    }


    /**
     * 플래너 Entity > Dto 변환 메서드
     * @param plans
     * @return
     */
    private List<PlannerGetDto> convertToDtoList(List<UserSubjectPlan> plans){
        try {
            return plans.stream().map(plan -> {
                try {
                    return modelMapper.map(plan, PlannerGetDto.class);
                } catch (Exception e) {
                    throw new CustomException(ErrorCode.WRONG_REQUEST_MAPPING);
                }

            }).collect(Collectors.toList());
        }catch (Exception e){
            throw new CustomException(ErrorCode.WRONG_REQUEST_MAPPING);
        }
    }


}
