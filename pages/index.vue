<template>
  <h1>Encuestas</h1>
</template>

<script>
export default {
  middleware: [
    function ({ redirect }) {
      return redirect('/login')
    },
  ],
}
</script>
