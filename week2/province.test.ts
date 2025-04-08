import { Province, sampleProvinceData } from "./Province";

// 1. 픽스처(province) 생성
describe("Province", () => {
  // 2. 픽스처의 속성을 검증한다.

  it("shortFall", () => {
    const asia = new Province(sampleProvinceData());
    expect(asia.shortfall).toEqual(5);
  });

  it("profit", () => {
    const asia = new Province(sampleProvinceData());
    expect(asia.profit).toEqual(230);
  });
});
