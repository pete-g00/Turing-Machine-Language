import {CodePosition} from '../CodePosition';
import {CodeWrapper} from '../CodeWrapper';

const code = `alphabet = {0, 1}
module basic {
    move right
    accept
}`;

const brokenCode = [
  ['alphabet', '=', '{', '0', ',', '1', '}'],
  ['module', 'basic', '{'],
  ['move', 'right'],
  ['accept'],
  ['}'],
];

function _moveToEnd(wrapper: CodeWrapper): void {
  for (let i = 0; i < brokenCode.length; i++) {
    for (let j = 0; j < brokenCode[i].length; j++) {
      wrapper.moveNext();
    }
  }
}

test('CodeWrapper throws an error when we try to read the code before moving next', () => {
  const wrapper = new CodeWrapper(code);
  expect(() => {
    wrapper.currentValue;
  }).toThrow(new Error('No current value.'));
});

test('CodeWrapper throws an error when we try to get the current position before moving next', () => {
  const wrapper = new CodeWrapper(code);
  expect(() => {
    wrapper.currentPosition;
  }).toThrow(new Error('No current position.'));
});

test('CodeWrapper returns the same values as the expected ones', () => {
  const wrapper = new CodeWrapper(code);
  for (let i = 0; i < brokenCode.length; i++) {
    for (let j = 0; j < brokenCode[i].length; j++) {
      expect(wrapper.moveNext()).toBe(true);
      expect(wrapper.currentValue).toBe(brokenCode[i][j]);
    }
  }
});

test('CodeWrapper cannot move to the next value after the code has been read', () => {
  const wrapper = new CodeWrapper(code);
  _moveToEnd(wrapper);

  expect(wrapper.moveNext()).toBe(false);
  expect(wrapper.moveNext()).toBe(false);
});

test('CodeWrapper returns the final value when getting the current value after the code has been read', () => {
  const wrapper = new CodeWrapper(code);
  _moveToEnd(wrapper);
  wrapper.moveNext();

  expect(wrapper.currentValue).toBe('}');
});

test('CodeWrapper return the final position when getting the current position after the code has been read', () => {
  const wrapper = new CodeWrapper(code);
  _moveToEnd(wrapper);
  wrapper.moveNext();
  const position = new CodePosition(4, 5, 0, 1);

  expect(wrapper.currentPosition).toEqual(position);
});

test('CodeWrapper correctly calculates the line numbers', () => {
  const wrapper: CodeWrapper = new CodeWrapper(code);

  for (let i = 0; i < brokenCode.length; i++) {
    for (let j = 0; j < brokenCode[i].length; j++) {
      expect(wrapper.moveNext()).toBe(true);

      expect(wrapper.currentPosition.startLineNumber).toBe(i);
      expect(wrapper.currentPosition.endLineNumber).toBe(i + 1);
    }
  }
});

test('CodeWrapper correctly calculates the column numbers', () => {
  const lines = code.split('\n');
  const wrapper = new CodeWrapper(code);
  let startIndex = 0;
  let endIndex = 0;

  for (let i = 0; i < brokenCode.length; i++) {
    for (let j = 0; j < brokenCode[i].length; j++) {
      expect(wrapper.moveNext()).toBe(true);

      startIndex = lines[i].indexOf(brokenCode[i][j], startIndex);
      endIndex = startIndex + brokenCode[i][j].length;

      expect(wrapper.currentPosition.startColNumber).toBe(startIndex);
      expect(wrapper.currentPosition.endColNumber).toBe(endIndex);
    }
    startIndex = 0;
  }
});
