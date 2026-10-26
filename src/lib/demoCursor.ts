/**
 * 데모 커서와 같은 모양의 마우스 포인터.
 *
 * 연출이 지나간 자리에 사람이 손을 올렸을 때 포인터 모양이 달라지면 둘이
 * 다른 것처럼 보인다 — 방금 본 동그라미가 곧 내 커서라는 게 이어져야
 * "나도 눌러 볼 수 있다" 로 읽힌다. 지름 30 + 흰 테두리 2.
 */
export const POINTER_SKIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34'%3E%3Ccircle cx='17' cy='17' r='15' fill='rgba(77,87,97,0.7)' stroke='white' stroke-width='2'/%3E%3C/svg%3E\") 17 17, auto"
