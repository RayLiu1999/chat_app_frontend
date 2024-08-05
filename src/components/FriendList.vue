<template>
	<div class="bg-#0d1245 w-60 p-4">
		<div class="mb-4">
			<input class="bg-#14175a w-full rounded p-2 text-white" placeholder="搜尋或開始一個對話" type="text"
				@click="console.log(123)" />
		</div>
		<div class="button-hover space-y-2 p-1">
			<div class="flex items-center space-x-2">
				<i class="bi bi-person-fill" style="font-size: 1.5rem"></i>
				<span class="text-gray-400"> 好友 </span>
			</div>
		</div>
		<div class="mt-4">
			<p class="text-3 mb-2 text-gray-400">私人訊息</p>
			<div class="button-hover mb-2 flex items-center p-1">
				<div class="default-image w-40px h-40px mr-2">
					<img alt="User" class="size-10" src="@/assets/images/user1.jpg" />
				</div>
				<span class="text-gray-400"> ホタル </span>
				<span class="ml-auto">
					<i class="bi bi-x"></i>
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup></script>

<style scoped></style>