import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import defaultProfile from "../assets/defaultProfile.png";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

const useInfoStore = create(
  persist(
    (set, get) => ({
      isLogin: false,
      token: null,
      userInfo: {
        userEmail: null,
        userPublic: 0,
        userThumb: defaultProfile,
        userGrade: {
          gradeCode: 0,
          gradeName: "브론즈",
          minExp: 0,
          maxExp: 0,
        },
        userExp: 0,
        userNickName: null,
      },

      sendRegisterRequest: async (userEmail, userPassword, userNickName) => {
        const data = {
          userEmail,
          userPassword,
          userNickName,
        };
        try {
          const response = await axios.post(
            API_URL + "api/v1/auth/register",
            data
          );
          if (response.status === 201) {
            return true;
          } else {
            throw new Error("회원가입 에러");
          }
        } catch (e) {
          console.log(e);
          return false;
        }
      },

      sendLoginRequest: async (userEmail, password) => {
        const data = { userEmail, password };
        try {
          const response = await axios.post(
            API_URL + "api/v1/auth/login",
            data
          );
          console.log(response.data);
          if (response.status === 200) {
            set({
              token: response.data.token ?? null,
              isLogin: true,
              userInfo: {
                userEmail: response.data.userEmail ?? null,
                userNickName: response.data.userNickName ?? null,
                userThumb: response.data?.userThumb ?? defaultProfile,
                userGrade: {
                  gradeCode: response.data.userGrade.gradeCode ?? 0,
                  gradeName: response.data.userGrade.gradeName ?? "브론즈",
                  minExp: response.data.userGrade.minExp ?? 0,
                  maxExp: response.data.userGrade.maxExp ?? 0,
                },
                userExp: response.data.userExp ?? 0,
              },
            });
            return true;
          } else {
            throw new Error("로그인에러");
          }
        } catch (e) {
          console.log(e);
          return false;
        }
      },

      logout: (navigate) => {
        set({ isLogin: false, token: null });
        navigate("/login");
      },

      resign: (navigate) => {
        set({ isLogin: false });
        navigate("/login");
      },

      ChangeInfoUrl: API_URL + "user/me",

      updateUserInfo: async (email, nickname, thumb, publicStatus) => {
        try {
          const { token, ChangeInfoUrl, userInfo } = get();
          if (!token) {
            console.error("토큰이 없습니다.");
            return false;
          }
          const formData = new FormData();
          if (thumb) {
            formData.append("file", thumb);
          }
          formData.append("userEmail", email);
          formData.append("userNickname", nickname);

          console.log("보내는 데이터:", formData);
          console.log("토큰:", token);

          const response = await axios.patch(ChangeInfoUrl, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.status === 200) {
            set({
              userInfo: {
                ...userInfo,
                userEmail: email,
                userNickName: nickname,
                userThumb: thumb ? thumb : userInfo.userThumb, // createObjectURL 제거
                userPublic: publicStatus,
              },
            });
            return true;
          } else {
            throw new Error("회원정보 변경에 실패했습니다.");
          }
        } catch (error) {
          console.error("Error updating user info:", error);
          return false;
        }
      },
    }),
    {
      name: "info-storage",
    }
  )
);

export default useInfoStore;
