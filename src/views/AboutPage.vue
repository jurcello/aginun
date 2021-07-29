<template>
  <v-container fluid class="pa-0">
    <v-row align="center" class="bg-light-green ma-2 pa-4 pa-md-16">
      <v-col class="col-12 col-md-8">
        <h1 class="white--text text-md-large mb-4">
          {{ $t("The rebellion needs your help") }}
        </h1>
        <p>
          {{
            $t(
              "We're in a climate and ecological crisis, and we need your help. Extinction Rebellion (XR) is one of the movements with the greatest potential to address this crisis, and one of the best ways you can contribute to XR is by helping in one or more volunteer roles."
            )
          }}
        </p>
        <p>
          {{
            $t(
              "XR is completely powered by volunteers: people just like you who use their time, skills and resources to help in the best way they can. Most of the people who help in the movement have a concrete volunteer role as these role make the movement more organised, efficient and coordinated. In XR you can help in any role you can imagine: action coordinator, media spokesperson, writer, facilitator, secretary, photographer, artist, lawyer, strategist, and many more."
            )
          }}
        </p>
        <p class="mb-0 mt-10">
          {{
            $t(
              "If you want to help in XR, apply to one of the many available volunteer roles.  You can help out in a role even if you have a few hours available each week"
            )
          }}
        </p>
        <router-link
          class="v-btn rounded bg-black white--text my-4"
          to="/roles"
          >{{ $t("Find role") }}</router-link
        >
        <p class="mb-0">
          {{
            $t(
              "If you are already volunteering in XR and need more help, make sure to publish volunteer roles so you can find people who want to help you out."
            )
          }}
        </p>
        <router-link
          class="v-btn rounded bg-black white--text my-4"
          to="/roles/new"
        >
          {{ $t("Publish role") }}
        </router-link>
      </v-col>
      <v-col
        class="col-12 col-md-4 d-flex flex-column align-center order-md-last"
      >
        <img
          class="w-50"
          src="@/assets/images/xr-join-rebellion-stamp.svg"
          :alt="$t('Join the rebellion')"
        />
      </v-col>
    </v-row>
    <v-row align="center" class="bg-light-blue ma-2 pa-4 pa-md-16">
      <v-col class="col-12">
        <h1 class="white--text text-center text-md-start text-md-large">
          {{ $t("Made by volunteers for volunteers") }}
        </h1>
      </v-col>
      <v-col class="col-12 col-md-8">
        <p>
          {{
            $t(
              "We, the creators of this platform, are also volunteers of Extinction Rebellion.  During our time in XR we've observed that a few dedicated volunteers are doing so much of the work, and that if only there were a few more people helping them out the movement could have a much greater impact. At the same time, we've seen how hundreds of people have wanted to help in XR but simply didn't know how.  With this peer-to-peer volunteer platform, we aim to connect those people who need help, with those people who want to help."
            )
          }}
        </p>
        <p>
          {{
            $t(
              "Currently, this platform is only being used in XR Netherlands, but we aim to make it usable by XR groups worldwide and any other progressive movements that need help with finding help. That's one reason why this platform is free and open-source: any movement can use, copy, study, and edit the code, texts and designs of the platform."
            )
          }}
        </p>
        <p>
          {{
            $t(
              "Lastly, we can improve the platform in whichever way you want. Because we've made this platform in a short time with a small team of volunteers, there might be things that don't work perfectly or there might be missing features that could make the platform much more useful. However, you can help improve the platform by sharing your feedback or by helping directly. Either way, we really value your help so that we can make this platform more useful for you and all other volunteers. "
            )
          }}
        </p>
        <router-link
          class="v-btn rounded bg-black white--text my-4"
          to="/support"
        >
          {{ $t("Help improve the platform") }}
        </router-link>
      </v-col>
    </v-row>
    <v-row align="center" class="bg-green ma-2 pa-4 pa-md-16">
      <v-col class="col-12">
        <h1 class="white--text text-center text-md-start text-md-large">
          {{ $t("Want to learn more?") }}
        </h1>
      </v-col>
      <v-col class="col-12 col-md-8 white--text">
        <ul>
          <i18n
            path="Do you want to learn more about what XR is and what it stands for? {link}"
            tag="li"
          >
            <template v-slot:link>
              <a class="white--text" :href="URLabout" target="_blank">
                {{ $t("Visit the XR NL website") }}
              </a>
            </template>
          </i18n>
          <i18n
            path="Do you want to learn more about how XR works? {link}"
            tag="li"
          >
            <template v-slot:link>
              <a class="white--text" :href="URLabout" target="_blank">
                {{ $t("Visit the XR NL structure page") }}
              </a>
            </template>
          </i18n>
          <i18n
            path="Do you want to learn more about other ways to help out in XR? {link}"
            tag="li"
          >
            <template v-slot:link>
              <a class="white--text" :href="URLjoin" target="_blank">
                {{ $t("Visit the XR NL join page") }}
              </a>
            </template>
          </i18n>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "AboutPage",
  data() {
    return {
      websiteBaseURL: "https://extinctionrebellion.nl/",
      websiteEndpoints: {
        about: {
          nl: "over-ons/",
          en: "en/about-us/"
        },
        structure: {
          nl: "structuur/",
          en: "en/structure/"
        },
        join: {
          nl: "doe-mee/",
          en: "en/join/"
        }
      }
    };
  },
  computed: {
    URLabout: function() {
      return (
        this.websiteBaseURL + this.websiteEndpoints.about[this.$i18n.locale]
      );
    },
    URLstructure: function() {
      return (
        this.websiteBaseURL + this.websiteEndpoints.structure[this.$i18n.locale]
      );
    },
    URLjoin: function() {
      return (
        this.websiteBaseURL + this.websiteEndpoints.join[this.$i18n.locale]
      );
    }
  }
};
</script>
