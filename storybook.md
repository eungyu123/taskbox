스토리북 기본 구성 단계
컴포넌트와 하위 스토리들

1. 컴포넌트
   스토리(story)
   스토리(story)
   스토리(story)

```
export default {
  component: Task,
  title: "Task",
  tags: ["autodocs"],
  //👇 "Data"로 끝나는 export들은 스토리가 아닙니다.
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
};
```

component: 컴포넌트 자체
title: 스토리북 사이드바에서 컴포넌트를 그룹화하거나 분류
tags: 컴포넌트에 대한 문서를 자동 생성
excludeStories: 스토리에 필요하지만 스토리북에서 렌더링 되지 않아야 하는 추가정보
args: 컴포넌트가 사용자 정의 이벤트를 모킹하기 위해 기대하는 액션 args 정의

Component Story Format 3 (CSF3로도 알려진)를 사용하여 테스트 케이스 구현

```
export const ActionsData = {
  onArchiveTask: fn(),
  onPinTask: fn(),
};

// fn()을 사용하면 클릭 시 스토리북 UI의 Actions 패널에 나타나는 콜백을 생성할 수 있습니다. 따라서 핀 버튼을 만들 때 버튼 클릭이 UI에서 성공적으로 이루어졌는지를 확인할 수 있습니다.

```

```
// .storybook/preview.js
/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

```

매개변수(parameters)는 일반적으로 스토리북의 기능과 애드온의 동작을 제어하는 데 사용됩니다. 하지만 이번 경우에는 그 목적으로 사용하지 않을 것입니다. 대신에 우리는 애플리케이션의 CSS 파일을 import할 것입니다.

```
//src/components/Task.jsx
  Task.PropTypes = {
    /** Composition  of the Task  */
    task: PropTypes.shape({
      /** Id of the Task */
      id: PropTypes.string.isRequired,
      /** Title of the task */
      title: PropTypes.string.isRequired,
      /** Current state of the  task*/
      state: PropTypes.string.isRequired,
    }),
    /** Event to change the task to archived */
    onArchiveTask: PropTypes.func,
    /** Event to change the task to pinned */
    onPinTask: PropTypes.func,
  };
```

컴포넌트에 필요한 데이터 형태를 명시하려면 리액트(React)에서 propTypes를 사용하는 것이 가장 좋습니다. 이는 자체적 문서화일 뿐만 아니라, 문제를 조기에 발견하는 데 도움이 됩니다.

접근성 문제 발견하기

접근성 테스트는 WCAG 규칙 및 기타 업계의 모범 사례를 기반한 일련의 경험적 방법과 함께 자동화 도구를 사용하여 렌더링된 DOM을 검사하는 관행의미
시각,청각, 인지 장애인등이 사용하게 보장

play 함수를 사용하여 컴포넌트 테스트 작성하기

스토리북의 play 함수와 @storybook/addon-interactions가 이를 돕습니다. play 함수는 작업이 업데이트 될 때 UI에 어떤 일이 발생하는지 확인한다.

```
  await waitFor(async () => {
      // simulates pinning the first task
      await fireEvent.click(canvas.getByLabelText("pinTask-1"));
      // simulates pinning the third task
      await fireEvent.click(canvas.getByLabelText("pinTask-3"));
    });
```

이런식으로 클릭했을때 발생하는 이벤트 처리

상호작용 테스트는 스토리를 볼때만 실행됨

변경사항이 있을 경우 모든 검사를 위해 각 스토리를 봐야함
test runner를 통해 자동화 가능

Playwright로 구동되는 독립형 유틸리티로 모든 상호작용 테스트를 실행하고 오류가 있는 스토리를 포착

yarn add -D playwright
yarn playwright install
이렇게 설치해줘야한다.

1. 수동테스트
2. 접근성 테스트
   a11y 애드온을 사용
3. 컴포넌트 테스트
   play 함수 사용

4. 시각 테스트 (시각 회귀 테스트)
   변경시 이후와 이전을 비교하여 테스트
