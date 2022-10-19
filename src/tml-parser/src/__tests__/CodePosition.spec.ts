import {CodePosition} from '../CodePosition';

const position = new CodePosition(0, 1, 2, 3);

test('CodePosition saves the field values correctly', () => {
  expect(position.startLineNumber).toBe(0);
  expect(position.endLineNumber).toBe(1);
  expect(position.startColNumber).toBe(2);
  expect(position.endColNumber).toBe(3);
});

test('CodePosition formats the string correctly', () => {
  expect(position.toString()).toBe('Ln 1:2, Col 3:4');
});
