<script setup lang="ts">
import { ref } from "vue";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import { xhsApi } from "./request";

const url = ref("");
const appid = ref("");
const isLoading = ref(false);

async function getAppid() {
  const link = url.value.trim();
  if (!link) {
    toast.error("请输入小红书分享链接");
    return;
  }

  isLoading.value = true;
  appid.value = "";
  try {
    const response = await xhsApi(link);
    if (!response.success || !response.data?.appuid) {
      throw new Error(response.message || "未获取到 appid");
    }
    appid.value = response.data.appuid;
    toast.success("获取成功");
  } catch (error) {
    console.log(error);
    toast.error(error instanceof Error ? error.message : "获取失败，请稍后重试");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <Toaster position="top-center" :closeButton="true" closeButtonPosition="top-right" />

  <main class="min-h-screen w-full bg-neutral-950 px-4 text-white">
    <section class="flex min-h-screen min-w-0 items-center justify-center">
      <div class="flex w-full max-w-md flex-col">
        <h1 class="text-center text-2xl font-bold tracking-tight">UnLink</h1>

        <form class="mt-6 flex gap-2" @submit.prevent="getAppid">
          <input
            v-model="url"
            type="url"
            inputmode="url"
            autocomplete="url"
            placeholder="小红书分享链接（APP端）"
            aria-label="小红书链接"
            class="min-w-0 flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-base text-white outline-none transition placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-700"
          />
          <button
            type="submit"
            :disabled="isLoading"
            class="flex shrink-0 items-center justify-center rounded-lg bg-white px-4 py-2.5 font-medium text-neutral-950 transition duration-200 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500"
          >
            <span
              v-if="isLoading"
              class="i-svg-spinners-3-dots-bounce text-xl"
              aria-label="加载中"
            />
            <span v-else>获取用户主页</span>
          </button>
        </form>

        <div v-if="appid && url" class="mt-5 flex px-4 py-3 justify-center items-center">
          <a
            :href="`https://www.xiaohongshu.com/user/profile/${appid}`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex gap-1 items-baseline-last text-sm text-neutral-400 underline underline-offset-4 transition hover:text-white"
          >
          <div class="i-carbon-link"></div>
            小红书用户主页
          </a>
        </div>
      </div>
    </section>
  </main>
</template>
