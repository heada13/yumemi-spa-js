<template>
  <div>
    <!-- {{ radioButton.selected }} -->
    <Chart :data="data.population" :population="radioButton.selected" />
    <div class="radio-button">
      <div v-for="(label, index) in radioButton.label" :key="index">
        <input
          type="radio"
          v-model="radioButton.selected"
          :value="label"
          :key="label"
        /><label>{{ label }}</label>
      </div>
    </div>
    <div class="checkbox-container">
      <div
        class="checkbox-item"
        v-for="(pref, index) in data.prefectures"
        :key="index"
      >
        <input
          type="checkbox"
          v-model="data.prefcode"
          :name="pref.prefCode"
          :value="pref"
          @change="getCheckedPopulation"
        />
        <label>{{ pref.prefName }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  useContext,
} from "@nuxtjs/composition-api";
import Chart from "@/components/Chart.vue";
import PrefData from "@/model/prefData.js";

export default defineComponent({
  components: {
    Chart,
  },
  setup() {
    onMounted(() => {
      getPrefectures();
    });

    // const { $config } = useContext();
    const { $axios, $config } = useContext();

    const radioButton = reactive({
      label: ["総人口", "年少人口", "生産年齢人口", "老年人口"],
      selected: "総人口",
    });

    const data = reactive({
      prefectures: [],
      prefcode: [],
      population: [],
    });

    const baseURL = $config.baseURL;
    const headers = {
      "Content-Type": "application/json",
      "X-API-KEY": $config.apiKey,
    };

    const getCheckedPopulation = () => {
      const p = data.prefcode;
      let tmpdata = [];
      for (let i in p) {
        getPopulation(p[i].prefCode)
          .then((result) => {
            console.log("result", p[i]);
            tmpdata.push(new PrefData(p[i], result));
          })
          .catch((err) => {
            console.log(err);
          });
      }
      data.population = tmpdata;
    };

    const getPopulation = async (code) => {
      const populationUrl = `${baseURL}api/v1/population/composition/perYear?cityCode=-&prefCode=${code}`;
      const res = await $axios.$get(populationUrl, { headers: headers });
      return res;
    };

    const getPrefectures = async () => {
      const prefecturesUrl = `${baseURL}api/v1/prefectures`;
      const res = await $axios.$get(prefecturesUrl, { headers: headers });
      data.prefectures = res.result;
    };

    return { data, getCheckedPopulation, radioButton };
  },
});
</script>

<style>
.checkbox-container {
  width: 600px;
  display: flex;
  flex-flow: row wrap;
}

.checkbox-item {
  margin: 10px;
}

.radio-button {
  display: flex;
  flex-direction: column;
}
</style>
