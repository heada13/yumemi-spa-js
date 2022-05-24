export default class PrefData {
  constructor(obj1, obj2) {
    this.prefCode = obj1.prefCode;
    this.prefName = obj1.prefName;
    this.data = obj2.result.data;
  }

  get totalPopulation() {
    return this.data.filter((v) => v.label === "総人口");
  }

  get youngPopulation() {
    return this.data.filter((v) => v.label === "年少人口");
  }

  get workingAgePopulation() {
    return this.data.filter((v) => v.label === "生産年齢人口");
  }

  get elderlyPopulation() {
    return this.data.filter((v) => v.label === "老年人口");
  }
}
