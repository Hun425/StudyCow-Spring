import React, { useEffect } from "react";
import useGradeStore from "../../stores/grade";
import useInfoStore from "../../stores/infos";
import "./styles/AnalyzeWeakBlock.css";

const AnalyzeWeakBlock = () => {
  const { weaknessTop3, fetchWeaknessPart, selectedSubject } = useGradeStore();
  const { userInfo } = useInfoStore();

  useEffect(() => {
    // 사용자 정보와 선택된 과목이 있는 경우에만 데이터를 가져옴
    if (userInfo && userInfo.userId && selectedSubject) {
      // 취약점 데이터를 가져오는 함수를 호출
      fetchWeaknessPart(userInfo.userId, selectedSubject);
    }
  }, [userInfo, selectedSubject, fetchWeaknessPart]); // 해당 값들이 변경될 때마다 효과가 실행(의존성 배열)

  return (
    <div className="analyzeWeakBlock">
      <h4>가장 많이 틀리는 취약점 Top 3</h4>
      {/* weaknessTop3 객체에 데이터가 있는지 확인 */}
      {Object.keys(weaknessTop3).length > 0 ? (
        <div className="weaknessList">
          {/* weaknessTop3 객체의 각 항목을 매핑하여 리스트 아이템으로 표시 */}
          {Object.entries(weaknessTop3).map(([category, count], index) => (
            <div key={index} className="weaknessItem">
              <p className="weaknessCategory">{category}</p>
              <p className="weaknessCount">{count}회</p>
            </div>
          ))}
        </div>
      ) : (
        // weaknessTop3가 비어있는 경우 (데이터 로딩 중 또는 데이터 없음) 표시할 메시지
        <p>데이터를 불러오는 중이거나 취약점 데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default AnalyzeWeakBlock;
