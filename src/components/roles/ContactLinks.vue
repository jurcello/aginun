<template>
  <div>
    <icon-link
      :href="
        `mailto:${role.email}?subject=${$t('Role application')}: ${role.title}`
      "
      :link-text="role.email"
      :label="$t('Email')"
      icon="envelope"
    />
    <icon-link
      class="mt-3 mt-md-2"
      :href="
        `https://organise.earth/xr-netherlands/messages/${role.mattermostId}`
      "
      :link-text="role.mattermostId"
      :label="$t('Mattermost')"
      icon="chat-left"
    />
    <icon-link
      v-if="role.phone"
      class="mt-3 mt-md-2"
      :href="`tel:${role.phone}`"
      :link-text="role.phone"
      :label="$t('Phone')"
      icon="telephone-fill"
    />
  </div>
</template>

<script>
import IconLink from "@/components/IconLink";

export default {
  name: "ContactLinks",
  components: {
    IconLink
  },
  props: {
    role: {
      required: true,
      type: Object
    }
  }
};
</script>
