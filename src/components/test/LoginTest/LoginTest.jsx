import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../../firebase';
import { TestContainer, TestTitle, TestButton, LoadingMessage, ResultContainer, ResultTitle, ResultItem, ErrorContainer, ErrorTitle, ErrorItem, InfoContainer, InfoTitle, InfoItem } from './LoginTest.styles';

const LoginTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Google 로그인 시작...');
      
      // 1. Google 로그인
      const { user } = await signInWithPopup(auth, provider);
      console.log('Google 로그인 성공:', user.email);

      // 2. Firebase idToken 획득
      const idToken = await user.getIdToken();
      console.log('Firebase idToken 획득 성공');

      // 3. 백서버로 idToken 전송
      console.log('백서버로 idToken 전송 시작...');
      const response = await fetch('https://buynow.n-e.kr/v1/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_token: idToken
        })
      });

      console.log('백서버 응답 상태:', response.status);
      console.log('백서버 응답 헤더:', response.headers);

      // 4. 응답 처리
      if (response.ok) {
        const data = await response.json();
        console.log('백서버 응답 성공:', data);
        setResult({
          success: true,
          data: data,
          userEmail: user.email,
          idToken: idToken.substring(0, 20) + '...' // 보안을 위해 일부만 표시
        });
      } else {
        const errorData = await response.text();
        console.error('백서버 응답 실패:', response.status, errorData);
        setError({
          status: response.status,
          message: errorData,
          userEmail: user.email
        });
      }

    } catch (err) {
      console.error('로그인 테스트 오류:', err);
      setError({
        message: err.message,
        type: 'login_error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TestContainer>
      <TestTitle>백서버 로그인 테스트</TestTitle>
      
      <TestButton 
        onClick={handleGoogleLogin} 
        disabled={loading}
      >
        {loading ? '테스트 중...' : 'Google 로그인 + 백서버 테스트'}
      </TestButton>

      {loading && (
        <LoadingMessage>Google 로그인 및 백서버 통신 중...</LoadingMessage>
      )}

      {result && (
        <ResultContainer>
          <ResultTitle>✅ 테스트 성공</ResultTitle>
          <ResultItem>
            <strong>사용자 이메일:</strong> {result.userEmail}
          </ResultItem>
          <ResultItem>
            <strong>Firebase idToken:</strong> {result.idToken}
          </ResultItem>
          <ResultItem>
            <strong>백서버 응답:</strong>
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          </ResultItem>
        </ResultContainer>
      )}

      {error && (
        <ErrorContainer>
          <ErrorTitle>❌ 테스트 실패</ErrorTitle>
          <ErrorItem>
            <strong>오류 타입:</strong> {error.type || 'server_error'}
          </ErrorItem>
          {error.status && (
            <ErrorItem>
              <strong>HTTP 상태:</strong> {error.status}
            </ErrorItem>
          )}
          {error.userEmail && (
            <ErrorItem>
              <strong>사용자 이메일:</strong> {error.userEmail}
            </ErrorItem>
          )}
          <ErrorItem>
            <strong>오류 메시지:</strong>
            <pre>{error.message}</pre>
          </ErrorItem>
        </ErrorContainer>
      )}

      <InfoContainer>
        <InfoTitle>테스트 정보</InfoTitle>
        <InfoItem>• Google 로그인 후 Firebase idToken 획득</InfoItem>
        <InfoItem>• 백서버 엔드포인트: https://buynow.n-e.kr/accounts/login</InfoItem>
        <InfoItem>• 요청 방식: POST</InfoItem>
        <InfoItem>• Content-Type: application/json</InfoItem>
        <InfoItem>• 브라우저 콘솔에서 상세 로그 확인 가능</InfoItem>
      </InfoContainer>
    </TestContainer>
  );
};

export default LoginTest; 