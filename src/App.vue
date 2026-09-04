<script setup lang="ts">
import { ref } from "vue";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import { extractXhsLink, xhsApi } from "./request";

const url = ref("");
const appid = ref("");
const hasNoPersonalInfoRisk = ref(false);
const isLoading = ref(false);

function clearUrl() {
  url.value = "";
  appid.value = "";
  hasNoPersonalInfoRisk.value = false;
}

async function getAppid() {
  const link = extractXhsLink(url.value.trim());
  if (!link) {
    toast.error("请输入正确链接格式");
    return;
  }

  isLoading.value = true;
  appid.value = "";
  hasNoPersonalInfoRisk.value = false;
  try {
    const response = await xhsApi(link);
    if (!response.success) {
      throw new Error(response.message || "解析失败");
    }

    if (response.data?.user_id === null) {
      hasNoPersonalInfoRisk.value = true;
      toast.success("解析成功");
      return;
    }

    if (!response.data?.user_id) {
      throw new Error(response.message || "解析失败");
    }

    appid.value = response.data.user_id;
    toast.success("解析成功");
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

  <main class="relative min-h-screen w-full bg-neutral-950 px-4 text-white">
    <section class="flex min-h-screen min-w-0 items-center justify-center">
      <div class="flex w-full max-w-md flex-col">
        <div class="flex items-center justify-center gap-2">
          <h1 class="text-2xl font-bold tracking-tight">UnLink</h1>
          <a
            href="https://github.com/llds66/unlink"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="访问 UnLink GitHub 仓库"
            class="text-neutral-400 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            <div class="i-carbon-logo-github text-xl " aria-hidden="true" />
          </a>
        </div>
        <p class="mt-3 text-center  leading-5 text-neutral-400">
        输入分享链接，检测是否泄露个人信息
        </p>
        <form class="mt-6 flex gap-2" @submit.prevent="getAppid">
          <div class="relative min-w-0 flex-1">
            <input
              v-model="url"
              type="text"
              autocomplete="off"
              placeholder="输入小红书APP分享链接或者内容"
              aria-label="小红书链接或分享文案"
              class="w-full rounded-lg border border-neutral-700 bg-neutral-900 py-2.5 pl-3 pr-10 text-base text-white outline-none transition placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-700"
            />
            <button
              v-if="url"
              type="button"
              aria-label="清空链接"
              class="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-neutral-500 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              @click="clearUrl"
            >
              <span class="i-carbon-close text-lg" aria-hidden="true" />
            </button>
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-24 shrink-0 items-center justify-center rounded-lg bg-white px-4 py-2.5 font-medium text-neutral-950 transition duration-200 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500"
          >
            <span
              v-if="isLoading"
              class="i-svg-spinners-3-dots-bounce text-xl"
              aria-label="加载中"
            />
            <span v-else>检测链接</span>
          </button>
        </form>

        <div class="mt-5 flex h-11 items-center justify-center px-4">
          <a
            v-if="appid && url"
            :href="`https://www.xiaohongshu.com/user/profile/${appid}`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-950 transition duration-200 hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            <div class="i-carbon-link"></div>
            跳转至用户主页
          </a>
          <span v-else-if="hasNoPersonalInfoRisk" class="text-sm text-neutral-300">
            没有个人信息泄露风险
          </span>
        </div>

      </div>
    </section>
    <p class="absolute inset-x-4 bottom-6 flex items-center justify-center gap-1 text-center text-xs text-neutral-500">
      <span class="i-carbon-information" aria-hidden="true" />
      当前仅支持小红书 App 分享文案及微信分享
    </p>
  </main>
</template>
