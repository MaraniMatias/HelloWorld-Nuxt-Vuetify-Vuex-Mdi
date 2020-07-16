<template>
  <h1>Encuestas</h1>
</template>

<router>
  meta:
    withoutAuth: true
</router>

<script>
export default {
  middleware: [
    function ({ redirect }) {
      return redirect('/login')
    },
  ],
}
</script>
