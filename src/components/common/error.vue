<template>
  <p class="page-container">{{ $route.params.msg }}</p>
</template>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  font-size: 20px;
  text-align: center;
  color: rgb(192, 204, 218);
  top: 35%;
  position: absolute;
}
</style>