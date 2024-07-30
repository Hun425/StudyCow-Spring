import React, { useState } from 'react';
import './styles/PlanList.css';
import deleteButton from './img/deleteButton.png';
import editButton from './img/editButton.png';

const PlanList = ({ plans }) => {
  const [updatedPlans, setUpdatedPlans] = useState(plans);

  const sub_code_dic = {
    '1': '국어',
    '2': '수학',
    '3': '영어',
    '4': '한국사',
    '5': '사회탐구',
    '6': '과학탐구',
    '7': '직업탐구',
    '8': '제2외국어/한문'
  }


  // 계획 상태 업데이트 함수
  const handleCheckboxChange = (planId) => {
    setUpdatedPlans(prevPlans =>
      prevPlans.map(plan =>
        plan.planId === planId
          ? { ...plan, planStatus: plan.planStatus === 0 ? 1 : 0 }
          : plan
      )
    );
  };



  return (
    <div className='singlePlanBox'>
      {updatedPlans.map(plan => (
        <div key={plan.planId}>
          {!plan.planStatus && (
            <div className='singlePlanContent'>
              <label>
                <input
                  type="checkbox"
                  checked={plan.planStatus === 1}
                  onChange={() => handleCheckboxChange(plan.planId)}
                />
                  {`0${plan.planStudyTime}:00`} {/* 입력된 시간 표시 */}
              </label>
              <p>{`${sub_code_dic[`${plan.subCode}`]}`} {/* 과목 표시 */}</p>
              <div className='buttonBox'>
                <button className='buttonCase'>
                  <img className="editButton" src={editButton} alt="수정버튼" />
                </button>
                <button className='buttonCase'>
                  <img className="deleteButton" src={deleteButton} alt="삭제버튼" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlanList;