import { HorizontalBar } from 'vue-chartjs';
import storage from '../assets/js/storage';

export default {
  extends: HorizontalBar,
  async mounted() {
    const data = await storage.getData();
    // const data = { facebook: 40, instagram: 20, twitter: 30, youtube: 19 };
    const values = Object.values(data).map(each => (each / 60).toFixed(2));
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: Object.keys(data),
      datasets: [{
        label: `Stats for ${storage.getCurrentDate()}`,
        // label: 'Stats for today',
        backgroundColor: '#f87979',
        data: values
      }]
    }, {
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: 'hours'
          }
        }],
        yAxes: [{
          barThickness: 'flex'
        }]
      }
    });
  }
};
