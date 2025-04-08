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

  // 설정-실행-검증 패턴
  // 일반적으로 it 구문 하나당 검증도 하나씩 하는게 좋다. (실패 시 원인 파악 쉬움)
  // 이 테스트는 두 가지 검증을 한 번에 하고 있음. (한 테스트로 묶어도 문제되지 않을 정도로 두 속성이 밀접하다고 판단)
  it("change production", () => {
    asia.producers[0].production = 20;
    expect(asia.shortfall).toEqual(-6);
    expect(asia.profit).toEqual(292);
  });

  // 경계 조건 테스트 (0, 음수 등)
  it("zero demand", () => {
    asia.demand = 0;
    expect(asia.shortfall).toEqual(-25);
    expect(asia.profit).toEqual(0);
  });

  it("negative demand", () => {
    asia.demand = -1;
    expect(asia.shortfall).toEqual(-26);
    expect(asia.profit).toEqual(-10);
  });

  // 의미상 숫자만 입력 받아야 하지만 문자열을 취해야 하는 경우
  it("empty string demand", () => {
    asia.demand = "";
    expect(asia.shortfall).toBeNaN();
    expect(asia.profit).toBeNaN();
  });
});

describe("no producers", () => {
  let noProducers: Province;

  beforeEach(() => {
    const data = {
      name: "No producers",
      producers: [],
      demand: 30,
      price: 20,
    };
    noProducers = new Province(data);
  });

  it("shortfall", () => {
    expect(noProducers.shortfall).toEqual(30);
  });

  it("profit", () => {
    expect(noProducers.profit).toEqual(0);
  });
});

describe("string for producers", () => {
  it("string for producers", () => {
    const data = {
      name: "String producers",
      producers: ["Producer"],
    };
    const prov = new Province(data);
    expect(prov.shortfall).toEqual(30);
  });
});
