<template>
  <div>
    <highchart :options="chartOptions" />
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "Chart",
  props: {
    data: { type: Array, default: () => [] },
    population: { type: String, default: () => "" },
  },
  setup(props) {
    watch(
      () => [props.data, props.population],
      () => getSeries()
    );

    const getPopulationType = (data) => {
      if (props.population === "総人口") return data.totalPopulation;
      if (props.population === "年少人口") return data.youngPopulation;
      if (props.population === "生産年齢人口") return data.workingAgePopulation;
      if (props.population === "老年人口") return data.elderlyPopulation;
    };

    const getSeries = () => {
      chartOptions.series = props.data.map((d) => {
        const population = getPopulationType(d);
        const data = population[0].data.map((v) => v.value);
        const year = population[0].data.map((v) => v.year);
        const name = d.prefName;
        return { name: name, data: data, x: year };
      });
    };

    const chartOptions = reactive({
      chart: {
        polar: false,
        // height: "500px",
        width: "700",
      },
      title: {
        text: "県別人口推移",
      },
      // subtitle: {
      //   text: "Source: thesolarfoundation.com",
      // },
      yAxis: {
        title: {
          text: "人口",
        },

        // labels: {
        //   formatter: function () {
        //     return highchart.numberFormat(this.value, 0, "", ",") + " 千人";
        //   },
        // },
      },
      xAxis: {
        title: {
          text: "年",
        },
        labels: {
          formatter: function () {
            return this.value;
          },
        },
        // tickInterval: 5,
        // accessibility: {
        //   rangeDescription: "Range: 2010 to 2017",
        // },
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointStart: 1960,
        },
      },
      series: [],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom",
              },
            },
          },
        ],
      },
    });

    return {
      chartOptions,
    };
  },
});
</script>

<style>
/* .highcharts-figure,
.highcharts-data-table table {
  min-width: 360px;
  max-width: 800px;
  margin: 1em auto;
} */
</style>
