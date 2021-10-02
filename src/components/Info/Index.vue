<template>
  <div class="info-content">
    <div class="info-header">
      <img src="../../assets/images/logo.svg" />
      <div>
        <div class="info-app-title">ScreenTime</div>
        <div class="info-app-version">Version 5.0.0</div>
      </div>
    </div>
    <div class="about">
      <p>About ScreenTime</p>
      <div>
        Screentime is a flexible productivity tool that helps with
        tracking and management of time spent on websites. With Screentime,
        you can set a daily time cap or use the more flexible
        time-blocking scheduler, all from a simple, intuitive interface
      </div>
    </div>
    <div class="contributors">
      <p>Contributors</p>
      <div class="box">
        <contributor :details="contributors[0]" />
        <contributor class="second-contributor" :details="contributors[1]" />
      </div>
    </div>
    <p class="acknowledgment">Special thanks to Remix Icons. Your icons made this pop</p>
  </div>
</template>

<script>
import Contributor from './Contributor';

export default {
  name: 'Info',
  components: {
    Contributor
  },
  computed: {
    contributors() {
      return [
        {
          name: 'Femi Oladeji',
          image: 'femioladeji',
          twitter: 'https://twitter.com/femiodtexe',
          github: 'https://github.com/femioladeji'
        },
        {
          name: 'Femi Oladeji',
          image: 'femiabolaji',
          twitter: 'https://twitter.com/3eyedpixel',
          github: 'https://github.com/fabolaji',
          dribble: '#'
        }
      ];
    }
  }
};
</script>

<style scoped>
.info-content {
  padding: 24px;
}

.info-header {
  display: flex;
}

.info-header img {
  margin-right: 15px;
}

.info-app-title {
  font-size: 16px;
  font-weight: bold;
}

.info-app-version {
  color: #4F4F4F;
  font-size: 12px;
}

.about {
  margin-top: 34px;
}

.about p, .contributors p {
  font-weight: bold;
  font-size: 12px;
}

.about div {
  font-size: 12px;
  line-height: 20px;
  color: #4F4F4F;
}

.contributors {
  margin-top: 32px;
}

.second-contributor {
  margin-left: 54px;
}

.acknowledgment {
  margin-top: 32px;
  font-size: 12px;
  color: #4F4F4F;
}
</style>
