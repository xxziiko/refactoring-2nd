import { Province, sampleProvinceData } from "./Province";

// 1. 픽스처(province) 생성
describe("Province", () => {
  let asia: Province;

  beforeEach(() => {
    asia = new Province(sampleProvinceData());
  });

  // 2. 픽스처의 속성을 검증한다.
  it("shortFall", () => {
    expect(asia.shortfall).toEqual(5);
  });

  it("profit", () => {
    expect(asia.profit).toEqual(230);
  });
});
