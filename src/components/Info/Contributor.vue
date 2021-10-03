<!--eslint-disable import/no-dynamic-require-->
<template>
  <div class="box between">
    <slot />
    <div class="contributor-details">
      <div>{{ details.name }}</div>
      <a target="_blank" :href="details.twitter"><twitter-icon /></a>
      <a target="_blank" :href="details.github"><github-icon /></a>
      <a v-if="details.dribble" target="_blank" :href="details.dribble"
        ><dribble-icon
      /></a>
    </div>
  </div>
</template>

<script>
import TwitterIcon from '../atoms/Icons/Twitter';
import GithubIcon from '../atoms/Icons/Github';
import DribbleIcon from '../atoms/Icons/Dribble';

export default {
  name: 'Contributor',
  components: {
    TwitterIcon,
    GithubIcon,
    DribbleIcon
  },
  props: {
    details: {
      type: Object,
      required: true
    }
  }
};
</script>

<style>
.contributor-details {
  margin-left: 18px;
}

.contributor-details div {
  margin-bottom: 4px;
}

.contributor-details a {
  margin-right: 10px;
}

.contributor-details svg path {
  fill: #4F4F4F;
}

body.dark-mode .contributor-details svg path {
  fill: #BDBDBD;
}
</style>
