<template>
  <div>
    <NavBar />
    <FeedbackAlert />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import FeedbackAlert from "@/components/FeedbackAlert.vue";

export default {
  name: "App",
  components: {
    NavBar,
    FeedbackAlert,
  },
};
</script>
<style lang="scss" scoped>
main {
  padding-top: $navbar-height;
}
</style>
