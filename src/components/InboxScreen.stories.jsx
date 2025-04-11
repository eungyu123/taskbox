import InboxScreen from "./InboxScreen";
import store from "../lib/store";

import { Provider } from "react-redux";
import { http, HttpResponse } from "msw";
import { MockedState } from "./TaskList.stories";
import {
  fireEvent,
  waitFor,
  within,
  waitForElementToBeRemoved,
} from "@storybook/test";
export default {
  component: InboxScreen,
  title: "InboxScreen",
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ["autodocs"],
};

export const Default = {
  parameters: {
    msw: {
      handlers: [
        http.get("https://jsonplaceholder.typicode.com/todos?userId=1", () => {
          return HttpResponse.json(MockedState.tasks);
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // waits for the components to transition from the loading state
    await waitForElementToBeRemoved(await canvas.findByTestId("loading"));
    // waits for the component to be updated based on the store
    await waitFor(async () => {
      // simulates pinning the first task
      await fireEvent.click(canvas.getByLabelText("pinTask-1"));
      // simulates pinning the third task
      await fireEvent.click(canvas.getByLabelText("pinTask-3"));
    });
  },
};

export const Error = {
  parameters: {
    msw: {
      handlers: [
        http.get("https://jsonplaceholder.typicode.com/todos?userId=1", () => {
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};
