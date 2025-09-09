<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
  <!-- <div class="w-100% flex"> -->
  <RouterView @contextmenu.prevent />
  <!-- </div> -->
</template>

<style lang="scss">
  .default-image {
    // background: url('@/assets/images/user.jpg') no-repeat center center/cover;
    overflow: hidden;
    border-radius: 50%;
  }

  .default-banner {
    background: gray no-repeat center center/cover;
    overflow: hidden;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    position: relative;
  }

  .el-dialog.custom-full-dialog {
    padding: 0;
    border-radius: 0.5rem;
    background-color: #333354;
    background-color: #01013b;
  }

  .el-dialog.custom-dialog {
    padding: 0;
    border-radius: 0.5rem;
    background-color: #333354;
    background-color: #01013b;
    width: var(--dialog-width);
    max-width: 90%;
  }

  @media (min-width: 768px) {
    .el-dialog.custom-dialog {
      --dialog-width: 50%;
    }
  }
  @media (min-width: 1024px) {
    .el-dialog.custom-dialog {
      --dialog-width: 40%;
    }
  }

  /* header {
    line-height: 1.5;
    max-height: 100vh;
  }

  .logo {
    display: block;
    margin: 0 auto 2rem;
  }

  nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
  }

  nav a.router-link-exact-active {
    color: var(--color-text);
  }

  nav a.router-link-exact-active:hover {
    background-color: transparent;
  }

  nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
  }

  nav a:first-of-type {
    border: 0;
  }

  @media (min-width: 1024px) {
    header {
      display: flex;
      place-items: center;
      padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
      margin: 0 2rem 0 0;
    }

    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }

    nav {
      text-align: left;
      margin-left: -1rem;
      font-size: 1rem;

      padding: 1rem 0;
      margin-top: 1rem;
    }
  } */
</style>
