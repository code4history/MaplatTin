import func2 from '../src/triangleTest';

const testSet = () => { 
  describe('Test by actual data', () => { 
    it('Compare with actual data', () => { 
      expect(func2()).toEqual(2);
    });
  });
};

describe("Test for Tin function", testSet);