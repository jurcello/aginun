<template>
  <div>
    <the-app-bar />
    <feedback-alert />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import TheAppBar from "@/components/TheAppBar.vue";
import FeedbackAlert from "@/components/FeedbackAlert.vue";

export default {
  name: "App",
  components: {
    TheAppBar,
    FeedbackAlert
  }
};
</script>
<style lang="scss" scoped>
main {
  padding-top: $navbar-height;

  @include media-breakpoint-up(md) {
    padding-top: $navbar-height-md;
  }
}
</style>
