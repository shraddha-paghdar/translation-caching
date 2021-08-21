// Mock Axios
import axios from 'axios';
jest.mock('axios');

test("Mock Axios", () => {
  axios.post.mockImplementation(() => Promise.resolve({
    data: {
      "translations": [
        {
          "translatedText": "¡Hola Mundo!"
        }
      ]
    }
  }));
});
