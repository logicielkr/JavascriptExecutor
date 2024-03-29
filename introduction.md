# 실시간 Javascript 실행기 기능 개요 및 주요 화면

이 프로그램은 메모장 프로그램에서 Javascript 실행 기능을 추가한 것으로서, 외관은 [메모장 프로그램 기능 개요 및 주요 화면](https://github.com/logicielkr/memo/blob/master/introduction.md) 과 거의 유사하다.

메모장 프로그램과의 차이는 입력/수정 화면에서 Javascript 코드를 실행하고, 그 결과를 확인할 수 있다는 차이가 있다.

여기서는 입력/수정 기능에서 Javascript 코드를 실행하는 것을 중심으로 살펴보기로 하고, 나머지 기능은 [메모장 프로그램 기능 개요 및 주요 화면](https://github.com/logicielkr/memo/blob/master/introduction.md) 을 참고하면 된다.

## 1. 입력/수정 기능

입력/수정 기능의 기본 화면은 다음과 같다.

<img src="http://graha.kr/static-contents/images/javascript/insert.png" alt="입력/수정 기능" />

외부의 javascript 파일을 불러와서 사용해야 경우 외부소스에 입력한다.

- URL 만 입력하면 되고,
- 여러개의 URL 은 줄바꿈을 해서 입력하면 된다.

실행할 javascript 코드는 외부소스 아래의 입력창에 입력하면 된다.

- 미리 정의된 log 라는 함수를 사용하면, 아래쪽에 결과창에 로그를 찍을 수 있다.

javascript를 실행하기 위해서는 제목 입력창 오른쪽의 execute 버튼을 클릭하거나, Ctrl + Enter을 입력하면 된다.

## 2. 상세보기 기능

상세보기 기능의 기본 화면은 다음과 같다.

<img src="http://graha.kr/static-contents/images/javascript/detail.png" alt="상세보기 기능" />

메모장 프로그램과 비교하면 다음과 같이 차이가 있다.

- 화면에 외부소스와 실행결과를 표시한다.
- 소스코드는 javascript로 highlight 처리한다.